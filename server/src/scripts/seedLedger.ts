import * as fs from 'fs';
import * as path from 'path';
import { ParcelService } from '../services/parcel.service';

async function seedLedger() {
    const parcelService = new ParcelService();
    const basePath = path.resolve(__dirname, '../../../client/leaflet-app');
    const files = ['blocks_ownership.geojson', 'farmland.geojson'];

    for (const fileName of files) {
        const geojsonPath = path.join(basePath, fileName);
        if (!fs.existsSync(geojsonPath)) {
            console.warn(`File not found: ${fileName}`);
            continue;
        }

        const geojson = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
        console.log(`\nProcessing ${fileName} (${geojson.features.length} features)`);

        let successCount = 0;
        let failCount = 0;
        const user = 'admin';

        for (const feature of geojson.features) {
            const props = feature.properties;
            const fid = props['fid'] || props['Block_ID'] || props['ID'] || props['osm_id'];

            // 1. Determine ULPIN (Priority: Fixed Property > Generated)
            let ulpin = props['ULPIN'];
            if (!ulpin) {
                // Determine center point for ULPIN hash generation (simplified matching app.js)
                const coords = feature.geometry.coordinates;
                let lat = 0, lon = 0, count = 0;

                const processRing = (r: any[]) => {
                    r.forEach(c => {
                        lon += c[0]; lat += c[1]; count++;
                    });
                };

                // Handle Polygon and MultiPolygon
                if (feature.geometry.type === 'MultiPolygon') {
                    coords.forEach((poly: any[]) => poly.forEach(r => processRing(r)));
                } else if (feature.geometry.type === 'Polygon') {
                    coords.forEach((r: any[]) => processRing(r));
                }

                const cLat = (lat / count).toFixed(7);
                const cLon = (lon / count).toFixed(7);
                const str = `LAT:${cLat}LON:${cLon}`;

                // Deterministic hash matching app.js
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash = ((hash << 5) - hash) + str.charCodeAt(i);
                    hash |= 0;
                }
                ulpin = Math.abs(hash).toString(36).toUpperCase();
                while (ulpin.length < 14) ulpin += (ulpin.length % 10).toString();
                ulpin = ulpin.substring(0, 14);
            }

            const area = 1000; // Mock area
            const location = feature.geometry.type;

            try {
                await parcelService.createParcel({
                    ulpin,
                    area,
                    location
                }, user);
                console.log(`✅ Seeded ${ulpin} (${fid || 'No FID'})`);
                successCount++;
            } catch (error: any) {
                if (error.message && (error.message.includes('already exists') || error.message.includes('Access Denied'))) {
                    // Silently handle or log minimal
                } else {
                    console.error(`❌ Failed ${ulpin}:`, error.message);
                    failCount++;
                }
            }
        }
        console.log(`${fileName} Summary: Success ${successCount}, Failed ${failCount}`);
    }
}

seedLedger().catch(console.error);
