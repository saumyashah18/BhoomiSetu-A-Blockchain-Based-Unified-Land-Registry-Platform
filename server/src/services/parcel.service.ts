import { getFabricContract } from '../fabric/gateway';
import { IpfsService } from '../ipfs/ipfsService';
import { AnchorService } from '../ethereum/anchorService';
import * as crypto from 'crypto';

export class ParcelService {
    private ipfsService: IpfsService;
    private anchorService: AnchorService;

    constructor() {
        this.ipfsService = new IpfsService();
        this.anchorService = new AnchorService();
    }

    public async createParcel(data: any, user: string) {
        const hash = crypto.createHash('sha256').update(JSON.stringify(data) + Date.now()).digest('hex');

        const { gateway, contract } = await getFabricContract('mychannel', 'ParcelContract', user);
        try {
            await contract.submitTransaction(
                'CreateParcel',
                data.ulpin,
                data.area.toString(),
                data.location,
                user,
                hash
            );

            await this.anchorService.anchorFabricEvent(data.ulpin, 'CREATE', '0x' + hash);

            return { success: true, ulpin: data.ulpin, hash };
        } finally {
            gateway.disconnect();
        }
    }

    public async getParcel(ulpin: string, user: string) {
        const { gateway, contract } = await getFabricContract('mychannel', 'ParcelContract', user);
        try {
            const result = await contract.evaluateTransaction('QueryParcel', ulpin);
            return JSON.parse(result.toString());
        } finally {
            gateway.disconnect();
        }
    }
}
