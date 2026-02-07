import { Wallets } from 'fabric-network';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    try {
        // Path to wallet
        const walletPath = path.join(__dirname, '..', 'wallet');

        // Remove existing wallet to be clean? No, let's overwrite if needed.
        if (fs.existsSync(walletPath)) {
            // fs.rmSync(walletPath, { recursive: true, force: true });
        }

        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Paths to credentials
        const credPath = path.resolve(__dirname, '..', '..', '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'users', 'Admin@org1.example.com', 'msp');
        const certPath = path.join(credPath, 'signcerts', 'cert.pem');
        const keyPath = path.join(credPath, 'keystore', '22d367b7bcad7f434babfb612ebf806d28aae3c1dd579a8df916c42d9e8b230b_sk');

        if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
            console.error(`Credentials not found at ${credPath}`);
            process.exit(1);
        }

        const cert = fs.readFileSync(certPath).toString();
        const key = fs.readFileSync(keyPath).toString();

        const x509Identity = {
            credentials: {
                certificate: cert,
                privateKey: key,
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put('admin', x509Identity);
        console.log('Successfully imported existing Admin identity into the wallet');

    } catch (error) {
        console.error(`Failed to import admin: ${error}`);
        process.exit(1);
    }
}

main();
