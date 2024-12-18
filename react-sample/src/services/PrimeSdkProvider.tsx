import { ArkaPaymaster, EtherspotBundler, PrimeSdk } from "@etherspot/prime-sdk";
import { createContext, ReactNode, useContext, useState } from "react";
import { parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { chain } from "../config/chainConfig";
import { usePlayground } from "./playground";

export interface IPrimeSdkContext {
  sdk: any;
  etherspotWalletAddress: string;
  etherspotWalletBalance: string;
  paymaster: any;
  setEtherspotWalletAddress: (address: string) => void;
  setEtherspotWalletBalance: (balance: string) => void;
  createContractWallet: () => Promise<any>;
  setUpPaymaster: () => Promise<any>;
  depositToPaymaster: (to: string, amount: string) => Promise<any>;
  getBalance: () => Promise<any>;
  estimateAndExecute: (to: `0x${string}`, value: string, data: any) => Promise<any>;
}

/**
 * PrimeSdkContext
 */
export const PrimeSdkContext = createContext<IPrimeSdkContext>({
  sdk: null,
  etherspotWalletAddress: "",
  etherspotWalletBalance: "",
  paymaster: null,
  setEtherspotWalletAddress: () => {},
  setEtherspotWalletBalance: () => {},
  createContractWallet: async () => {},
  setUpPaymaster: async () => {},
  depositToPaymaster: async () => {},
  getBalance: async () => {},
  estimateAndExecute: async () => {},
});

interface IPrimeSdkProps {
  children?: ReactNode;
}

export function usePrimeSdk(): IPrimeSdkContext {
  return useContext(PrimeSdkContext);
}

/**
 * PrimeSdkProvider
 */
export const PrimeSdkProvider = ({ children }: IPrimeSdkProps) => {
  const [sdk, setSdk] = useState<any>();
  const [eoaWalletAddress, setEoaWalletAddress] = useState("");
  const [paymaster, setPaymaster] = useState<any>();
  const [etherspotWalletAddress, setEtherspotWalletAddress] = useState("");
  const [etherspotWalletBalance, setEtherspotWalletBalance] = useState<string>("");

  const { getPrivateKey } = usePlayground();

  /**
   * createContractWallet function
   */
  const createContractWallet = async () => {
    // get privateKey
    const privateKey = await getPrivateKey();

    if (!privateKey) {
      return;
    }

    // signerを取得
    const account = privateKeyToAccount(`0x${privateKey}` as `0x${string}`);
    setEoaWalletAddress(account.address);

    const bundlerApiKey = "eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjMxMDZiOGY2NTRhZTRhZTM4MGVjYjJiN2Q2NDMzMjM4IiwiaCI6Im11cm11cjEyOCJ9";
    const customBundlerUrl = "https://rootstocktestnet-bundler.etherspot.io/";

    // create PrimeSdk instance
    const primeSdk = new PrimeSdk(
      {
        privateKey: `0x${privateKey}` as string,
      },
      {
        chainId: Number(parseInt(chain.rootStockTestnet.chainId, 16)),
        bundlerProvider: new EtherspotBundler(Number(parseInt(chain.rootStockTestnet.chainId, 16)), bundlerApiKey, customBundlerUrl),
      }
    );

    // Contract Accountを取得する。
    const address = await primeSdk.getCounterFactualAddress();
    console.log("Contract Account:", address);
    await getBalance();

    setSdk(primeSdk);
    setEtherspotWalletAddress(address);
  };

  /**
   * 残高を取得するメソッド
   * @returns
   */
  const getBalance = async () => {
    try {
      if (!sdk) {
        console.log("SDK is not initialized");
        // get privateKey
        const privateKey = await getPrivateKey();
        // signerを取得
        const account = privateKeyToAccount(`0x${privateKey}` as `0x${string}`);
        setEoaWalletAddress(account.address);

        const bundlerApiKey =
          "eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjMxMDZiOGY2NTRhZTRhZTM4MGVjYjJiN2Q2NDMzMjM4IiwiaCI6Im11cm11cjEyOCJ9";
        const customBundlerUrl = "https://rootstocktestnet-bundler.etherspot.io/";

        // create PrimeSdk instance
        const primeSdk = new PrimeSdk(
          {
            privateKey: `0x${privateKey}` as string,
          },
          {
            chainId: Number(parseInt(chain.rootStockTestnet.chainId, 16)),
            bundlerProvider: new EtherspotBundler(Number(parseInt(chain.rootStockTestnet.chainId, 16)), bundlerApiKey, customBundlerUrl),
          }
        );
        // 残高を取得する
        const balance = await primeSdk.getNativeBalance();
        console.log("Account balance:", balance);
        setEtherspotWalletBalance(balance.toString());
      } else {
        // 残高を取得する
        const balance = await sdk.getNativeBalance();
        console.log("Account balance:", balance);
        setEtherspotWalletBalance(balance.toString());
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
    }
  };

  /**
   * paymasterを設定するメソッド
   */
  const setUpPaymaster = async () => {
    const arka_api_key = "arka_public_key";
    const arka_url = "https://arka.etherspot.io";
    const arkaPaymaster = new ArkaPaymaster(Number(parseInt(chain.rootStockTestnet.chainId, 16)), arka_api_key, arka_url);
    // get paymaster maetadata
    const maetadata = await arkaPaymaster.metadata();

    console.log(`sponsorAddress: ${maetadata.sponsorAddress}`);
    setPaymaster(arkaPaymaster);
  };

  /**
   * paymasterにdepositするメソッド
   * @returns
   */
  const depositToPaymaster = async (to: string, amount: string) => {
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
   * estimateAndExecute transaction
   */
  const estimateAndExecute = async (to: `0x${string}`, value: string, data: any) => {
    if (!sdk) {
      console.log("SDK is not initialized");
      return;
    }

    try {
      const apiKey = "arka_public_key";
      const chainID = Number(parseInt(chain.rootStockTestnet.chainId, 16));

      await sdk.clearUserOpsFromBatch();

      // ユーザーオペレーションに追加
      await sdk.addUserOpsToBatch({ to: to, value: parseEther(value), data: data });
      console.log("Transaction batch added with recipient:", to, "and value:", value, "and data:", data);

      // userOperationを作成
      const op = await sdk.estimate({
        paymasterDetails: {
          url: `https://arka.etherspot.io?apiKey=${apiKey}&chainId=${chainID}`,
          context: { mode: "sponsor" },
        },
      });

      console.log("Estimated UserOp:", op);
      // ユーザーオペレーションを送信
      const uoHash = await sdk.send(op);

      console.log("UserOpHash:", uoHash);

      // Wait for transaction receipt
      console.log("Waiting for transaction...");

      let userOpsReceipt = null;
      const timeout = Date.now() + 60000;
      const sleep = (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));
      while (userOpsReceipt == null && Date.now() < timeout) {
        await sleep(2000);
        userOpsReceipt = await sdk.getUserOpReceipt(uoHash);
      }
      console.log("Transaction Receipt:", userOpsReceipt);
    } catch (error) {
      console.error("Error sending transaction:", error);
    } finally {
    }
  };

  const primeSdkProvider = {
    sdk,
    etherspotWalletAddress,
    etherspotWalletBalance,
    paymaster,
    setEtherspotWalletAddress,
    setEtherspotWalletBalance,
    createContractWallet,
    setUpPaymaster,
    depositToPaymaster,
    getBalance,
    estimateAndExecute,
  };

  return <PrimeSdkContext.Provider value={primeSdkProvider}>{children}</PrimeSdkContext.Provider>;
};
