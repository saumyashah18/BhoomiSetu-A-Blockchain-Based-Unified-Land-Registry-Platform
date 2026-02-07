export class GeoJSONService {
    /**
     * Validates and processes land parcel boundary data.
     * @param geojson GeoJSON string or object
     */
    public validateBoundary(geojson: any): boolean {
        // Basic check for GeoJSON structure
        if (!geojson || !geojson.type) return false;
        if (geojson.type !== 'Feature' && geojson.type !== 'Polygon') return false;
        return true;
    }

    /**
     * Formats land parcel data into a standardized GeoJSON Feature.
     */
    public formatParcelToGeoJSON(ulpin: string, coordinates: number[][][]): any {
        return {
            type: "Feature",
            id: ulpin,
            geometry: {
                type: "Polygon",
                coordinates: coordinates
            },
            properties: {
                ulpin: ulpin
            }
        };
    }
}
