import { Config } from '@nevermined-io/nevermined-sdk-js'

export const erc20TokenAddress = '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e'

export const appConfig: Config = {
  nodeUri: 'https://matic-mumbai.chainstacklabs.com',
  gatewayUri: 'https://gateway.mumbai.public.nevermined.network',
  faucetUri: 'https://faucet.rinkeby.nevermined.rocks',
  verbose: true,
  gatewayAddress: '0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc',
  graphHttpUri: 'https://api.thegraph.com/subgraphs/name/nevermined-io/public',
  marketplaceAuthToken: '',
  marketplaceUri: 'https://marketplace-api.mumbai.public.nevermined.network',
  artifactsFolder: `./public/contracts`,
}
