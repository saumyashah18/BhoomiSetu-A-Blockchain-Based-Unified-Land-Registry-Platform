import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Help helper to auto-fit bounds
const ZoomToFeature: React.FC<{ feature: any }> = ({ feature }) => {
    const map = useMap();
    useEffect(() => {
        if (feature) {
            const layer = L.geoJSON(feature);
            map.fitBounds(layer.getBounds(), { padding: [20, 20], maxZoom: 18 });
        }
    }, [feature, map]);
    return null;
};

interface ParcelMapProps {
    center: [number, number];
    zoom?: number;
    feature?: any;
}

export const ParcelMap: React.FC<ParcelMapProps> = ({ center, zoom = 16, feature }) => {
    const satelliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    const attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';

    return (
        <div className="h-full w-full">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer attribution={attribution} url={satelliteUrl} />
                {feature && (
                    <>
                        <GeoJSON
                            data={feature}
                            style={{
                                color: '#3b82f6',
                                weight: 3,
                                opacity: 1,
                                fillColor: '#3b82f6',
                                fillOpacity: 0.2
                            }}
                        />
                        <ZoomToFeature feature={feature} />
                    </>
                )}
            </MapContainer>
        </div>
    );
};

