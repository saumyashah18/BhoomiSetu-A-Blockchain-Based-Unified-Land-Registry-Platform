const fs = require('fs');
const path = require('path');

// ULPIN Generator Logic (Mirrored from app.js)
function calculateULPIN(feature) {
    if (feature.properties.ULPIN) return feature.properties.ULPIN;

    const coords = feature.geometry.coordinates;
    let lat = 0, lon = 0, count = 0;

    const processRing = (r) => {
        r.forEach(c => {
            lon += c[0]; lat += c[1]; count++;
        });
    };

    if (feature.geometry.type === 'MultiPolygon') {
        coords.forEach(poly => poly.forEach(r => processRing(r)));
    } else if (feature.geometry.type === 'Polygon') {
        coords.forEach(r => processRing(r));
    } else {
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

    let bhu = Math.abs(hash).toString(36).toUpperCase();
    while (bhu.length < 14) bhu += (bhu.length % 10).toString();
    return bhu.substring(0, 14);
}

function processGeoJSON(filePath) {
    console.log(`Processing ${filePath}...`);
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let modifiedCount = 0;

        data.features.forEach(feature => {
            if (!feature.properties.ULPIN) {
                feature.properties.ULPIN = calculateULPIN(feature);
                modifiedCount++;
            }
        });

        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        console.log(`Success: Added ${modifiedCount} ULPINs to ${filePath}`);
    } catch (err) {
        console.error(`Error processing ${filePath}:`, err.message);
    }
}

// Files to process
const targetFiles = [
    path.join(__dirname, 'blocks_ownership.geojson'),
    path.join(__dirname, 'farmland.geojson')
];

targetFiles.forEach(file => {
    if (fs.existsSync(file)) {
        processGeoJSON(file);
    } else {
        console.warn(`File not found: ${file}`);
    }
});
