import { Router } from 'express';
import { GeoJSONService } from '../gis/geojsonService';
import { ParcelService } from '../services/parcel.service';

const router = Router();
const geojsonService = new GeoJSONService();
const parcelService = new ParcelService();

router.get('/parcel/:ulpin', async (req, res) => {
    try {
        const { ulpin } = req.params;
        const { user } = req.query as { user: string };
        const parcel = await parcelService.getParcel(ulpin, user);

        // Mock coordinates for demonstration
        const mockCoords = [[[77.59, 12.97], [77.60, 12.97], [77.60, 12.98], [77.59, 12.98], [77.59, 12.97]]];
        const feature = geojsonService.formatParcelToGeoJSON(ulpin, mockCoords);

        res.status(200).json(feature);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
