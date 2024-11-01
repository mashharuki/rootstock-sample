import {
  PrimeSdk,
  EtherspotBundler,
  ArkaPaymaster,
} from "@etherspot/prime-sdk";
import * as dotenv from "dotenv";

dotenv.config();

const { PRIVATE_KEY, CHAIN_ID, BUNDLER_API_KEY, CUSTOM_BUNDLER_URL } =
  process.env;

// SDK用の変数
let sdk;
// payMaster用の変数
let paymaster;

/**
 * AA用のPrime SDKインスタンスを作成するメソッド
 */
export const createPrimeSDK = () => {
  // インスタンスを作成
  const primeSdk = new PrimeSdk(
    { privateKey: PRIVATE_KEY },
    {
      chainId: Number(CHAIN_ID),
      bundlerProvider: new EtherspotBundler(
        Number(CHAIN_ID),
        BUNDLER_API_KEY,
        CUSTOM_BUNDLER_URL
      ),
    }
  );

  sdk = primeSdk;
};

/**
 * paymasterを設定するメソッド
 */
export const setUpPaymaster = async () => {
  const arka_api_key = "arka_public_key";
  const arka_url = "https://arka.etherspot.io";
  const paymaster = new ArkaPaymaster(CHAIN_ID, arka_api_key, arka_url);
  // show paymaster info
  console.log(await paymaster.metadata());
  // console.log(await paymaster.getTokenPaymasterAddress("USDC"));
  /*
  console.log(
    await paymaster.addWhitelist(["0xB3aF6CFDDc444B948132753AD8214a20605692eF"])
  );
  console.log(
    await paymaster.removeWhitelist([
      "0xB3aF6CFDDc444B948132753AD8214a20605692eF",
    ])
  );
  */
  console.log(
    await paymaster.checkWhitelist("0xB3aF6CFDDc444B948132753AD8214a20605692eF")
  );
  // console.log(await paymaster.deposit(0.000000001));
};

/**
 * アドレスを取得するためのメソッド
 */
export const getAddress = async () => {
  // get EtherspotWallet address...
  const address: string = await sdk.getCounterFactualAddress();
  console.log("\x1b[33m%s\x1b[0m", `EtherspotWallet address: ${address}`);

  return address;
};
