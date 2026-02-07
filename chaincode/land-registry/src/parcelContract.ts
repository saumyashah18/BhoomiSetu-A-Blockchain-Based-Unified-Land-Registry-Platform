import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Parcel } from './models/types';

@Info({ title: 'ParcelContract', description: 'Smart contract for managing land parcels' })
export class ParcelContract extends Contract {

    @Transaction(false)
    public async QueryParcel(ctx: Context, ulpin: string): Promise<string> {
        const parcelJSON = await ctx.stub.getState(ulpin);
        if (!parcelJSON || parcelJSON.length === 0) {
            throw new Error(`The parcel ${ulpin} does not exist`);
        }
        return parcelJSON.toString();
    }

    @Transaction()
    public async CreateParcel(
        ctx: Context,
        ulpin: string,
        area: number,
        location: string,
        ownerId: string,
        docHash: string
    ): Promise<void> {
        const exists = await this.ParcelExists(ctx, ulpin);
        if (exists) {
            throw new Error(`The parcel ${ulpin} already exists`);
        }

        const parcel: Parcel = {
            docType: 'parcel',
            ulpin,
            area,
            location,
            owners: [{
                ownerId,
                ownershipType: 'FULL',
                sharePercentage: 100
            }],
            status: 'ACTIVE',
            encumbrances: [],
            disputes: [],
            lastUpdated: Math.floor(Date.now() / 1000),
            docHash
        };

        await ctx.stub.putState(ulpin, Buffer.from(JSON.stringify(parcel)));
    }

    @Transaction(false)
    @Returns('boolean')
    public async ParcelExists(ctx: Context, ulpin: string): Promise<boolean> {
        const parcelJSON = await ctx.stub.getState(ulpin);
        return (parcelJSON && parcelJSON.length > 0);
    }

    @Transaction()
    public async UpdateStatus(ctx: Context, ulpin: string, newStatus: string): Promise<void> {
        const parcelJSON = await ctx.stub.getState(ulpin);
        if (!parcelJSON || parcelJSON.length === 0) {
            throw new Error(`The parcel ${ulpin} does not exist`);
        }

        const parcel: Parcel = JSON.parse(parcelJSON.toString());
        parcel.status = newStatus as any;
        parcel.lastUpdated = Math.floor(Date.now() / 1000);

        await ctx.stub.putState(ulpin, Buffer.from(JSON.stringify(parcel)));
    }
}
