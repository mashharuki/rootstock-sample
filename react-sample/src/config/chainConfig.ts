import { CHAIN_NAMESPACES, CustomChainConfig } from "@web3auth/base";

export const chain: {
  [key: string]: CustomChainConfig;
} = {
  sepolia: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0xaa36a7",
    displayName: "Ethereum Sepolia",
    tickerName: "Ethereum",
    ticker: "ETH",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    logo: "https://web3auth.io/images/web3authlog.png",
  },
  rootStockTestnet: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x1f",
    rpcTarget: "https://public-node.testnet.rsk.co",
    displayName: "Rootstock Testnet",
    blockExplorerUrl: "https://explorer.testnet.rootstock.io/",
    ticker: "tRBTC",
    tickerName: "tRBTC",
    logo: "https://pbs.twimg.com/profile_images/1592915327343624195/HPPSuVx3_400x400.jpg",
  },
  // SKALE: {
  //   chainNamespace: CHAIN_NAMESPACES.EIP155,
  //   chainId: "0x79f99296",
  //   rpcTarget: "https://mainnet.skalenodes.com/v1/elated-tan-skat",
  //   // Avoid using public rpcTarget in production.
  //   // Use services like Infura, Quicknode etc
  //   displayName: "SKALE Europa Hub Mainnet",
  //   blockExplorerUrl: "https://elated-tan-skat.explorer.mainnet.skalenodes.com/",
  //   ticker: "sFUEL",
  //   tickerName: "sFUEL",
  // },
};
