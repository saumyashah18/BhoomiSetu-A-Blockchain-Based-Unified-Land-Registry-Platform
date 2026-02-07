import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

async function seedData() {
    console.log('--- Seeding BhoomiSetu Mock Data ---');

    const parcels = [
        {
            ulpin: 'ULPIN-1001-2024-5678',
            area: 1200,
            location: JSON.stringify({ type: 'Point', coordinates: [77.5946, 12.9716] }), // Bangalore
            user: 'admin'
        },
        {
            ulpin: 'ULPIN-1002-2024-9012',
            area: 2500,
            location: JSON.stringify({ type: 'Point', coordinates: [72.8777, 19.0760] }), // Mumbai
            user: 'admin'
        }
    ];

    for (const parcel of parcels) {
        try {
            console.log(`Creating Parcel: ${parcel.ulpin}...`);
            // Note: This assumes the server is running. 
            // In a real script, we might call the service directly if preferred.
            // const res = await axios.post(`${API_BASE_URL}/parcels`, parcel);
            // console.log(`Created: ${res.data.ulpin}`);
        } catch (error) {
            console.error(`Failed to create parcel ${parcel.ulpin}:`, error);
        }
    }

    const units = [
        {
            unitId: 'UNIT-1001-A1',
            parentUlpin: 'ULPIN-1001-2024-5678',
            uds: 450,
            user: 'citizen_1'
        }
    ];

    for (const unit of units) {
        try {
            console.log(`Creating Unit: ${unit.unitId}...`);
            // const res = await axios.post(`${API_BASE_URL}/units`, unit);
            // console.log(`Created: ${res.data.unitId}`);
        } catch (error) {
            console.error(`Failed to create unit ${unit.unitId}:`, error);
        }
    }

    console.log('--- Seeding Complete ---');
}

seedData();
