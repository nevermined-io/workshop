import { AuthToken, Config } from '@nevermined-io/catalog-core'
import { ethers } from 'ethers'

export const neverminedNodeAddress = '0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc'
export const neverminedNodeUri = 'https://node.mumbai.public.nevermined.network'
export const faucetUri = 'https://faucet.rinkeby.nevermined.rocks'
export const acceptedChainId = '80001' // for Mumbai
export const rootUri = 'http://localhost:3445'
export const marketplaceUri = 'https://marketplace-api.mumbai.public.nevermined.network'
const graphHttpUri = 'https://api.thegraph.com/subgraphs/name/nevermined-io/public'
export const erc20TokenAddress = '0xe11a86849d99f524cac3e7a0ec1241828e332c62'
export const nodeUri = 'https://matic-mumbai.chainstacklabs.com'
export const filecoinUploadUri = '/api/v1/gateway/services/upload/filecoin'
export const nftAddress = '0xAE04cD6F0d4026238AF24729640d6952a8649eea'
export const poapDIDZeroX = '0x586a7fece25c9bff23b72f257ce2ab1495778921dedeb2a416dbbe07d62cc223'

export const appConfig: Config = {
  web3Provider:
    typeof window !== 'undefined' ? window.ethereum : new ethers.providers.JsonRpcProvider(nodeUri),
  neverminedNodeUri,
  faucetUri,
  verbose: 2,
  neverminedNodeAddress,
  graphHttpUri,
  marketplaceAuthToken: AuthToken.fetchMarketplaceApiTokenFromLocalStorage().token,
  marketplaceUri,
  artifactsFolder: `${rootUri}/contracts`,
  newGateway: true,
}
