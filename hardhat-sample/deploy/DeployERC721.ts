import { network } from "hardhat"
import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { writeContractAddress } from "../helper/contractsJsonHelper"

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployer, owner } = await hre.getNamedAccounts()

	const nft = await hre.deployments.deploy("MockERC721", {
		from: deployer,
		args: ["RSKNFTToken", "NRSK", "ipfs://base-uri/", "ipfs://contract-uri", owner],
		log: true,
	})

	// write Contract Address
	writeContractAddress({
		group: "contracts",
		name: "MockERC721",
		value: nft.address,
		network: network.name,
	});
}
export default func
func.tags = ["721"]
