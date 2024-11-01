import { ethers } from "ethers";
import { ERC20TokenAddress } from "./contstants.ts";
import * as dotenv from "dotenv";
import { ERC20_ABI } from "../helper/abi.ts";

dotenv.config();

const { CUSTOM_BUNDLER_URL } = process.env;

/**
 * コントラクトインスタンスを作成するメソッド
 */
export const createErc20Contract = () => {
  const provider = new ethers.JsonRpcProvider(CUSTOM_BUNDLER_URL);
  // get erc20 Contract Interface
  const erc20Instance = new ethers.Contract(
    ERC20TokenAddress,
    ERC20_ABI,
    provider
  );
  return erc20Instance;
};

/**
 * ERC20の送金メソッドのエンコードデータを作成する。
 */
export const createTransferFuntionData = async (to: string, amount: string) => {
  const erc20Instance = createErc20Contract();
  // get decimals from erc20 contract
  const decimals = await erc20Instance.decimals();
  console.log("decimals:", decimals);

  // value
  const value = ethers.parseUnits(amount, decimals);
  console.log("value:", value);

  // get transferFrom encoded data
  const transactionData = erc20Instance.interface.encodeFunctionData(
    "transfer",
    [to, amount]
  );
  return transactionData;
};
