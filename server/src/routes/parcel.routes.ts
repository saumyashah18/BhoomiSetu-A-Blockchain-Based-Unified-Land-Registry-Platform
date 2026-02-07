import { Router } from 'express';
import { ParcelService } from '../services/parcel.service';

const router = Router();
const parcelService = new ParcelService();

router.post('/', async (req, res) => {
    try {
        const { ulpin, area, location, user } = req.body;
        const result = await parcelService.createParcel({ ulpin, area, location }, user);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/transfer', async (req, res) => {
    try {
        const { assetId, newOwnerId, user } = req.body;
        // Generate a random Request ID for now
        const requestId = 'REQ_' + Date.now();
        const result = await parcelService.initiateTransfer(requestId, assetId, newOwnerId, user);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/approve-transfer', async (req, res) => {
    try {
        const { requestId, user } = req.body;
        const result = await parcelService.approveTransfer(requestId, user);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:ulpin', async (req, res) => {
    try {
        const { ulpin } = req.params;
        const { user } = req.query as { user: string };
        const result = await parcelService.getParcel(ulpin, user);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
