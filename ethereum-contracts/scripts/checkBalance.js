const hre = require("hardhat");

async function main() {
    const address = "0x0ac9ECd7A3e623E82D20Ef61bEc2eE0ee460654d";
    const balance = await hre.ethers.provider.getBalance(address);
    console.log("💰 Balance:", hre.ethers.formatEther(balance), "MATIC");

    if (balance > 0) {
        console.log("✅ You have MATIC! Ready to deploy.");
    } else {
        console.log("⏳ Waiting for MATIC from faucet...");
    }
}

main().catch(console.error);
