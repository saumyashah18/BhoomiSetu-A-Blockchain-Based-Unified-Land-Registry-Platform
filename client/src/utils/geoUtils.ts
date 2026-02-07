/**
 * Deterministic ULPIN (Bhu-Aadhar) Generator
 * Based on coordinates of the feature (Polygon or MultiPolygon)
 * Ported from client/leaflet-app/app.js
 */
export async function getULPIN(feature: any): Promise<string> {
    if (feature.properties.ULPIN) return feature.properties.ULPIN;

    const coords = feature.geometry.coordinates;
    let lat = 0, lon = 0, count = 0;

    const processRing = (r: number[][]) => {
        r.forEach(c => {
            lon += c[0]; lat += c[1]; count++;
        });
    };

    if (Array.isArray(coords[0][0][0])) {
        // MultiPolygon
        coords.forEach((poly: any) => poly.forEach((r: any) => processRing(r)));
    } else if (Array.isArray(coords[0][0])) {
        // Polygon
        coords.forEach((r: any) => processRing(r));
    } else {
        // Single Ring or Line
        processRing(coords);
    }

    const cLat = (lat / count).toFixed(7);
    const cLon = (lon / count).toFixed(7);
    const str = `LAT:${cLat}LON:${cLon}`;

    // Simple robust hash
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }

    // Convert to 14-char alphanumeric (Base36)
    let bhu = Math.abs(hash).toString(36).toUpperCase();
    while (bhu.length < 14) bhu += (bhu.length % 10).toString();
    return bhu.substring(0, 14);
}
