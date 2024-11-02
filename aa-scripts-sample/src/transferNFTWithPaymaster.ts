import {
  createPrimeSDK,
  getAddress,
  getBalance,
  setUpPaymaster,
  transferNFTWithPaymaster,
} from "./lib/aa.ts";

/**
 * メインスクリプト
 */
const main = async () => {
  createPrimeSDK();
  await setUpPaymaster();
  // addressを取得する
  const address = await getAddress();
  // 単純な送金処理を試す。
  await transferNFTWithPaymaster(
    address,
    "0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072",
    4
  );
};

main()
  .catch(console.error)
  .finally(() => process.exit());
