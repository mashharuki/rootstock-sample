import { createPrimeSDK, getAddress, setUpPaymaster } from "./lib/aa.ts";

/**
 * メインスクリプト
 */
const main = async () => {
  createPrimeSDK();
  await setUpPaymaster();
  // addressを取得する
  await getAddress();
};

main();
