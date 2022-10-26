import React from 'react'
import { toast } from 'react-toastify'
import {
  AssetFile,
  AssetService,
  Catalog,
  FileMetadata,
  getRoyaltyScheme,
  MetaData,
  RoyaltyKind,
  getCurrentAccount,
  BigNumber,
  Config,
  Account,
  Logger,
} from '@nevermined-io/catalog-core'
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards'
import { appConfig, erc20TokenAddress } from 'config/config'
import { FileType } from 'utils/file-handler'
import stepStyles from '../step.module.scss'
import styles from './files-step.module.scss'
import { Action, BEM, UiFormInput, UiFormItem } from '@nevermined-io/styles'
import { ReactComponent as DownloadIcon } from '../../../../assets/icons/download.svg'
import { ReactComponent as CrossIcon } from '../../../../assets/icons/cross.svg'
import { Contract, ethers } from 'ethers'
import { getFeesFromBigNumber } from 'utils/utils'

const step = BEM('step-container', stepStyles)
const b = BEM('files-step', styles)

type FilesStepProps = {
  currentStep: number
  goToPrevStep: () => void
  goToNextStep: () => void
}

export const FilesStep: React.FC<FilesStepProps> = ({
  currentStep,
  goToPrevStep,
  goToNextStep,
}) => {
  const { account, sdk } = Catalog.useNevermined()
  const { errorAssetMessage, setErrorAssetMessage, assetPublish, setAssetPublish, publishNFT1155 } =
    AssetService.useAssetPublish()

//   const uploadFiles = async () => {
//     const findLocal = assetPublish.assetFiles.find((file) => file.type === FileType.Local)

//     if (findLocal) {
//       await handleAssetFiles(assetPublish.assetFiles)
//     }
//   }

  const generateFilesMetadata = () => {
    const files: FileMetadata[] = []

    assetPublish.assetFiles.forEach((assetFile: AssetFile, i: number) => {
      files.push({
        index: i + 1,
        contentType: assetFile.content_type ? assetFile.content_type : '',
        url: 'https://uploads5.wikiart.org/00268/images/william-holbrook-beard/the-bear-dance-1870.jpg',
        contentLength: assetFile.size ? assetFile.size : '',
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
        // categories: [
        //   `ProtocolType:${assetPublish.category}`,
        //   `EventType:${assetPublish.protocol}`,
        //   `Blockchain:${assetPublish.network}`,
        //   `UseCase:defi-datasets`,
        //   `Version:v1`,
        // ],
        blockchain: assetPublish.network,
        version: 'v1',
        source: 'filecoin',
      },
    } as MetaData

    return metadata
  }

  const updateFilesAdded = (assetFile: AssetFile) => {
    const arrayFiles: AssetFile[] = assetPublish.assetFiles
    setAssetPublish({ ...assetPublish, assetFiles: [...arrayFiles, assetFile] })
  }

  const handleNewFile = function (e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target?.files?.length) {
      return
    }

    const file = e.target.files[0]
    const assetFile: AssetFile = {
      type: FileType.Local,
      name: file.name,
      label: file.name,
      size: String(file.size),
      content_type: file.type,
      file: file,
    }
    updateFilesAdded(assetFile)
  }

  const removeFile = (label: string) => {
    const arrayFiles: AssetFile[] = assetPublish.assetFiles

    const indexOfObject = arrayFiles.findIndex((assetFile) => {
      return assetFile.label === label
    })

    if (indexOfObject !== -1) {
      arrayFiles.splice(indexOfObject, 1)
      setAssetPublish({ ...assetPublish, assetFiles: [...arrayFiles] })
    }
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
      const publisher = await getCurrentAccount(sdk)
      const rewardsRecipients: any[] = []
      const assetRewardsMap = constructRewardMap(rewardsRecipients, 100, publisher.getId())
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

        toast.success('Asset published correctly in the Marketplace')
        goToNextStep()
      } catch (error: any) {
        if (error.message.includes('Transaction was not mined within 50 blocks')) {
          setErrorAssetMessage(
            'Transaction was not mined within 50 blocks, but it might still be mined. Check later the Published Assets section in your Account',
          )
        }
        toast.error(errorAssetMessage)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handleSubmitClick = async () => {
    try {
    //   await uploadFiles()
      await publish()
    } catch (error: any) {
      setErrorAssetMessage(error.message)
    }
  }

  return (
    <>
      <div className={step('step-title')}>
        <span className={step('step-title-icon')}>{currentStep}</span>
        <span className={step('step-title-text')}>Asset File</span>
      </div>
      <div className={step('files-step')}>
        <UiFormInput
          id="computer"
          className={step('step-form', ['file-upload'])}
          type="file"
          label={
            <div className={b('upload-button')}>
              <span className={b('upload-text')}>Upload file</span>
              <DownloadIcon className={b('upload-icon')} />
            </div>
          }
          onChange={handleNewFile}
          placeholder="Select the file"
        />
        {assetPublish.assetFiles.length > 0 && (
          <div className={b('files-container')}>
            {assetPublish.assetFiles.map((assetfile) => (
              <div className={b('files')} key={assetfile.label}>
                <UiFormItem
                  value={assetfile.label}
                  onClick={() => removeFile(assetfile.label)}
                  action={Action.Remove}
                  actionIcon={(action) => (
                    <>{action === 'remove' && <CrossIcon className={b('remove-icon')} />}</>
                  )}
                  disabled
                  readOnly
                />
              </div>
            ))}
          </div>
        )}
        <div className={b('buttons-container')}>
          <button type="submit" onClick={goToPrevStep} className={step('button', ['secondary'])}>
            Back
          </button>
          <button onClick={handleSubmitClick} className={step('button')}>
            Publish Asset
          </button>
        </div>
      </div>
    </>
  )
}
