"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_contract_api_1 = require("fabric-contract-api");
let ParcelContract = class ParcelContract extends fabric_contract_api_1.Contract {
    async QueryParcel(ctx, ulpin) {
        const parcelJSON = await ctx.stub.getState(ulpin);
        if (!parcelJSON || parcelJSON.length === 0) {
            throw new Error(`The parcel ${ulpin} does not exist`);
        }
        return parcelJSON.toString();
    }
    async CreateParcel(ctx, ulpin, area, location, ownerId, docHash) {
        const exists = await this.ParcelExists(ctx, ulpin);
        if (exists) {
            throw new Error(`The parcel ${ulpin} already exists`);
        }
        const parcel = {
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
    async ParcelExists(ctx, ulpin) {
        const parcelJSON = await ctx.stub.getState(ulpin);
        return (parcelJSON && parcelJSON.length > 0);
    }
    async UpdateStatus(ctx, ulpin, newStatus) {
        const parcelJSON = await ctx.stub.getState(ulpin);
        if (!parcelJSON || parcelJSON.length === 0) {
            throw new Error(`The parcel ${ulpin} does not exist`);
        }
        const parcel = JSON.parse(parcelJSON.toString());
        parcel.status = newStatus;
        parcel.lastUpdated = Math.floor(Date.now() / 1000);
        await ctx.stub.putState(ulpin, Buffer.from(JSON.stringify(parcel)));
    }
};
__decorate([
    fabric_contract_api_1.Transaction(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], ParcelContract.prototype, "QueryParcel", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, Number, String, String, String]),
    __metadata("design:returntype", Promise)
], ParcelContract.prototype, "CreateParcel", null);
__decorate([
    fabric_contract_api_1.Transaction(false),
    fabric_contract_api_1.Returns('boolean'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], ParcelContract.prototype, "ParcelExists", null);
__decorate([
    fabric_contract_api_1.Transaction(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], ParcelContract.prototype, "UpdateStatus", null);
ParcelContract = __decorate([
    fabric_contract_api_1.Info({ title: 'ParcelContract', description: 'Smart contract for managing land parcels' })
], ParcelContract);
exports.ParcelContract = ParcelContract;
//# sourceMappingURL=parcelContract.js.map