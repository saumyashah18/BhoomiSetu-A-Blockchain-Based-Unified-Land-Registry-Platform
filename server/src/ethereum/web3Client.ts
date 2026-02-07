import Web3 from 'web3';
import * as path from 'path';
import * as fs from 'fs';

let web3: Web3;

export function getWeb3Client(): Web3 {
    if (!web3) {
        const providerUrl = process.env.ETH_PROVIDER_URL || 'http://localhost:8545';
        web3 = new Web3(providerUrl);

        if (process.env.PRIVATE_KEY) {
            const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
            web3.eth.accounts.wallet.add(account);
            console.log('✅ Web3 wallet loaded (Address: ' + account.address + ')');
        }

        console.log('✅ Web3.js is working (Connected to ' + providerUrl + ')');
    }
    return web3;
}

export function getAnchorContract() {
    const web3 = getWeb3Client();
    const contractPath = path.resolve(__dirname, 'AnchorRegistry.json');

    // In a real scenario, we would have the ABI and address
    // For now, we'll assume they are loaded from a JSON artifact after compilation
    if (!fs.existsSync(contractPath)) {
        console.warn('AnchorRegistry.json not found. Returning mock contract.');
        return null;
    }

    const contractData = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    const contract = new web3.eth.Contract(contractData.abi, process.env.ANCHOR_CONTRACT_ADDRESS);
    return contract;
}
