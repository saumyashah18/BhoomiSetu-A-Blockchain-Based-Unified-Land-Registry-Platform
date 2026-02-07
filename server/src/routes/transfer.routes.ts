import { Router } from 'express';
import { TransferService } from '../services/transfer.service';

const router = Router();
const transferService = new TransferService();

router.post('/', async (req, res) => {
    try {
        const { assetId, newOwnerId, user } = req.body;
        const result = await transferService.transferAsset(assetId, newOwnerId, user);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
