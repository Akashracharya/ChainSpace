const hre = require("hardhat");

async function main() {
  const RoomFactory = await hre.ethers.getContractFactory("RoomFactory");
  const contract = await RoomFactory.deploy();

  await contract.waitForDeployment(); // ✅ ethers v6 style

  console.log("✅ Smart Contract deployed at:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
