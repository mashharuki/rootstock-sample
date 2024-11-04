import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-solhint";
import * as dotenv from "dotenv";
import "dotenv/config";
import fs from "fs";
import "hardhat-deploy";
import { HardhatUserConfig } from "hardhat/config";
import path from "path";
import "solidity-coverage";

dotenv.config();

// Environment variable setup
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// タスクファイルを読み込むための設定
const SKIP_LOAD = process.env.SKIP_LOAD === "true";
if (!SKIP_LOAD) {
	const taskPaths = ["", "utils", "erc20", "erc721", "erc1155"];
	taskPaths.forEach((folder) => {
		const tasksPath = path.join(__dirname, "tasks", folder);
		fs.readdirSync(tasksPath)
			.filter((_path) => _path.includes(".ts"))
			.forEach((task) => {
				require(`${tasksPath}/${task}`);
			});
	});
}

// Ensure environment variables are configured
if (!ALCHEMY_API_KEY) {
    throw new Error("The ALCHEMY_API_KEY is not configured.");
}

// Hardhat configuration
const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
        },
        localhost: {
            url: "http://127.0.0.1:8545",
        },
        rskMainnet: {
            url: `https://rootstock-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            chainId: 30,
            gasPrice: 60000000,
            accounts: [PRIVATE_KEY]
        },
        rskTestnet: {
            url: `https://rootstock-testnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
            chainId: 31,
            gasPrice: 60000000,
            accounts: [PRIVATE_KEY]
        },
    },
    etherscan: {
        apiKey: {
            // Is not required by blockscout. Can be any non-empty string
            rsktestnet: 'your API key',
            rskmainnet: 'your API key'
        },
        customChains: [
            {
                network: "rsktestnet",
                chainId: 31,
                urls: {
                    apiURL: "https://rootstock-testnet.blockscout.com/api/",
                    browserURL: "https://rootstock-testnet.blockscout.com/",
                }
            },
            {
                network: "rskmainnet",
                chainId: 30,
                urls: {
                    apiURL: "https://rootstock.blockscout.com/api/",
                    browserURL: "https://rootstock.blockscout.com/",
                }
            },
        ]
    },
    namedAccounts: {
        deployer: {
            default: 0, // Default is the first account
            mainnet: 0,
        },
        owner: {
            default: 0,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.24",
            },
        ],
    },
};

export default config;
