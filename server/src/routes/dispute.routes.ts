import { Router } from 'express';
import { DisputeService } from '../services/dispute.service';

const router = Router();
const disputeService = new DisputeService();

router.post('/raise', async (req, res) => {
    try {
        const { assetId, reason, user } = req.body;
        const result = await disputeService.raiseDispute(assetId, reason, user);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/resolve', async (req, res) => {
    try {
        const { disputeId, user } = req.body;
        const result = await disputeService.resolveDispute(disputeId, user);
        res.status(200).json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
