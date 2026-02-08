console.log('🚀 BhoomiSetu Backend is booting...');
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

console.log('📦 Loading modules...');
dotenv.config();
console.log('✅ Environment loaded');

console.log('🛣️  Loading routes...');
import parcelRoutes from './routes/parcel.routes';
import unitRoutes from './routes/unit.routes';
import transferRoutes from './routes/transfer.routes';
import disputeRoutes from './routes/dispute.routes';
import mapRoutes from './routes/map.routes';
import debugRoutes from './routes/debug.routes';
import kycRoutes from './routes/kyc.routes';
import authRoutes from './routes/auth.routes';
import evaluationRoutes from './routes/evaluation.routes';
import { getWeb3Client } from './ethereum/web3Client';
console.log('✅ Routes loaded');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/parcels', parcelRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/evaluation', evaluationRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
    console.error('❌ GLOBAL ERROR:', err);
    res.status(500).json({
        success: false,
        error: 'Global Server Error',
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
});

// Root Route
app.get('/', (req: Request, res: Response) => {
    console.log('GET / requested');
    res.json({
        message: 'Welcome to BhoomiSetu API',
        version: '1.0.2',
        env: process.env.NODE_ENV,
        vercel: !!process.env.VERCEL,
        docs: '/health'
    });
});


// Health Check
app.get('/health', async (req: Request, res: Response) => {
    const healthStatus: any = {
        status: 'UP',
        timestamp: new Date(),
        version: '1.0.2',
        services: {
            backend: 'OK',
            ethereum: 'UNKNOWN',
            ipfs: 'OK'
        }
    };

    try {
        const web3 = getWeb3Client();
        await web3.eth.net.isListening();
        healthStatus.services.ethereum = 'CONNECTED';
    } catch {
        healthStatus.services.ethereum = 'MOCKED_OR_ERROR';
    }

    res.status(200).json(healthStatus);
});

// Export app for Vercel
export default app;

console.log('🚀 App setup complete. Preparing to listen...');

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(port, () => {
        console.log(`✅ BhoomiSetu Backend listening at http://localhost:${port}`);
    });
}


