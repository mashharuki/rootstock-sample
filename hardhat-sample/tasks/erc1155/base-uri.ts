import { task } from "hardhat/config"
import { loadDeployedContractAddresses } from "../../helper/contractsJsonHelper";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 Example:
 hardhat erc1155-base-uri \
 --uri https://ipfs.io/ipfs/new-base-uri-ipfs-hash/ \
 --network rskTestnet
 */
task("erc1155-base-uri", "Set new base URI for BasicERC1155 Smart Contract")
	.addParam<string>("uri", "New Base URI")
	.setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
		// get Contract Address
		const {
			contracts: {MockERC1155},
		} = loadDeployedContractAddresses(hre.network.name);

		const contract = await hre.ethers.getContractAt("MockERC1155", MockERC1155)

		const trx = await contract.setURI(taskArgs.uri)

		console.log(`Transaction Hash: ${trx.hash}`)
		await trx.wait(2)
		console.log("Transaction confirmed")
	})
