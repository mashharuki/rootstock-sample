import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import {writeContractAddress} from "../helper/contractsJsonHelper";
import { network } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployer, owner } = await hre.getNamedAccounts()

	const erc20 = await hre.deployments.deploy("MockERC20", {
		from: deployer,
		args: [1000000,"MockERC20", "tRSK", owner],
		log: true,
	})

	// write Contract Address
	writeContractAddress({
		group: "contracts",
		name: "MockERC20",
		value: erc20.address,
		network: network.name,
	});
}
export default func
func.tags = ["20"]
