import { getFabricContract } from '../fabric/gateway';
import { AnchorService } from '../ethereum/anchorService';
import * as crypto from 'crypto';

export class UnitService {
    private anchorService: AnchorService;

    constructor() {
        this.anchorService = new AnchorService();
    }

    public async createUnit(data: any, user: string) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(data) + Date.now()).digest('hex');

        const { gateway, contract } = await getFabricContract('mychannel', 'landregistry', 'UnitContract', user);
        try {
            await contract.submitTransaction(
                'CreateUnit',
                data.unitId,
                data.parentUlpin,
                data.uds.toString(),
                user,
                hash
            );

            await this.anchorService.anchorFabricEvent(data.unitId, 'UNIT_CREATE', '0x' + hash);

            return { success: true, unitId: data.unitId, hash };
        } finally {
            gateway.disconnect();
        }
    }

    public async getUnit(unitId: string, user: string) {
        const { gateway, contract } = await getFabricContract('mychannel', 'landregistry', 'UnitContract', user);
        try {
            const result = await contract.evaluateTransaction('QueryUnit', unitId);
            return JSON.parse(result.toString());
        } finally {
            gateway.disconnect();
        }
    }

    public async getUnitsByParcel(parentUlpin: string, user: string) {
        const { gateway, contract } = await getFabricContract('mychannel', 'landregistry', 'UnitContract', user);
        try {
            const result = await contract.evaluateTransaction('QueryUnitsByParcel', parentUlpin);
            return JSON.parse(result.toString());
        } finally {
            gateway.disconnect();
        }
    }
}
