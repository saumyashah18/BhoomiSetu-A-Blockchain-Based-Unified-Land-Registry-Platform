import { getFabricContract } from '../fabric/gateway';
import { AnchorService } from '../ethereum/anchorService';
import * as crypto from 'crypto';

export class TransferService {
    private anchorService: AnchorService;

    constructor() {
        this.anchorService = new AnchorService();
    }

    public async transferAsset(assetId: string, newOwnerId: string, user: string) {
        // Generate a random Request ID
        const requestId = 'REQ_' + Date.now();

        const { gateway, contract } = await getFabricContract('mychannel', 'landregistry', 'ParcelContract', user);
        try {
            const newOwners = [{ ownerId: newOwnerId, ownershipType: 'FULL', sharePercentage: 100 }];

            await contract.submitTransaction(
                'InitiateTransfer',
                requestId,
                assetId,
                JSON.stringify(newOwners),
                JSON.stringify([])
            );

            return { success: true, requestId, status: 'PENDING_APPROVAL', message: 'Transfer initiated. Waiting for Registrar approval.' };
        } finally {
            gateway.disconnect();
        }
    }
}
