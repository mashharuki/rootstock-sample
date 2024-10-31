import { task } from "hardhat/config"
import { loadDeployedContractAddresses } from "../../helper/contractsJsonHelper";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 Example:
 hardhat erc1155-mint \
 --recipient 0x73faDd7E476a9Bc2dA6D1512A528366A3E50c3cF \
 --id 1 \
 --amount 10 \
 --network rskTestnet
 */
task("erc1155-mint", "Mint tokens for BasicERC1155 Smart Contract")
	.addParam<string>("recipient", "Token Recipient")
	.addParam<string>("id", "Token ID")
	.addParam<string>("amount", "Token Amount")
	.setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
		// get Contract Address
		const {
			contracts: {MockERC1155},
		} = loadDeployedContractAddresses(hre.network.name);

		const contract = await hre.ethers.getContractAt("MockERC1155", MockERC1155)

		const mintTrx = await contract.mint(taskArgs.recipient, taskArgs.id, taskArgs.amount)

		console.log(`Transaction Hash: ${mintTrx.hash}`)
		await mintTrx.wait(2)
		console.log("Transaction confirmed")
	})
