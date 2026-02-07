import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import parcelRoutes from './routes/parcel.routes';
import unitRoutes from './routes/unit.routes';
import transferRoutes from './routes/transfer.routes';
import disputeRoutes from './routes/dispute.routes';
import mapRoutes from './routes/map.routes';
import debugRoutes from './routes/debug.routes';
import { getWeb3Client } from './ethereum/web3Client';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/parcels', parcelRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/debug', debugRoutes);

// Health Check
app.get('/health', async (req, res) => {
    const healthStatus: any = {
        status: 'UP',
        timestamp: new Date(),
        services: {
            backend: 'OK',
            ethereum: 'UNKNOWN',
            ipfs: 'OK' // IPFS service logs connection in constructor
        }
    };

    try {
        const web3 = getWeb3Client();
        await web3.eth.net.isListening();
        healthStatus.services.ethereum = 'CONNECTED';
    } catch {
        healthStatus.services.ethereum = 'DISCONNECTED';
    }

    res.status(200).json(healthStatus);
});

app.listen(port, () => {
    console.log(`BhoomiSetu Backend listening at http://localhost:${port}`);
});
