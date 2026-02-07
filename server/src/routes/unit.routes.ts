import { Router } from 'express';
import { UnitService } from '../services/unit.service';

const router = Router();
const unitService = new UnitService();

router.post('/', async (req, res) => {
    try {
        const { unitId, parentUlpin, uds, user } = req.body;
        const result = await unitService.createUnit({ unitId, parentUlpin, uds }, user);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:unitId', async (req, res) => {
    try {
        const { unitId } = req.params;
        const { user } = req.query as { user: string };
        const result = await unitService.getUnit(unitId, user);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/parcel/:ulpin', async (req, res) => {
    try {
        const { ulpin } = req.params;
        const { user } = req.query as { user: string };
        const result = await unitService.getUnitsByParcel(ulpin, user);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
