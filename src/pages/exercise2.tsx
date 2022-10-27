/* eslint-disable */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Account,
  AssetFile,
  AssetService,
  BigNumber,
  Catalog,
  Config,
  FileMetadata,
  getCurrentAccount,
  getRoyaltyScheme,
  Logger,
  MetaData,
  RoyaltyKind,
} from '@nevermined-io/catalog-core'
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards'
import { BEM, UiFormInput, UiFormTextarea, UiPopupHandlers } from '@nevermined-io/styles'
import { Contract, ethers } from 'ethers'
import { appConfig, erc20TokenAddress } from 'config/config'
import { FileType } from 'utils/file-handler'
import { getFeesFromBigNumber } from 'utils/utils'
import LoadingIcon from 'components/loading-icon/loading-icon'
import { ReactComponent as SuccessIcon } from 'assets/icons/success.svg'
import { ReactComponent as NeverminedAbstractIcon } from 'assets/icons/nevermined-abstract.svg'

const b = BEM('nft-publish', {})

type NftPublishProps = unknown

export const Exercise2: React.FC<NftPublishProps> = () => {
  const { account, sdk } = Catalog.useNevermined()
  const {
    assetPublish,
    handleChange,
    errorAssetMessage,
    setErrorAssetMessage,
    setAssetPublish,
    publishNFT1155,
  } = AssetService.useAssetPublish()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [fileUrl, setFileUrl] = useState('')
  const [popupProps, setPopupProps] = useState<{
    message?: string | React.ReactElement
    additionalMessage?: string
    icon?: React.ReactElement
    confirm?: () => void
    cancel?: () => void
    show?: boolean
    showCloseButton?: boolean
  }>({})
  const popupRef = useRef<UiPopupHandlers>()

  const resetValues = () => {
    setAssetPublish({
      name: '',
      author: '',
      description: '',
      type: '',
      category: 'None',
      protocol: 'None',
      network: 'None',
      price: 0,
      assetFiles: [],
    })
  }

  useEffect(() => {
    resetValues()
  }, [])

  const generateFilesMetadata = () => {
    const files: FileMetadata[] = []

    assetPublish.assetFiles.forEach((assetFile: AssetFile, i: number) => {
      files.push({
        index: i + 1,
        contentType: assetFile.content_type || '',
        url: 'https://uploads5.wikiart.org/00268/images/william-holbrook-beard/the-bear-dance-1870.jpg',
        contentLength: assetFile.size || '',
      })
    })

    return files
  }

  const generateMetadata = () => {
    const metadata = {
      curation: {
        rating: 0,
        numVotes: 0,
        isListed: true,
      },
      main: {
        name: assetPublish.name,
        dateCreated: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
        author: assetPublish.author,
        license: 'No License Specified',
        price: String(assetPublish.price),
        datePublished: new Date().toISOString().replace(/\.[0-9]{3}/, ''),
        type: 'dataset',
        network: assetPublish.network,
        files: generateFilesMetadata(),
      },
      additionalInformation: {
        description: assetPublish.description,
        blockchain: assetPublish.network,
        version: 'v1',
        source: 'filecoin',
      },
    } as MetaData

    return metadata
  }

  const constructRewardMap = (
    recipientsData: any[],
    priceWithoutFee: number,
    ownerWalletAddress: string,
  ): Map<string, BigNumber> => {
    const rewardMap: Map<string, BigNumber> = new Map()
    let recipients: any = []

    if (recipientsData.length === 1 && recipientsData[0].split === 0) {
      recipients = [
        {
          name: ownerWalletAddress,
          split: 100,
          walletAddress: ownerWalletAddress,
        },
      ]
    }

    let totalWithoutUser = 0

    recipients.forEach((recipient: any) => {
      if (recipient.split && recipient.split > 0) {
        const ownSplit = ((priceWithoutFee * recipient.split) / 100).toFixed()
        rewardMap.set(recipient.walletAddress, BigNumber.from(+ownSplit))
        totalWithoutUser += recipient.split
      }
    })

    if (!rewardMap.has(ownerWalletAddress)) {
      const ownSplitReinforced = +((priceWithoutFee * (100 - totalWithoutUser)) / 100).toFixed()
      rewardMap.set(ownerWalletAddress, BigNumber.from(ownSplitReinforced))
    }

    return rewardMap
  }

  const loadNeverminedConfigContract = async (
    config: Config,
    account: Account,
  ): Promise<Contract> => {
    const abiNvmConfig = `${config.artifactsFolder}/NeverminedConfig.mumbai.json`
    const contractFetched = await fetch(abiNvmConfig)
    const nvmConfigAbi = await contractFetched.json()

    return new ethers.Contract(
      nvmConfigAbi.address,
      nvmConfigAbi.abi,
      await account.findSigner(nvmConfigAbi.address),
    )
  }

  const publish = async () => {
    try {
      setPopupProps({
        message: 'Sending transactions to register the Asset in the network...',
        additionalMessage:
          'Please sign the transactions with Metamask. It could take some time to complete, but you will be notified when the Asset has been published.',
        icon: <LoadingIcon />,
      })

      const publisher = await getCurrentAccount(sdk)
      const rewardsRecipients: any[] = []
      const assetRewardsMap = constructRewardMap(rewardsRecipients, 1, publisher.getId())
      const assetRewards = new AssetRewards(assetRewardsMap)
      const configContract = await loadNeverminedConfigContract(appConfig, publisher)
      const networkFee = await configContract.getMarketplaceFee()

      if (networkFee.gt(0)) {
        assetRewards.addNetworkFees(await configContract.getFeeReceiver(), networkFee)
        Logger.log(`Network Fees: ${getFeesFromBigNumber(networkFee)}`)
      }

      const royaltyAttributes = {
        royaltyKind: RoyaltyKind.Standard,
        scheme: getRoyaltyScheme(sdk, RoyaltyKind.Standard),
        amount: 0,
      }

      if (
        !account.isTokenValid() ||
        account.getAddressTokenSigner().toLowerCase() !== publisher.getId().toLowerCase()
      ) {
        await account.generateToken()
      }

      try {
        await publishNFT1155({
          gatewayAddress: String(appConfig.gatewayAddress),
          assetRewards,
          metadata: generateMetadata(),
          nftAmount: BigNumber.from(1),
          preMint: true,
          cap: BigNumber.from(100),
          royaltyAttributes,
          erc20TokenAddress,
        })

        setPopupProps({
          message: 'Asset published successfully in the Marketplace',
          icon: <SuccessIcon />,
          showCloseButton: true,
        })
      } catch (error: any) {
        if (error.message.includes('Transaction was not mined within 50 blocks')) {
          setErrorAssetMessage(
            'Transaction was not mined within 50 blocks, but it might still be mined. Check later the Published Assets section in your Account',
          )
        }

        setPopupProps({
          message: errorAssetMessage,
          icon: <NeverminedAbstractIcon />,
          showCloseButton: true,
        })
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleSubmitClick = useCallback(
    async (e: React.SyntheticEvent<HTMLButtonElement>) => {
      e.preventDefault()

      const errors: Record<string, string> = {}

      if (!assetPublish.name) {
        errors.name = 'Name is required'
      }

      setErrors(errors)

      if (Object.keys(errors).length) {
        return
      }

      try {
        await publish()
      } catch (error: any) {
        setErrorAssetMessage(error.message)
      }
    },
    [assetPublish, fileUrl, setErrors],
  )

  return (
    <>
      <form className="nft-publish">
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" type="input" />
        </div>
        <button onClick={handleSubmitClick} className={b('button')}>
          Publish Asset
        </button>
      </form>
    </>
  )
}
