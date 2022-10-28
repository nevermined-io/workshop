import { zeroX } from '@nevermined-io/nevermined-sdk-js/dist/node/utils'
import { acceptedChainId } from './config'

const acceptedChainIdHex = zeroX((+acceptedChainId).toString(16))
const spreeChainId = zeroX((8996).toString(16))
const polygonLocalnetChainId = zeroX((8997).toString(16))
export const mumbaiChainId = zeroX((80001).toString(16))
const mainnetChainId = zeroX((137).toString(16))

export const chainConfig = {
  development: {
    chainId: acceptedChainIdHex === spreeChainId ? spreeChainId : polygonLocalnetChainId,
    chainName: 'Localhost development',
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['http://localhost:8545'],
    blockExplorerUrls: [''],
    iconUrls: ['https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'],
  },
  mumbai: {
    chainId: mumbaiChainId,
    chainName: 'Polygon Testnet Mumbai',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: [
      'https://matic-mumbai.chainstacklabs.com',
      'https://rpc-endpoints.superfluid.dev/mumbai',
    ],
    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
    iconUrls: ['https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'],
  },
  mainnet: {
    chainId: mainnetChainId,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com/'],
    iconUrls: ['https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png'],
  },
  returnConfig: (chainIdHex: string) => {
    if (chainIdHex === spreeChainId || chainIdHex === polygonLocalnetChainId) {
      return chainConfig.development
    }
    if (chainIdHex === mumbaiChainId) {
      return chainConfig.mumbai
    }
    if (chainIdHex === mainnetChainId) {
      return chainConfig.mainnet
    }
    return chainConfig.development
  },
}
