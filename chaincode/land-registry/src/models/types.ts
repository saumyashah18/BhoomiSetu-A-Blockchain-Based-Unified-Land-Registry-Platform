export interface OwnershipRecord {
    ownerId: string;
    ownershipType: 'FULL' | 'JOINT' | 'INHERITED';
    sharePercentage: number;
}

export interface Parcel {
    docType?: string;
    ulpin: string;
    area: number;
    location: string; // GeoJSON string or reference
    owners: OwnershipRecord[];
    status: 'ACTIVE' | 'FROZEN' | 'RESTRICTED' | 'GOVERNMENT';
    encumbrances: string[];
    disputes: string[];
    lastUpdated: number;
    docHash: string; // IPFS Hash of deed
}

export interface Unit {
    docType?: string;
    unitId: string;
    parentUlpin: string;
    uds: number;
    owners: OwnershipRecord[];
    status: 'ACTIVE' | 'FROZEN';
    lastUpdated: number;
    docHash: string;
}

export interface Dispute {
    docType?: string;
    disputeId: string;
    assetId: string; // ULPIN or UnitID
    reason: string;
    status: 'OPEN' | 'RESOLVED';
    createdAt: number;
    resolvedAt?: number;
}

export interface Encumbrance {
    docType?: string;
    encumbranceId: string;
    assetId: string;
    type: 'MORTGAGE' | 'LEASE' | 'LIEN';
    status: 'ACTIVE' | 'RELEASED';
    docHash: string;
}
