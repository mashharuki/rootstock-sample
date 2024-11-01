import {
  createPrimeSDK,
  depositToPaymaster,
  getAddress,
  getBalance,
  setUpPaymaster,
  transferWithPaymaster,
} from "./lib/aa.ts";

/**
 * メインスクリプト
 */
const main = async () => {
  createPrimeSDK();
  await setUpPaymaster();
  // addressを取得する
  await getAddress();
  // 残高を取得する。
  await getBalance();
  // 単純な送金処理を試す。
  await transferWithPaymaster(
    "0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072",
    "0.000001"
  );
};

main()
  .catch(console.error)
  .finally(() => process.exit());
