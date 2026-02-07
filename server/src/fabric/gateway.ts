import { Gateway, Wallets, Network, Contract } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';

export async function getFabricContract(
    channelName: string,
    contractName: string,
    userName: string
): Promise<{ gateway: Gateway; contract: Contract }> {
    // Load connection profile
    const ccpPath = process.env.FABRIC_CCP_PATH || path.resolve(__dirname, '..', '..', '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Load wallet
    const walletPath = path.resolve(__dirname, '..', 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if user exists in wallet
    const identity = await wallet.get(userName);
    if (!identity) {
        throw new Error(`An identity for the user ${userName} does not exist in the wallet`);
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: userName,
        discovery: { enabled: true, asLocalhost: true }
    });

    console.log('✅ Fabric Gateway is working (Identity: ' + userName + ')');

    // Get the network (channel) our contract is deployed to.
    const network: Network = await gateway.getNetwork(channelName);

    // Get the contract from the network.
    const contract: Contract = network.getContract(contractName);

    return { gateway, contract };
}
