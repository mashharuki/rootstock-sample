import { EtherspotBundler, PrimeSdk } from "@etherspot/prime-sdk";
import { createContext, ReactNode, useContext, useState } from "react";
import { parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { chain } from "../config/chainConfig";
import { usePlayground } from "./playground";

export interface IPrimeSdkContext {
  sdk: any;
  createContractWallet: () => Promise<any>;
  getBalance: () => Promise<any>;
  estimateAndExecute: (to: `0x${string}`, value: string, data: any) => Promise<any>;
}

export const PrimeSdkContext = createContext<IPrimeSdkContext>({
  sdk: null,
  createContractWallet: async () => {},
  getBalance: async () => {},
  estimateAndExecute: async () => {},
});

interface IPrimeSdkProps {
  children?: ReactNode;
}

export function usePrimeSdk(): any {
  return useContext(PrimeSdkContext);
}

/**
 * PrimeSdkProvider
 */
export const PrimeSdkProvider = ({ children }: IPrimeSdkProps) => {
  const [sdk, setSdk] = useState<any>();
  const [eoaWalletAddress, setEoaWalletAddress] = useState("");
  const [etherspotWalletAddress, setEtherspotWalletAddress] = useState("");
  const [balance, setBalance] = useState<string>("");

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
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    setEoaWalletAddress(account.address);

    const bundlerApiKey = "eyJvcmciOiI2NTIzZjY5MzUwOTBmNzAwMDFiYjJkZWIiLCJpZCI6IjMxMDZiOGY2NTRhZTRhZTM4MGVjYjJiN2Q2NDMzMjM4IiwiaCI6Im11cm11cjEyOCJ9";
    const customBundlerUrl = "https://rootstocktestnet-bundler.etherspot.io/";

    // create PrimeSdk instance
    const primeSdk = new PrimeSdk(
      {
        privateKey: privateKey as string,
      },
      {
        chainId: Number(parseInt(chain.rootStockTestnet.chainId, 16)),
        bundlerProvider: new EtherspotBundler(Number(parseInt(chain.rootStockTestnet.chainId, 16)), bundlerApiKey, customBundlerUrl),
      }
    );

    // Contract Accountを取得する。
    const address = await sdk.getCounterFactualAddress();
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
    if (!sdk) {
      console.log("SDK is not initialized");
      return;
    }

    try {
      // 残高を取得する
      const balance = await sdk.getNativeBalance();
      console.log("Account balance:", balance);
      setBalance(balance.toString());
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
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
    createContractWallet,
    getBalance,
    estimateAndExecute,
  };

  return <PrimeSdkContext.Provider value={primeSdkProvider}>{children}</PrimeSdkContext.Provider>;
};
