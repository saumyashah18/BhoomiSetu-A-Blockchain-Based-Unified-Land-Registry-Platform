"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const web3Client_1 = require("../ethereum/web3Client");
const ipfsService_1 = require("../ipfs/ipfsService");
const gateway_1 = require("../fabric/gateway");
const router = (0, express_1.Router)();
const ipfsService = new ipfsService_1.IpfsService();
// 1. Web3 Connection Test
router.get('/test-web3', async (req, res) => {
    try {
        const web3 = (0, web3Client_1.getWeb3Client)();
        const isListening = await web3.eth.net.isListening();
        const accounts = await web3.eth.getAccounts();
        const walletAccounts = Array.from({ length: web3.eth.accounts.wallet.length }, (_, i) => web3.eth.accounts.wallet[i]?.address);
        console.log('🔍 Debug: Testing Web3 connectivity...');
        if (isListening) {
            const allAccounts = [...accounts, ...walletAccounts.filter(a => !accounts.includes(a))];
            let balances = {};
            for (const acc of allAccounts) {
                if (acc) {
                    const bal = await web3.eth.getBalance(acc);
                    balances[acc] = web3.utils.fromWei(bal, 'ether') + ' MATIC';
                }
            }
            console.log('✅ Web3 connection verified. Accounts found: ' + allAccounts.length);
            res.json({ status: 'connected', accounts: allAccounts, balances });
        }
        else {
            throw new Error('Web3 provider not listening');
        }
    }
    catch (error) {
        console.error('❌ Web3 Debug Error: ' + error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// 2. IPFS Connection Test
router.get('/test-ipfs', async (req, res) => {
    try {
        console.log('🔍 Debug: Testing IPFS connectivity...');
        const testData = Buffer.from('BhoomiSetu Test ' + Date.now());
        const cid = await ipfsService.uploadDocument(testData);
        console.log('✅ IPFS connection verified. Sample CID created: ' + cid);
        res.json({ status: 'connected', sampleCid: cid });
    }
    catch (error) {
        console.error('❌ IPFS Debug Error: ' + error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});
// 3. Fabric Connection Test
router.get('/test-fabric', async (req, res) => {
    const user = req.query.user || 'admin';
    try {
        console.log('🔍 Debug: Testing Fabric Gateway connectivity for user: ' + user);
        const { gateway, contract } = await (0, gateway_1.getFabricContract)('mychannel', 'landregistry', 'ParcelContract', user);
        // We'll just try to evaluate a non-existent parcel to check connectivity
        try {
            await contract.evaluateTransaction('ParcelExists', 'TEST_ULPIN');
            console.log('✅ Fabric connection verified.');
            res.json({ status: 'connected' });
        }
        finally {
            await gateway.disconnect();
        }
    }
    catch (error) {
        console.error('❌ Fabric Debug Error: ' + error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});
exports.default = router;
