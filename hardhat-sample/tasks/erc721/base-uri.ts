import { task } from "hardhat/config"
import { loadDeployedContractAddresses } from "../../helper/contractsJsonHelper";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 Example:
 yarn erc721-base-uri \
 --uri https://ipfs.io/ipfs/new-base-uri-ipfs-hash/ \
 --network rskTestnet
 */
task("erc721-base-uri", "Set new base URI for BasicERC721 Smart Contract")
	.addParam<string>("uri", "New Base URI")
	.setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
		// get Contract Address
		const {
			contracts: {MockERC721},
		} = loadDeployedContractAddresses(hre.network.name);

		const contract = await hre.ethers.getContractAt("MockERC721", MockERC721)

		const trx = await contract.setBaseURI(taskArgs.uri)

		console.log(`Transaction Hash: ${trx.hash}`)
		await trx.wait(2)
		console.log("Transaction confirmed")
	})
