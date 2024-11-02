import {
  PrimeSdk,
  EtherspotBundler,
  ArkaPaymaster,
} from "@etherspot/prime-sdk";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
import { printOp, sleep } from "../helper/utils.ts";
import { createTransferFuntionData } from "./erc20.ts";
import { ERC20TokenAddress, ERC721TokenAddress } from "./contstants.ts";
import { createTransferNFTFunctionData } from "./erc721.ts";
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
  paymaster = new ArkaPaymaster(CHAIN_ID, arka_api_key, arka_url);
  // get paymaster maetadata
  const maetadata = await paymaster.metadata();
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

  console.log(`sponsorAddress: ${maetadata.sponsorAddress}`);
};

/**
 * paymasterにdepositするメソッド
 * @returns
 */
export const depositToPaymaster = async (to: string, amount: string) => {
  try {
    //既にホワイトリストに登録されているかチェックする。
    const registered = await paymaster.checkWhitelist(to);
    if (!registered) {
      await paymaster.addWhitelist([to]);
    }
    // deposit
    await paymaster.deposit(Number(amount));
  } catch (err: any) {
    console.error(`error occured when depositting: ${err}`);
  }
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

/**
 * コントラクトウォレットの残高を取得するメソッド
 */
export const getBalance = async () => {
  // get balance of the account address
  const balance = await sdk.getNativeBalance();

  console.log("balances: ", balance);
};

/**
 * シンプルな送金処理のためのメソッド
 */
export const simpleTransfer = async (to: string, amount: string) => {
  try {
    // clear the transaction batch
    await sdk.clearUserOpsFromBatch();

    // add transactions to the batch
    const transactionBatch = await sdk.addUserOpsToBatch({
      to: to,
      value: ethers.parseEther(amount),
    });
    console.log("transactions: ", transactionBatch);

    // estimate transactions added to the batch and get the fee data for the UserOp
    const op = await sdk.estimate();
    console.log(`Estimate UserOp: ${await printOp(op)}`);

    // sign the UserOp and sending to the bundler...
    const uoHash = await sdk.send(op);
    console.log(`UserOpHash: ${uoHash}`);

    // get transaction hash...
    console.log("Waiting for transaction...");
    let userOpsReceipt = null;
    const timeout = Date.now() + 60000; // 1 minute timeout
    while (userOpsReceipt == null && Date.now() < timeout) {
      await sleep(2);
      userOpsReceipt = await sdk.getUserOpReceipt(uoHash);
    }
    console.log("\x1b[33m%s\x1b[0m", `Transaction Receipt: `, userOpsReceipt);
    return userOpsReceipt;
  } catch (err: any) {
    console.error(`error occured when transferring: ${err}`);
    return null;
  }
};

/**
 * Paymasterにガス代を支払わせる場合の送金メソッド
 */
export const transferWithPaymaster = async (to: string, amount: string) => {
  try {
    // clear the transaction batch
    await sdk.clearUserOpsFromBatch();

    // add transactions to the batch
    const transactionBatch = await sdk.addUserOpsToBatch({
      to: to,
      value: ethers.parseEther(amount),
    });
    console.log("transactions: ", transactionBatch);

    // estimate transactions added to the batch and get the fee data for the UserOp
    const op = await sdk.estimate({
      paymasterDetails: {
        url: `https://arka.etherspot.io?apiKey=arka_public_key&chainId=${Number(
          CHAIN_ID
        )}`,
        context: { mode: "sponsor" },
      },
    });
    console.log(`Estimate UserOp: ${await printOp(op)}`);

    // sign the UserOp and sending to the bundler...
    const uoHash = await sdk.send(op);
    console.log(`UserOpHash: ${uoHash}`);

    // get transaction hash...
    console.log("Waiting for transaction...");
    let userOpsReceipt = null;
    const timeout = Date.now() + 60000; // 1 minute timeout
    while (userOpsReceipt == null && Date.now() < timeout) {
      await sleep(2);
      userOpsReceipt = await sdk.getUserOpReceipt(uoHash);
    }
    console.log("\x1b[33m%s\x1b[0m", `Transaction Receipt: `, userOpsReceipt);
    return userOpsReceipt;
  } catch (err: any) {
    console.error(`error occured when transferring: ${err}`);
    return null;
  }
};

/**
 * ERC20トークンを移転するメソッド
 */
export const transferERC20 = async (to: string, amount: string) => {
  // エンコードデータを作成
  const encodedData = await createTransferFuntionData(to, amount);
  console.log(encodedData);

  try {
    // clear the transaction batch
    await sdk.clearUserOpsFromBatch();

    // add transactions to the batch
    const transactionBatch = await sdk.addUserOpsToBatch({
      to: ERC20TokenAddress,
      data: encodedData,
    });
    console.log("transactions: ", transactionBatch);

    // estimate transactions added to the batch and get the fee data for the UserOp
    const op = await sdk.estimate();
    console.log(`Estimate UserOp: ${await printOp(op)}`);

    // sign the UserOp and sending to the bundler...
    const uoHash = await sdk.send(op);
    console.log(`UserOpHash: ${uoHash}`);

    // get transaction hash...
    console.log("Waiting for transaction...");
    let userOpsReceipt = null;
    const timeout = Date.now() + 60000; // 1 minute timeout
    while (userOpsReceipt == null && Date.now() < timeout) {
      await sleep(2);
      userOpsReceipt = await sdk.getUserOpReceipt(uoHash);
    }
    console.log("\x1b[33m%s\x1b[0m", `Transaction Receipt: `, userOpsReceipt);
    return userOpsReceipt;
  } catch (err: any) {
    console.error(`error occured when transferring: ${err}`);
    return null;
  }
};

/**
 * Paymasterにガス代を支払わせるERC20トークンを移転するメソッド
 */
export const transferERC20WithPaymaster = async (
  to: string,
  amount: string
) => {
  // エンコードデータを作成
  const encodedData = await createTransferFuntionData(to, amount);
  console.log(encodedData);

  try {
    // clear the transaction batch
    await sdk.clearUserOpsFromBatch();

    // add transactions to the batch
    const transactionBatch = await sdk.addUserOpsToBatch({
      to: ERC20TokenAddress,
      data: encodedData,
    });
    console.log("transactions: ", transactionBatch);

    // estimate transactions added to the batch and get the fee data for the UserOp
    const op = await sdk.estimate({
      paymasterDetails: {
        url: `https://arka.etherspot.io?apiKey=arka_public_key&chainId=${Number(
          CHAIN_ID
        )}`,
        context: { mode: "sponsor" },
      },
    });
    console.log(`Estimate UserOp: ${await printOp(op)}`);

    // sign the UserOp and sending to the bundler...
    const uoHash = await sdk.send(op);
    console.log(`UserOpHash: ${uoHash}`);

    // get transaction hash...
    console.log("Waiting for transaction...");
    let userOpsReceipt = null;
    const timeout = Date.now() + 60000; // 1 minute timeout
    while (userOpsReceipt == null && Date.now() < timeout) {
      await sleep(2);
      userOpsReceipt = await sdk.getUserOpReceipt(uoHash);
    }
    console.log("\x1b[33m%s\x1b[0m", `Transaction Receipt: `, userOpsReceipt);
    return userOpsReceipt;
  } catch (err: any) {
    console.error(`error occured when transferring: ${err}`);
    return null;
  }
};

/**
 * ERC721トークンを移転するメソッド
 */
export const transferNFT = async (
  from: string,
  to: string,
  tokenId: number
) => {
  // エンコードデータを作成
  const encodedData = await createTransferNFTFunctionData(from, to, tokenId);
  console.log(encodedData);

  try {
    // clear the transaction batch
    await sdk.clearUserOpsFromBatch();

    // add transactions to the batch
    const transactionBatch = await sdk.addUserOpsToBatch({
      to: ERC721TokenAddress,
      data: encodedData,
    });
    console.log("transactions: ", transactionBatch);

    // estimate transactions added to the batch and get the fee data for the UserOp
    const op = await sdk.estimate();
    console.log(`Estimate UserOp: ${await printOp(op)}`);

    // sign the UserOp and sending to the bundler...
    const uoHash = await sdk.send(op);
    console.log(`UserOpHash: ${uoHash}`);

    // get transaction hash...
    console.log("Waiting for transaction...");
    let userOpsReceipt = null;
    const timeout = Date.now() + 60000; // 1 minute timeout
    while (userOpsReceipt == null && Date.now() < timeout) {
      await sleep(2);
      userOpsReceipt = await sdk.getUserOpReceipt(uoHash);
    }
    console.log("\x1b[33m%s\x1b[0m", `Transaction Receipt: `, userOpsReceipt);
    return userOpsReceipt;
  } catch (err: any) {
    console.error(`error occured when transferring: ${err}`);
    return null;
  }
};

/**
 * Paymasterにガス代を支払わせるERC721トークンを移転するメソッド
 */
export const transferNFTWithPaymaster = async (
  from: string,
  to: string,
  tokenId: number
) => {
  // エンコードデータを作成
  const encodedData = await createTransferNFTFunctionData(from, to, tokenId);
  console.log(encodedData);

  try {
    // clear the transaction batch
    await sdk.clearUserOpsFromBatch();

    // add transactions to the batch
    const transactionBatch = await sdk.addUserOpsToBatch({
      to: ERC721TokenAddress,
      data: encodedData,
    });
    console.log("transactions: ", transactionBatch);

    // estimate transactions added to the batch and get the fee data for the UserOp
    const op = await sdk.estimate({
      paymasterDetails: {
        url: `https://arka.etherspot.io?apiKey=arka_public_key&chainId=${Number(
          CHAIN_ID
        )}`,
        context: { mode: "sponsor" },
      },
    });
    console.log(`Estimate UserOp: ${await printOp(op)}`);

    // sign the UserOp and sending to the bundler...
    const uoHash = await sdk.send(op);
    console.log(`UserOpHash: ${uoHash}`);

    // get transaction hash...
    console.log("Waiting for transaction...");
    let userOpsReceipt = null;
    const timeout = Date.now() + 60000; // 1 minute timeout
    while (userOpsReceipt == null && Date.now() < timeout) {
      await sleep(2);
      userOpsReceipt = await sdk.getUserOpReceipt(uoHash);
    }
    console.log("\x1b[33m%s\x1b[0m", `Transaction Receipt: `, userOpsReceipt);
    return userOpsReceipt;
  } catch (err: any) {
    console.error(`error occured when transferring: ${err}`);
    return null;
  }
};
