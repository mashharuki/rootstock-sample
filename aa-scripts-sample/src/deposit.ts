import {
  createPrimeSDK,
  depositToPaymaster,
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
  // ホワイトリストへの登録とdepositを行う。
  await depositToPaymaster(address, "0.000006");
};

main()
  .catch(console.error)
  .finally(() => process.exit());
