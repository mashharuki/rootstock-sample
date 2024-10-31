import { task } from "hardhat/config"
import { loadDeployedContractAddresses } from "../../helper/contractsJsonHelper";
import { HardhatRuntimeEnvironment } from "hardhat/types";

/**
 Example:
 hardhat erc1155-contract-uri \
 --uri https://ipfs.io/ipfs/new-contract-uri-ipfs-hash \
 --network rskTestnet
 */
task("erc1155-contract-uri", "Set new Contract URI for BasicERC1155 Smart Contract")
	.addParam<string>("uri", "New Contract URI")
	.setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
		// get Contract Address
		const {
			contracts: {MockERC1155},
		} = loadDeployedContractAddresses(hre.network.name);

		const contract = await hre.ethers.getContractAt("MockERC1155", MockERC1155)

		console.log(`Current Contract URI: ${await contract.contractURI()}`)

		const trx = await contract.setContractURI(taskArgs.uri)

		console.log(`Transaction Hash: ${trx.hash}`)
		await trx.wait(2)
		console.log("Transaction confirmed")

		console.log(`New Contract URI: ${await contract.contractURI()}`)
	})
