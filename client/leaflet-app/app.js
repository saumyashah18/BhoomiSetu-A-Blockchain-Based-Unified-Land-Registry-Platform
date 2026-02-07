// Initialize Map
const map = L.map('map', {
    zoomControl: false
}).setView([23.18, 72.64], 14);

// ESRI Satellite Basemap
const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);

L.control.zoom({ position: 'topright' }).addTo(map);

// Global Variables
let geojsonLayer;
let blocksData = null;

// Property Fallback Helper
function getBlockProperty(props, keys) {
    for (let key of keys) {
        if (props[key] !== undefined && props[key] !== null) return props[key];
    }
    return null;
}

// ULPIN Generator Fallback (Deterministic based on coordinates)
async function getULPIN(feature) {
    if (feature.properties.ULPIN) return feature.properties.ULPIN;

    const coords = feature.geometry.coordinates;
    let lat = 0, lon = 0, count = 0;

    const processRing = (r) => {
        r.forEach(c => {
            lon += c[0]; lat += c[1]; count++;
        });
    };

    if (Array.isArray(coords[0][0][0])) {
        coords.forEach(poly => poly.forEach(r => processRing(r)));
    } else if (Array.isArray(coords[0][0])) {
        coords.forEach(r => processRing(r));
    } else {
        processRing(coords);
    }

    const cLat = (lat / count).toFixed(7);
    const cLon = (lon / count).toFixed(7);
    const str = `LAT:${cLat}LON:${cLon}`;

    // Simple robust hash for browser
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

// Styling Logic
function getStyle(feature) {
    const props = feature.properties;
    const type = getBlockProperty(props, ['Block_Type', 'ownership_type', 'Status', 'type', 'ownership']) || "Private Owned";
    const isAgri = type.toLowerCase().includes('agriculture');

    return {
        fillColor: isAgri ? "#22c55e" : (String(type).toLowerCase().includes('public') ? "#ef4444" : "#fbbf24"),
        weight: 1.5,
        opacity: 0.8,
        color: isAgri ? "#22c55e" : 'white', // Agricultural land gets green borders
        fillOpacity: 0 // Default to transparent as requested
    };
}

// Hover/Search Highlight Style
const highlightStyle = {
    weight: 4,
    color: '#3b82f6', // Bright blue border for highlight
    fillOpacity: 0.2, // Very subtle fill on highlight
};

let highlightLayer = null;

function onEachFeature(feature, layer) {
    const props = feature.properties;
    const blockId = getBlockProperty(props, ['fid', 'Block_ID', 'ID', 'osm_id']) || 'Unknown';
    const blockType = getBlockProperty(props, ['Block_Type', 'ownership_type', 'type', 'ownership']) || 'Private Owned';

    // Tooltips (ID Labels) - Only shown on interaction
    layer.bindTooltip(`ID: ${blockId}`, {
        permanent: false, // Changed from true as requested
        direction: 'center',
        className: 'block-label'
    });

    // Popups
    getULPIN(feature).then(ulpin => {
        const popupContent = `
            <div class="popup-title">Block Details</div>
            <div class="popup-field"><b>Bhu-Aadhar (ULPIN):</b> <span style="color:#2563eb; font-family:monospace;">${ulpin}</span></div>
            <div class="popup-field"><b>Unique ID:</b> ${blockId}</div>
            <div class="popup-field"><b>Type:</b> ${blockType}</div>
            <div class="popup-field"><b>Name:</b> ${props.name || 'N/A'}</div>
            <hr>
            <div class="popup-field" style="font-size: 11px; opacity: 0.8;">
                <b>Status:</b> ${blockType === 'Agriculture' ? 'Agricultural Parcel' : 'Tokenized Land'}
            </div>
        `;
        layer.bindPopup(popupContent);
    });

    // Interaction Events
    layer.on({
        mouseover: (e) => {
            if (highlightLayer !== e.target) {
                e.target.setStyle(highlightStyle);
                e.target.bringToFront();
            }
        },
        mouseout: (e) => {
            if (highlightLayer !== e.target) {
                geojsonLayer.resetStyle(e.target);
            }
        },
        click: (e) => {
            map.fitBounds(e.target.getBounds());
            if (highlightLayer) geojsonLayer.resetStyle(highlightLayer);
            highlightLayer = e.target;
            e.target.setStyle(highlightStyle);
        }
    });
}

// Data Storage
let combinedData = { type: "FeatureCollection", features: [] };

// Unified Load Function
function updateMap() {
    if (geojsonLayer) map.removeLayer(geojsonLayer);
    geojsonLayer = L.geoJSON(combinedData, {
        style: getStyle,
        onEachFeature: onEachFeature
    }).addTo(map);
}

// Load Ownership Data
const fetchOwnership = fetch('blocks_ownership.geojson').then(r => r.json());
const fetchFarmland = fetch('farmland.geojson').then(r => r.json()).catch(() => ({ features: [] }));

Promise.all([fetchOwnership, fetchFarmland])
    .then(([ownership, farmland]) => {
        combinedData.features = [...ownership.features, ...farmland.features];
        console.log("Loaded", combinedData.features.length, "parcels total.");
        updateMap();
        if (geojsonLayer.getBounds().isValid()) {
            map.fitBounds(geojsonLayer.getBounds());
        }
    })
    .catch(err => {
        console.error("Map Load Error:", err);
        const isLocal = window.location.protocol === 'file:';
        if (isLocal) {
            const errorOverlay = document.createElement('div');
            errorOverlay.style = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:25px;border-radius:12px;z-index:9999;box-shadow:0 10px 30px rgba(0,0,0,0.3);text-align:center;max-width:400px;font-family:sans-serif;";
            errorOverlay.innerHTML = `
                <h2 style="color:#ef4444;margin-top:0;">Local File Restriction</h2>
                <p style="color:#475569;line-height:1.5;">Modern browsers block data loading from local files (CORS). To see the land parcels, please use a local server:</p>
                <div style="background:#f1f5f9;padding:12px;border-radius:6px;font-family:monospace;font-size:13px;margin:15px 0;">npx serve .</div>
                <button onclick="this.parentElement.remove()" style="background:#2563eb;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-weight:600;">I Understand</button>
            `;
            document.body.appendChild(errorOverlay);
        }
    });

// UI Listeners
const slider = document.getElementById('opacitySlider');
if (slider) {
    slider.addEventListener('input', () => {
        if (geojsonLayer) geojsonLayer.setStyle(getStyle);
    });
}

map.on('zoomend', () => {
    const zoomLevel = map.getZoom();
    const tooltipOpacity = zoomLevel >= 14 ? 1 : 0;
    if (geojsonLayer) {
        geojsonLayer.eachLayer(layer => {
            if (layer.getTooltip()) layer.getTooltip().setOpacity(tooltipOpacity);
        });
    }
});

const searchInput = document.getElementById('blockSearch');
const searchBtn = document.getElementById('searchBtn');
const layerToggle = document.getElementById('layerToggle');

if (layerToggle) {
    layerToggle.addEventListener('change', (e) => {
        if (geojsonLayer) {
            if (e.target.checked) map.addLayer(geojsonLayer);
            else map.removeLayer(geojsonLayer);
        }
    });
}

function performSearch() {
    const val = searchInput ? searchInput.value.trim() : "";
    if (!val || !geojsonLayer) return;

    let foundFeature = null;
    const searchPromises = [];

    geojsonLayer.eachLayer(layer => {
        const promise = getULPIN(layer.feature).then(ulpin => {
            const props = layer.feature.properties;
            const id = getBlockProperty(props, ['fid', 'Block_ID', 'ID', 'osm_id']);

            if ((id && id.toString() === val) || (ulpin && ulpin.toString().toUpperCase() === val.toUpperCase())) {
                foundFeature = layer;
            }
        });
        searchPromises.push(promise);
    });

    Promise.all(searchPromises).then(() => {
        if (foundFeature) {
            map.fitBounds(foundFeature.getBounds(), { maxZoom: 18 });
            // Apply highlight
            if (highlightLayer) geojsonLayer.resetStyle(highlightLayer);
            highlightLayer = foundFeature;
            foundFeature.setStyle(highlightStyle);
            foundFeature.bringToFront();
            foundFeature.openPopup();
        } else {
            alert("Block ID or ULPIN not found!");
        }
    });
}

if (searchBtn) searchBtn.addEventListener('click', performSearch);
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
}
