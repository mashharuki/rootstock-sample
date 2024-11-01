import {
  createPrimeSDK,
  depositToPaymaster,
  getAddress,
  getBalance,
  setUpPaymaster,
  transferERC20,
  transferNFT,
} from "./lib/aa.ts";

/**
 * メインスクリプト
 */
const main = async () => {
  createPrimeSDK();
  await setUpPaymaster();
  // addressを取得する
  const address = await getAddress();
  // ERC721トークンを送金するメソッドを呼び出す。
  await transferNFT(address, "0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072", 1);
};

main()
  .catch(console.error)
  .finally(() => process.exit());
