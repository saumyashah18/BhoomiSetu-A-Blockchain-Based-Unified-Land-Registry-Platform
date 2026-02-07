import React from 'react';
import { Parcel } from '../types/parcel.types';
import { StatusBadge } from './StatusBadge';

interface PropertyCardProps {
    parcel: Parcel;
    onClick?: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ parcel, onClick }) => {
    return (
        <div className="border border-white/10 bg-white/5 rounded-lg p-4 shadow-sm hover:shadow-md hover:bg-white/10 transition-all cursor-pointer" onClick={onClick}>
            <h3 className="text-lg font-semibold text-text-main">{parcel.address}</h3>
            <div className="mt-2 flex justify-between items-center">
                <span className="text-text-muted">ID: {parcel.parcelId}</span>
                <StatusBadge status={parcel.status} />
            </div>
            <div className="mt-2 text-sm text-text-muted">
                Area: {parcel.area} sq.ft
            </div>
        </div>
    );
};
