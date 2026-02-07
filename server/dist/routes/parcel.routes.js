"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const parcel_service_1 = require("../services/parcel.service");
const router = (0, express_1.Router)();
const parcelService = new parcel_service_1.ParcelService();
router.post('/', async (req, res) => {
    try {
        const { ulpin, area, location, user } = req.body;
        const result = await parcelService.createParcel({ ulpin, area, location }, user);
        res.status(201).json(result);
    }
    catch (error) {
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
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/approve-transfer', async (req, res) => {
    try {
        const { requestId, user } = req.body;
        const result = await parcelService.approveTransfer(requestId, user);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/:ulpin', async (req, res) => {
    try {
        const { ulpin } = req.params;
        const { user } = req.query;
        const result = await parcelService.getParcel(ulpin, user);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.default = router;
