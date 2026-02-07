"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferService = void 0;
const gateway_1 = require("../fabric/gateway");
const anchorService_1 = require("../ethereum/anchorService");
class TransferService {
    constructor() {
        this.anchorService = new anchorService_1.AnchorService();
    }
    async transferAsset(assetId, newOwnerId, user) {
        // Generate a random Request ID
        const requestId = 'REQ_' + Date.now();
        const { gateway, contract } = await (0, gateway_1.getFabricContract)('mychannel', 'landregistry', 'ParcelContract', user);
        try {
            const newOwners = [{ ownerId: newOwnerId, ownershipType: 'FULL', sharePercentage: 100 }];
            await contract.submitTransaction('InitiateTransfer', requestId, assetId, JSON.stringify(newOwners), JSON.stringify([]));
            return { success: true, requestId, status: 'PENDING_APPROVAL', message: 'Transfer initiated. Waiting for Registrar approval.' };
        }
        finally {
            gateway.disconnect();
        }
    }
}
exports.TransferService = TransferService;
