import {
  createPrimeSDK,
  setUpPaymaster,
  transferERC20WithPaymaster,
} from "./lib/aa.ts";

/**
 * メインスクリプト
 */
const main = async () => {
  createPrimeSDK();
  await setUpPaymaster();
  // ERC20トークンを送金するメソッドを呼び出す。
  await transferERC20WithPaymaster(
    "0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072",
    "50"
  );
};

main()
  .catch(console.error)
  .finally(() => process.exit());
