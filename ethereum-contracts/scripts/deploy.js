const hre = require("hardhat");

async function main() {
    console.log("🚀 Deploying AnchorRegistry to", hre.network.name, "network...\n");

    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);

    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "MATIC\n");

    const AnchorRegistry = await hre.ethers.getContractFactory("AnchorRegistry");
    console.log("⏳ Deploying contract...");

    const anchorRegistry = await AnchorRegistry.deploy();
    await anchorRegistry.waitForDeployment();

    const contractAddress = await anchorRegistry.getAddress();
    const deploymentTx = anchorRegistry.deploymentTransaction();

    console.log("\n✅ AnchorRegistry deployed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📍 Contract Address:", contractAddress);
    console.log("🔗 Transaction Hash:", deploymentTx.hash);
    console.log("📦 Block Number:", deploymentTx.blockNumber);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    if (hre.network.name === "mumbai") {
        console.log("🔍 View on PolygonScan:");
        console.log(`   https://mumbai.polygonscan.com/address/${contractAddress}`);
        console.log(`   https://mumbai.polygonscan.com/tx/${deploymentTx.hash}\n`);
    }

    console.log("📋 Next Steps:");
    console.log("1. Update server/.env with:");
    console.log(`   ETH_PROVIDER_URL=https://rpc-mumbai.maticvigil.com`);
    console.log(`   ANCHOR_CONTRACT_ADDRESS=${contractAddress}`);
    console.log("2. Copy ABI to server:");
    console.log(`   cp artifacts/contracts/AnchorRegistry.sol/AnchorRegistry.json ../server/`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
