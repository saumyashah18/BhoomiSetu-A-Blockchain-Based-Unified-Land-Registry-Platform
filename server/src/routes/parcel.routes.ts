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
