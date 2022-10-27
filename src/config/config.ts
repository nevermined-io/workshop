import { Config } from '@nevermined-io/nevermined-sdk-js'
import { AuthToken } from '@nevermined-io/catalog-core'
import { ethers } from 'ethers'

export const gatewayAddress = '0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc'
export const gatewayUri = 'https://gateway.mumbai.public.nevermined.network'
export const faucetUri = 'https://faucet.rinkeby.nevermined.rocks'
export const acceptedChainId = '80001' // for Mumbai
export const rootUri = 'http://localhost:3445'
export const marketplaceUri = 'https://marketplace-api.mumbai.public.nevermined.network'
const graphHttpUri = 'https://api.thegraph.com/subgraphs/name/nevermined-io/common'
export const erc20TokenAddress = '0xe11a86849d99f524cac3e7a0ec1241828e332c62'
export const nodeUri = 'https://matic-mumbai.chainstacklabs.com'
export const filecoinUploadUri = '/api/v1/gateway/services/upload/filecoin'
export const nftAddress = '0xAE04cD6F0d4026238AF24729640d6952a8649eea'

export const appConfig: Config = {
  web3Provider:
    typeof window !== 'undefined' ? window.ethereum : new ethers.providers.JsonRpcProvider(nodeUri),
  gatewayUri,
  faucetUri,
  verbose: true,
  gatewayAddress,
  graphHttpUri,
  marketplaceAuthToken: AuthToken.fetchMarketplaceApiTokenFromLocalStorage().token,
  marketplaceUri,
  artifactsFolder: `${rootUri}/contracts`,
}
