import { Context, Contract } from 'fabric-contract-api';
export declare class ParcelContract extends Contract {
    QueryParcel(ctx: Context, ulpin: string): Promise<string>;
    CreateParcel(ctx: Context, ulpin: string, area: number, location: string, ownerId: string, docHash: string): Promise<void>;
    ParcelExists(ctx: Context, ulpin: string): Promise<boolean>;
    UpdateStatus(ctx: Context, ulpin: string, newStatus: string): Promise<void>;
}
