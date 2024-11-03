import { DeployFunction } from "hardhat-deploy/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { writeContractAddress } from "../helper/contractsJsonHelper"
import { network } from "hardhat"

/**
 * CrossChain Contract
 * @param hre
 */
const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const { deployer, owner } = await hre.getNamedAccounts()

	// sender側のコントラクトデプロイする。
	const sender = await hre.deployments.deploy("MessageSender", {
		from: deployer,
		args: [1000000, "MockERC20", "tRSK", owner],
		log: true,
	})

	// receiver側のコントラクトデプロイする。
	const receiver = await hre.deployments.deploy("MessageReceiver", {
		from: deployer,
		args: [1000000, "MockERC20", "tRSK", owner],
		log: true,
	})

	// write Contract Address
	writeContractAddress({
		group: "contracts",
		name: "MessageSender",
		value: sender.address,
		network: network.name,
	})

	writeContractAddress({
		group: "contracts",
		name: "MessageReceiver",
		value: receiver.address,
		network: network.name,
	})
}
export default func
func.tags = ["20"]
