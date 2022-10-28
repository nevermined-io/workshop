import { Nevermined, MetaData, Logger } from '@nevermined-io/nevermined-sdk-js'
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards'
import {
  getRoyaltyAttributes,
  RoyaltyKind,
} from '@nevermined-io/nevermined-sdk-js/dist/node/nevermined/Assets'
import { appConfig, erc20TokenAddress } from './config'
import { ethers, BigNumber } from 'ethers'
import { decodeJwt } from 'jose'
import TestContractHandler from './test-contract-handler'
import POAPUpgradeable from './poap-upgradeable.json'

Logger.setLevel(3)
const SEED_WORDS = process.env.SEED_WORDS as string
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS

const metadata: Partial<MetaData> = {
  main: {
    name: '',
    type: 'dataset',
    dateCreated: '2012-10-10T17:00:00Z',
    datePublished: '2012-10-10T17:00:00Z',
    author: 'Met Office',
    license: 'CC-BY',
    files: [
      {
        index: 0,
        contentType: 'application/json',
        url: 'https://github.com/nevermined-io/docs-legacy/raw/master/docs/architecture/specs/metadata/examples/ddo-example.json',
      },
      {
        index: 1,
        contentType: 'text/plain',
        url: 'https://github.com/nevermined-io/docs-legacy/raw/master/README.md',
      },
    ],
  },
  additionalInformation: {
    description: 'Weather information of UK including temperature and humidity',
    copyrightHolder: 'Met Office',
    workExample: '423432fsd,51.509865,-0.118092,2011-01-01T10:55:11+00:00,7.2,68',
    links: [
      {
        name: 'Sample of Asset Data',
        type: 'sample',
        url: 'https://foo.com/sample.csv',
      },
      {
        name: 'Data Format Definition',
        type: 'format',
        url: 'https://foo.com/sample.csv',
      },
    ],
    inLanguage: 'en',
    categories: ['Economy', 'Data Science'],
    tags: ['weather', 'uk', '2011', 'temperature', 'humidity'],
  },
}

export const generateMetadata = (
  name: string,
  nonce: string | number = Math.random(),
): Partial<MetaData> => ({
  ...metadata,
  main: {
    ...metadata.main,
    name,
    ...({ nonce } as any),
  },
  additionalInformation: {
    ...metadata.additionalInformation,
  },
})

export const getMetadata = (
  nonce: string | number = Math.random(),
  title = 'TestAsset',
): MetaData => generateMetadata(title, nonce) as MetaData
;(async () => {
  try {
    let poapContract: ethers.Contract
    const provider = new ethers.providers.JsonRpcProvider(appConfig.nodeUri)

    const gatewayAddress = appConfig.gatewayAddress as string

    Logger.log('Getting Account wallet ...')
    const walletMnemonic = ethers.Wallet.fromMnemonic(SEED_WORDS)

    Logger.log('Connecting account to the provider')
    const wallet = walletMnemonic.connect(provider)
    appConfig.accounts = [wallet]

    Logger.log('Getting Nervermined instance ...')
    const sdk = await Nevermined.getInstance(appConfig)

    Logger.log('Listing accounts...')
    const account = (await sdk.accounts.list())[0]

    Logger.log(`Account id: ${account.getId()}`)

    const clientAssertion = await sdk.utils.jwt.generateClientAssertion(account)

    Logger.log('Login to Marketplace API')
    await sdk.marketplace.login(clientAssertion)

    const payload = decodeJwt(appConfig.marketplaceAuthToken as string)

    const metadata = getMetadata()
    metadata.userId = payload.sub

    if (!CONTRACT_ADDRESS) {
      Logger.log('Deploying POAP contract')
      TestContractHandler.setConfig(appConfig)
      poapContract = await TestContractHandler.deployArtifact(POAPUpgradeable, account.getId())

      Logger.log(`Approving contract with address: ${poapContract.address}...`)
      await poapContract.setApprovalForAll(gatewayAddress, true, {
        from: account.getId(),
      })

      Logger.log('Adding minter...')
      await poapContract.addMinter(sdk.keeper.conditions.transferNft721Condition.address, {
        from: account.getId(),
      })
    } else {
      Logger.log(`Using created POAP contract ${CONTRACT_ADDRESS}`)
      poapContract = new ethers.Contract(CONTRACT_ADDRESS, POAPUpgradeable.abi, wallet)
    }

    const assetRewards = new AssetRewards(account.getId(), BigNumber.from(0))

    const networkFee = await sdk.keeper.nvmConfig.getNetworkFee()
    const feeReceiver = await sdk.keeper.nvmConfig.getFeeReceiver()

    assetRewards.addNetworkFees(feeReceiver, BigNumber.from(networkFee))

    Logger.log('Creating NFT721...')
    const poapDDO = await sdk.assets.createNft721(
      metadata,
      account,
      assetRewards,
      'PSK-RSA',
      poapContract.address,
      erc20TokenAddress,
      false,
      [gatewayAddress],
      getRoyaltyAttributes(sdk, RoyaltyKind.Standard, 0),
      undefined,
      ['nft-sales', 'nft-access'],
      false,
    )

    Logger.log(`POAP is created: ${JSON.stringify(poapDDO)}`)
  } catch (error: any) {
    Logger.error(error.message)
  }
})()
