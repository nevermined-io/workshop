(()=>{var e,t={72835:(e,t,n)=>{"use strict";var o=n(67294),r=n(20745),a=n(23660),i=n(41426),c=n(82169);({NODE_ENV:"production"}).NEXT_PUBLIC_NFT_TIERS_AMOUNT&&i.BigNumber.parseEther({NODE_ENV:"production"}.NEXT_PUBLIC_NFT_TIERS_AMOUNT);var l;!function(e){e[e.CANCELLED=4001]="CANCELLED"}(l||(l={}));var s=n(76798);var d=function(e,t,n,o){return new(n||(n=Promise))((function(r,a){function i(e){try{l(o.next(e))}catch(e){a(e)}}function c(e){try{l(o.throw(e))}catch(e){a(e)}}function l(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(i,c)}l((o=o.apply(e,t||[])).next())}))};const m=({did:e})=>{const{sdk:t,account:n,isLoadingSDK:r,subscription:c}=i.Catalog.useNevermined(),{walletAddress:l,isAvailable:m,checkIsLogged:u}=a.MetaMask.useWallet(),[p,g]=(0,o.useState)(""),[h,v]=(0,o.useState)(!1),[f,b]=(0,o.useState)(!1),[y,w]=(0,o.useState)(!1);(0,o.useEffect)((()=>{!r&&(e=>e&&Object.keys(e).length>0)(t)&&d(void 0,void 0,void 0,(function*(){const o=yield t.metadata.retrieveDDO(e),r=yield t.nfts.getNftContractAddress(o);v(yield n.isNFT721Holder(r,l)),g(yield t.assets.owner(e))}))}),[r,l,f]);return o.createElement(s.AH,{className:"poap-widget"},o.createElement("img",{src:"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F380612549%2F843518150983%2F1%2Foriginal.20221026-075710?w=940&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C22%2C1920%2C960&s=0859c2925ea8fb1bb97bc856cce14f85"}),h?o.createElement(o.Fragment,null,o.createElement(s.II,null,"Already redeemed"),o.createElement("div",null,o.createElement(s.wg,{onClick:()=>(e=>d(void 0,void 0,void 0,(function*(){try{w(!0);const n=(yield t.accounts.list())[0];yield t.nfts.access(e,n)}catch(e){}finally{w(!1)}})))(e)},"Download"))):p!==l?o.createElement("div",null,o.createElement(s.wg,{onClick:()=>d(void 0,void 0,void 0,(function*(){try{const o=yield(0,i.getCurrentAccount)(t);n.isTokenValid()&&n.getAddressTokenSigner().toLowerCase()===o.getId().toLowerCase()||(yield n.generateToken());const r=yield c.buySubscription(e,o,p,i.BigNumber.from(1),721);b(Boolean(r))}catch(e){}})),disabled:r},"REDEEM")):o.createElement(s.II,null,"You are the owner"))},u="https://polygon-mumbai.g.alchemy.com/v2/z_wJkSCTxkgsmPT241x8SY_QHf2jmCzZ",p=`${window.location.protocol}//${window.location.host}/contracts`;var g=n(42718);const h=(0,g.zeroX)(1337..toString(16)),v=(0,g.zeroX)(8997..toString(16)),f=(0,g.zeroX)(80001..toString(16)),b=(0,g.zeroX)(137..toString(16)),y={development:{chainId:h,chainName:"Localhost development",nativeCurrency:{name:"Ethereum",symbol:"ETH",decimals:18},rpcUrls:["http://localhost:8545"],blockExplorerUrls:[""],iconUrls:["https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png"]},mumbai:{chainId:f,chainName:"Polygon Testnet Mumbai",nativeCurrency:{name:"Matic",symbol:"MATIC",decimals:18},rpcUrls:["https://matic-mumbai.chainstacklabs.com","https://rpc-endpoints.superfluid.dev/mumbai"],blockExplorerUrls:["https://mumbai.polygonscan.com/"],iconUrls:["https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png"]},mainnet:{chainId:b,chainName:"Polygon Mainnet",nativeCurrency:{name:"Matic",symbol:"MATIC",decimals:18},rpcUrls:["https://polygon-rpc.com"],blockExplorerUrls:["https://polygonscan.com/"],iconUrls:["https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png"]},returnConfig:e=>e===h||e===v?y.development:e===f?y.mumbai:e===b?y.mainnet:y.development},w={web3Provider:window.ethereum||new c.r,nodeUri:u,gatewayUri:"https://gateway.mumbai.public.nevermined.network",faucetUri:"/api/faucet",verbose:!0,gatewayAddress:"0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc",graphHttpUri:"https://api.thegraph.com/subgraphs/name/nevermined-io/public",marketplaceAuthToken:i.AuthToken.fetchMarketplaceApiTokenFromLocalStorage().token,marketplaceUri:"https://marketplace-api.mumbai.public.nevermined.network",artifactsFolder:p,secretStoreUri:"http://localhost:12001"};i.Logger.setLevel(3);const E=document.getElementById("nvm-poap-widget");if(E){const e=E.getAttribute("nvm-did");e&&(0,r.s)(E).render(o.createElement(i.Catalog.NeverminedProvider,{config:w},o.createElement(a.MetaMask.WalletProvider,{externalChainConfig:y,correctNetworkId:"80001",nodeUri:u},o.createElement(m,{did:e}))))}},88677:()=>{},62808:()=>{},9114:()=>{},74487:()=>{},46601:()=>{},89214:()=>{},71922:()=>{},2363:()=>{},52361:()=>{},94616:()=>{}},n={};function o(e){var r=n[e];if(void 0!==r)return r.exports;var a=n[e]={id:e,loaded:!1,exports:{}};return t[e].call(a.exports,a,a.exports,o),a.loaded=!0,a.exports}o.m=t,o.amdO={},e=[],o.O=(t,n,r,a)=>{if(!n){var i=1/0;for(d=0;d<e.length;d++){for(var[n,r,a]=e[d],c=!0,l=0;l<n.length;l++)(!1&a||i>=a)&&Object.keys(o.O).every((e=>o.O[e](n[l])))?n.splice(l--,1):(c=!1,a<i&&(i=a));if(c){e.splice(d--,1);var s=r();void 0!==s&&(t=s)}}return t}a=a||0;for(var d=e.length;d>0&&e[d-1][2]>a;d--)e[d]=e[d-1];e[d]=[n,r,a]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.nmd=e=>(e.paths=[],e.children||(e.children=[]),e),(()=>{var e={510:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var r,a,[i,c,l]=n,s=0;if(i.some((t=>0!==e[t]))){for(r in c)o.o(c,r)&&(o.m[r]=c[r]);if(l)var d=l(o)}for(t&&t(n);s<i.length;s++)a=i[s],o.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return o.O(d)},n=self.webpackChunknvm_one_widgets=self.webpackChunknvm_one_widgets||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var r=o.O(void 0,[216],(()=>o(72835)));r=o.O(r)})();
//# sourceMappingURL=widget-poap.js.map