import { task } from "hardhat/config"
import { loadDeployedContractAddresses } from "../../helper/contractsJsonHelper";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 Example:
 hardhat erc721-mint \
 --recipient 0x73faDd7E476a9Bc2dA6D1512A528366A3E50c3cF \
 --network rskTestnet
 */
task("erc721-mint", "Mint token for BasicERC721 Smart Contract")
	.addParam<string>("recipient", "NFT Token Recipient")
	.setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
		// get Contract Address
		const {
			contracts: {MockERC721},
		} = loadDeployedContractAddresses(hre.network.name);

		const contract = await hre.ethers.getContractAt("MockERC721", MockERC721)

		const mintTrx = await contract.safeMint(taskArgs.recipient)

		console.log(`Transaction Hash: ${mintTrx.hash}`)
		await mintTrx.wait(2)
		console.log("Transaction confirmed")
	})
