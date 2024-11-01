import { ethers } from "ethers";

/**
 * NFTを移転する関数のエンコードデータを生成するメソッド
 */
export const createTransferNFTFunctionData = (
  from: string,
  to: string,
  tokenId: number
) => {
  const erc721Interface = new ethers.Interface([
    "function safeTransferFrom(address _from, address _to, uint256 _tokenId)",
  ]);

  const transactionData = erc721Interface.encodeFunctionData(
    "safeTransferFrom",
    [from, to, tokenId]
  );
  return transactionData;
};
