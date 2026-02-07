import { getFabricContract } from '../fabric/gateway';
import { AnchorService } from '../ethereum/anchorService';
import * as crypto from 'crypto';

export class TransferService {
    private anchorService: AnchorService;

    constructor() {
        this.anchorService = new AnchorService();
    }

    public async transferAsset(assetId: string, newOwnerId: string, user: string) {
        const hash = crypto.createHash('sha256').update(`${assetId}-${newOwnerId}-${Date.now()}`).digest('hex');

        const { gateway, contract } = await getFabricContract('mychannel', 'TransferContract', user);
        try {
            await contract.submitTransaction(
                'TransferAsset',
                assetId,
                newOwnerId,
                hash
            );

            await this.anchorService.anchorFabricEvent(assetId, 'TRANSFER', '0x' + hash);

            return { success: true, assetId, hash };
        } finally {
            gateway.disconnect();
        }
    }
}
