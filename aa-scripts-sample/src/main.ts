import {
  createPrimeSDK,
  getAddress,
  getBalance,
  setUpPaymaster,
} from "./lib/aa.ts";

/**
 * メインスクリプト
 */
const main = async () => {
  createPrimeSDK();
  await setUpPaymaster();
  // addressを取得する
  const address = await getAddress();
  // 残高を取得する。
  await getBalance();
};

main()
  .catch(console.error)
  .finally(() => process.exit());
