import { Wallets, X509Identity } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    try {
        const walletPath = path.resolve(__dirname, '..', 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const org1AdminDir = path.resolve(__dirname, '..', '..', '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'users', 'Admin@org1.example.com', 'msp');

        const certPath = path.join(org1AdminDir, 'signcerts', 'cert.pem');
        const cert = fs.readFileSync(certPath).toString();

        const keystoreDir = path.join(org1AdminDir, 'keystore');
        const keyFiles = fs.readdirSync(keystoreDir);
        const keyPath = path.join(keystoreDir, keyFiles[0]); // Usually only one file
        const key = fs.readFileSync(keyPath).toString();

        const identity: X509Identity = {
            credentials: {
                certificate: cert,
                privateKey: key,
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put('admin', identity);
        console.log('✅ Successfully imported identity "admin" (Org1 MSP Admin) into the wallet');

    } catch (error) {
        console.error(`❌ Failed to import admin identity: ${error}`);
        process.exit(1);
    }
}

main();
