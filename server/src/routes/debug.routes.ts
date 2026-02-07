import { Router } from 'express';
import { getWeb3Client } from '../ethereum/web3Client';
import { IpfsService } from '../ipfs/ipfsService';
import { getFabricContract } from '../fabric/gateway';

const router = Router();
const ipfsService = new IpfsService();

// 1. Web3 Connection Test
router.get('/test-web3', async (req, res) => {
    try {
        const web3 = getWeb3Client();
        const isListening = await web3.eth.net.isListening();
        const accounts = await web3.eth.getAccounts();
        console.log('🔍 Debug: Testing Web3 connectivity...');
        if (isListening) {
            console.log('✅ Web3 connection verified. Accounts found: ' + accounts.length);
            res.json({ status: 'connected', accounts });
        } else {
            throw new Error('Web3 provider not listening');
        }
    } catch (error: any) {
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
    } catch (error: any) {
        console.error('❌ IPFS Debug Error: ' + error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// 3. Fabric Connection Test
router.get('/test-fabric', async (req, res) => {
    const user = (req.query.user as string) || 'admin';
    try {
        console.log('🔍 Debug: Testing Fabric Gateway connectivity for user: ' + user);
        const { gateway, contract } = await getFabricContract('mychannel', 'ParcelContract', user);
        // We'll just try to evaluate a non-existent parcel to check connectivity
        try {
            await contract.evaluateTransaction('ParcelExists', 'TEST_ULPIN');
            console.log('✅ Fabric connection verified.');
            res.json({ status: 'connected' });
        } finally {
            await gateway.disconnect();
        }
    } catch (error: any) {
        console.error('❌ Fabric Debug Error: ' + error.message);
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router;
