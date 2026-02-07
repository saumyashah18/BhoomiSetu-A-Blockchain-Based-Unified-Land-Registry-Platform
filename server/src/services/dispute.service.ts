import { getFabricContract } from '../fabric/gateway';
import { AnchorService } from '../ethereum/anchorService';
import * as crypto from 'crypto';

export class DisputeService {
    private anchorService: AnchorService;

    constructor() {
        this.anchorService = new AnchorService();
    }

    public async raiseDispute(assetId: string, reason: string, user: string) {
        const disputeId = crypto.createHash('sha256').update(`DISPUTE-${assetId}-${Date.now()}`).digest('hex');

        const { gateway, contract } = await getFabricContract('mychannel', 'landregistry', 'DisputeContract', user);
        try {
            await contract.submitTransaction(
                'RaiseDispute',
                disputeId,
                assetId,
                reason
            );

            await this.anchorService.anchorFabricEvent(assetId, 'DISPUTE_RAISED', '0x' + disputeId);

            return { success: true, disputeId, assetId };
        } finally {
            gateway.disconnect();
        }
    }

    public async resolveDispute(disputeId: string, user: string) {
        const { gateway, contract } = await getFabricContract('mychannel', 'landregistry', 'DisputeContract', user);
        try {
            await contract.submitTransaction('ResolveDispute', disputeId);
            return { success: true, disputeId };
        } finally {
            gateway.disconnect();
        }
    }
}
