import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts...\n");

  const TrustScore = await ethers.getContractFactory("TrustScore");
  const trustScore = await TrustScore.deploy();
  await trustScore.waitForDeployment();
  const trustScoreAddress = await trustScore.getAddress();
  console.log(`✅ TrustScore contract deployed to: ${trustScoreAddress}`);

  const EndorsementVerifier = await ethers.getContractFactory("EndorsementVerifier");
  const endorsementVerifier = await EndorsementVerifier.deploy();
  await endorsementVerifier.waitForDeployment();
  const verifierAddress = await endorsementVerifier.getAddress();
  console.log(`✅ EndorsementVerifier contract deployed to: ${verifierAddress}`);

  console.log("\nDeployment complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
