import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      forking: {
        url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_TOKEN}`,
      }
    }
  }
};


export default config;
