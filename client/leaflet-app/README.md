# LandDigit GIS - Cadastral Visualization System

A modern web-based Geographic Information System (GIS) for visualizing land ownership and agricultural parcels using interactive satellite maps.

## Overview

LandDigit GIS is an interactive map application that displays land parcels with ownership information, using **Leaflet.js** for mapping and **ULPIN (Unique Land Parcel Identification Number)** – also known as **Bhu-Aadhar** – for identifying individual land parcels.

## Key Features

- **Interactive Satellite Mapping** - ESRI World Imagery satellite basemap
- **Land Ownership Visualization** - Color-coded parcels by ownership type
- **ULPIN Generation** - Automatic generation of unique 14-character alphanumeric land identifiers
- **Search Functionality** - Search parcels by Block ID or ULPIN
- **Agricultural Land Detection** - Special styling for farmland parcels
- **Dynamic Controls** - Toggle layers and adjust opacity in real-time

## How It Works

### 1. Data Layer
The application loads two GeoJSON files:
- **`blocks_ownership.geojson`** (9.2 MB) - Contains ~40,000 land parcels with ownership data
- **`farmland.geojson`** (3.4 KB) - Contains agricultural land parcels

### 2. ULPIN Generation
Each land parcel is assigned a unique **Bhu-Aadhar (ULPIN)** using a deterministic algorithm:

```javascript
// Calculate centroid of polygon → Generate hash → Convert to Base36
const coordStr = `LAT:${lat.toFixed(7)}LON:${lon.toFixed(7)}`;
const hash = simpleHash(coordStr);
const ulpin = hash.toString(36).toUpperCase().substring(0, 14);
```

**Why this approach?**
- **Browser-compatible** - No crypto libraries needed
- **Deterministic** - Same coordinates always produce the same ULPIN
- **Unique** - 14-character alphanumeric code (36^14 possible combinations)

### 3. Visualization
Land parcels are color-coded based on ownership type:
- 🟢 **Green** - Agricultural land
- 🔴 **Red** - Public owned
- 🟡 **Yellow** - Private owned

### 4. Interactive Features
- **Click** - View detailed parcel information popup
- **Hover** - Highlight parcel boundaries
- **Search** - Find parcels by ID or ULPIN
- **Zoom** - ID labels appear automatically at high zoom levels (≥14)

## Project Structure

```
Leaflet_Project/
├── index.html              # Main HTML page
├── app.js                  # Core application logic
├── styles.css              # UI styling (glassmorphism design)
├── blocks_ownership.geojson # Ownership data
├── farmland.geojson        # Agricultural parcels
├── package.json            # NPM configuration
└── ULPIN_Records/
    ├── registry_sample.csv # Sample ULPIN registry
    └── README.md          # Registry documentation
```

## Tech Stack

- **Mapping** - [Leaflet.js](https://leafletjs.com/) v1.9.4
- **Basemap** - ESRI World Imagery (satellite)
- **Styling** - Vanilla CSS (glassmorphism effects)
- **Fonts** - Google Fonts (Inter)
- **Dev Server** - Vite

## Running the Application

### Option 1: Using Vite (Recommended)
```bash
npm run dev
```
Then open your browser to the URL shown (typically http://localhost:5173)

### Option 2: Using any HTTP server
```bash
npx serve .
# or
python -m http.server 8000
```

> **Note:** Do not open `index.html` directly in the browser. Modern browsers block local file access (CORS policy), so you must use a local server.

## Application Architecture

### Data Flow
```
GeoJSON Files → Parse → Calculate ULPIN → Style Parcels → Render Map → User Interaction
```

### Key Functions

**`getULPIN(feature)`** - Generates ULPIN from polygon centroid  
**`getStyle(feature)`** - Returns color based on ownership type  
**`onEachFeature(feature, layer)`** - Attaches popups and event handlers  
**`performSearch()`** - Searches parcels by ID or ULPIN

### Event Handling
- **Mouseover** - Apply highlight style
- **Mouseout** - Reset to default style
- **Click** - Zoom to parcel and show popup
- **Search** - Find and focus on matching parcel

## Configuration

Adjust map settings in `app.js`:
```javascript
const map = L.map('map').setView([23.18, 72.64], 14); // Center coordinates and zoom
```

Modify colors in the `getStyle()` function:
```javascript
fillColor: isAgri ? "#22c55e" : (isPublic ? "#ef4444" : "#fbbf24")
```

## Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

## License

ISC
