import * as fs from 'fs';
import * as path from 'path';
import { Gateway, Wallets } from 'fabric-network';
import * as crypto from 'crypto';

// Path to GeoJSON file
// Relative from server/src/scripts to root: ../../../farmland.geojson
const GEOJSON_PATH = path.resolve(__dirname, '..', '..', '..', 'farmland.geojson');

async function main() {
    try {
        console.log(`Reading GeoJSON from: ${GEOJSON_PATH}`);
        if (!fs.existsSync(GEOJSON_PATH)) {
            throw new Error('farmland.geojson not found!');
        }

        const geojsonData = JSON.parse(fs.readFileSync(GEOJSON_PATH, 'utf8'));
        const features = geojsonData.features;

        console.log(`Found ${features.length} features to process.`);

        // Setup Fabric Gateway
        // server/src/scripts -> ../../../
        const ccpPath = path.resolve(__dirname, '..', '..', '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');

        // server/src/scripts -> ../wallet = server/src/wallet
        const walletPath = path.resolve(__dirname, '..', 'wallet');

        if (!fs.existsSync(ccpPath)) {
            // Fallback for different path structure if needed
            throw new Error(`CCP not found at ${ccpPath}`);
        }

        if (!fs.existsSync(walletPath)) {
            throw new Error(`Wallet not found at ${walletPath}`);
        }

        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const identity = await wallet.get('admin');
        if (!identity) {
            console.log('Admin identity not found in wallet.');
            throw new Error('Identity "admin" not found in wallet');
        }

        const gateway = new Gateway();
        await gateway.connect(JSON.parse(fs.readFileSync(ccpPath, 'utf8')), {
            wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true }
        });

        const network = await gateway.getNetwork('mychannel');
        const contract = network.getContract('land-registry');

        console.log('Connected to Fabric Network. Starting transactions...');

        for (const feature of features) {
            const props = feature.properties;
            const geometry = feature.geometry;

            const ulpin = props.ULPIN;
            // Use provided area or default
            const area = 2000;
            const location = JSON.stringify(geometry);
            const ownerId = 'admin';

            const hash = crypto.createHash('sha256').update(JSON.stringify(feature)).digest('hex');

            console.log(`Creating Parcel: ${ulpin}...`);

            try {
                await contract.submitTransaction(
                    'CreateParcel',
                    ulpin,
                    area.toString(),
                    location,
                    ownerId,
                    hash
                );
                console.log(`✅ Successfully created parcel ${ulpin}`);
            } catch (error: any) {
                console.error(`❌ Failed to create parcel ${ulpin}: ${error.message}`);
            }
        }

        gateway.disconnect();
        console.log('Seeding complete.');

    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

main();
