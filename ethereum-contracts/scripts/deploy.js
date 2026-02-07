const hre = require("hardhat");

async function main() {
    const AnchorRegistry = await hre.ethers.getContractFactory("AnchorRegistry");
    const anchorRegistry = await AnchorRegistry.deploy();

    await anchorRegistry.waitForDeployment();

    console.log(
        `AnchorRegistry deployed to: ${await anchorRegistry.getAddress()}`
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
