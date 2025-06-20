import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config"; // Import dotenv to use .env file

// Get the environment variables from .env file
const optimismSepoliaUrl = process.env.OPTIMISM_SEPOLIA_RPC_URL || "";
const privateKey = process.env.PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    // Define the Optimism Sepolia testnet configuration
    optimismSepolia: {
      url: optimismSepoliaUrl,
      accounts: [privateKey],
    },
  },
};

export default config;