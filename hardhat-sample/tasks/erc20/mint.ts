import {task} from "hardhat/config";
import { loadDeployedContractAddresses } from "../../helper/contractsJsonHelper";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 Example:
 yarn erc20-mint \
 --recipient 0x73faDd7E476a9Bc2dA6D1512A528366A3E50c3cF \
 --amount 10000 \
 --network rskTestnet
 */
task("erc20-mint", "Mint tokens for BasicERC20 Smart Contract")
	.addParam<string>("recipient", "ERC20 Tokens Recipient")
	.addParam<string>("amount", "ERC20 Tokens Amount")
	.setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {

		// get Contract Address
		const {
			contracts: {MockERC20},
		} = loadDeployedContractAddresses(hre.network.name);

		const contract = await hre.ethers.getContractAt("MockERC20", MockERC20)

		const mintTrx = await contract.mint(taskArgs.recipient, taskArgs.amount)

		console.log(`Transaction Hash: ${mintTrx.hash}`)
		await mintTrx.wait(2)
		console.log("Transaction confirmed")
	})
