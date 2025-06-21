import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts to Optimism Sepolia...\n");

  // Deploy TrustScore Contract
  const TrustScore = await ethers.getContractFactory("TrustScore");
  const trustScore = await TrustScore.deploy();
  await trustScore.waitForDeployment();
  const trustScoreAddress = await trustScore.getAddress();
  console.log(`✅ TrustScore contract deployed to: ${trustScoreAddress}`);

  // Deploy the REAL Groth16 Verifier Contract
  const Groth16Verifier = await ethers.getContractFactory("Groth16Verifier");
  const groth16Verifier = await Groth16Verifier.deploy();
  await groth16Verifier.waitForDeployment();
  const verifierAddress = await groth16Verifier.getAddress();
  console.log(`✅ Groth16Verifier contract successfully deployed to: ${verifierAddress}`);

  console.log("\nDeployment complete! Please update your backend with the new Groth16Verifier address.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});