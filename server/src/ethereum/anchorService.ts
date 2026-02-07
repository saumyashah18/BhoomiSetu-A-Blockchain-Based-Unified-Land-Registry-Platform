import { getAnchorContract, getWeb3Client } from './web3Client';
import { getFabricContract } from '../fabric/gateway';

export class AnchorService {
    public async anchorFabricEvent(assetId: string, eventType: string, eventHash: string) {
        const contract = getAnchorContract();
        if (!contract) {
            console.log(`[MOCK] Anchoring hash for ${assetId}: ${eventHash}`);
            return;
        }

        const web3 = getWeb3Client();
        const accounts = await web3.eth.getAccounts();
        const from = accounts[0];

        // Anchor hash on Ethereum
        // Note: eventHash should be converted to bytes32 if it's a hex string
        const tx = await (contract.methods as any).anchorHash(assetId, eventType, eventHash).send({ from });
        console.log(`Anchored hash on Ethereum: ${tx.transactionHash}`);
    }
}
