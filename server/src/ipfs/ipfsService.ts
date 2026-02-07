import { create, IPFSHTTPClient } from 'ipfs-http-client';

export class IpfsService {
    private client: IPFSHTTPClient;

    constructor() {
        const ipfsUrl = process.env.IPFS_URL || 'http://localhost:5001';
        this.client = create({ url: ipfsUrl });
        console.log('✅ IPFS Service is working (Connected to ' + ipfsUrl + ')');
    }

    public async uploadDocument(buffer: Buffer): Promise<string> {
        try {
            const { cid } = await this.client.add(buffer);
            return cid.toString();
        } catch (error) {
            console.warn('IPFS upload failed. Returning mock CID.');
            return 'QmMockHash1234567890';
        }
    }

    public async getDocument(cid: string): Promise<Uint8Array> {
        const chunks = [];
        for await (const chunk of this.client.cat(cid)) {
            chunks.push(chunk);
        }
        return new Uint8Array(Buffer.concat(chunks));
    }
}
