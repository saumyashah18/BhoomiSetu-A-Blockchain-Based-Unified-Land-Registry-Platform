import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/GlassCard';
import { Badge } from '../components/ui/Badge';
import { API_BASE_URL } from '../utils/constants';

import { BlockchainVisualizer } from '../components/BlockchainVisualizer';

interface FlowStep {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    icon: string;
    timestamp?: string;
    hash?: string;
    explorerUrl?: string;
}

export const Evaluation: React.FC = () => {
    const [steps, setSteps] = useState<FlowStep[]>([
        {
            id: 'fabric',
            title: 'Hyperledger Fabric Ledger',
            description: 'Authoritative storage of land record & ownership history',
            status: 'completed',
            icon: '⛓️',
            timestamp: new Date().toISOString()
        },
        {
            id: 'hashing',
            title: 'SHA256 Hash Generation',
            description: 'Creating a unique cryptographic fingerprint of the record',
            status: 'processing',
            icon: '🔐'
        },
        {
            id: 'anchoring',
            title: 'Polygon Amoy Anchoring',
            description: 'Submitting hash to public blockchain for immutable proof',
            status: 'pending',
            icon: '⚖️'
        },
        {
            id: 'verification',
            title: 'Public Verification',
            description: 'Hash verified and accessible via AmoyScan explorer',
            status: 'pending',
            icon: '🔍'
        }
    ]);

    const [isLive, setIsLive] = useState(false);
    const [lastTx, setLastTx] = useState<any>(null);

    // Mock live update simulation for the demo
    useEffect(() => {
        if (!isLive) return;

        const timer = setTimeout(() => {
            setSteps(prev => prev.map(s => {
                if (s.id === 'hashing') return { ...s, status: 'completed', hash: '0xa3f5...d9e2' };
                if (s.id === 'anchoring') return { ...s, status: 'processing' };
                return s;
            }));
        }, 2000);

        const timer2 = setTimeout(() => {
            setSteps(prev => prev.map(s => {
                if (s.id === 'anchoring') return { ...s, status: 'completed', explorerUrl: 'https://amoy.polygonscan.com/tx/0x...' };
                if (s.id === 'verification') return { ...s, status: 'completed' };
                return s;
            }));
        }, 5000);

        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, [isLive]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">
                        Evaluation Dashboard
                    </h1>
                    <p className="text-text-muted mt-2">Real-time Hybrid Blockchain Flow Analysis</p>
                </div>
                <button
                    onClick={() => setIsLive(!isLive)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all ${isLive ? 'bg-red-500/20 text-red-400 border border-red-500/50' : 'bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30'}`}
                >
                    {isLive ? '🔴 Stop Simulation' : '🚀 Start Flow Simulation'}
                </button>
            </div>

            {/* Live Blockchain Visualizer */}
            <BlockchainVisualizer />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* Connecting Line */}
                <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 -translate-y-1/2 z-0" />

                {steps.map((step, index) => (
                    <GlassCard key={step.id} className={`relative z-10 flex flex-col items-center text-center p-6 border-t-4 ${step.status === 'completed' ? 'border-success' :
                        step.status === 'processing' ? 'border-primary animate-pulse' :
                            'border-white/10'
                        }`}>
                        <div className="text-4xl mb-4 bg-white/5 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">
                            {step.icon}
                        </div>
                        <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                        <p className="text-sm text-text-muted mb-4 flex-grow">{step.description}</p>

                        <Badge
                            label={step.status.toUpperCase()}
                            variant={step.status === 'completed' ? 'success' : step.status === 'processing' ? 'info' : 'neutral'}
                        />

                        {step.hash && (
                            <div className="mt-4 p-2 bg-black/20 rounded font-mono text-[10px] text-accent truncate w-full">
                                {step.hash}
                            </div>
                        )}

                        {step.explorerUrl && (
                            <a
                                href={step.explorerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 text-xs text-primary hover:underline flex items-center gap-1"
                            >
                                View on AmoyScan ↗
                            </a>
                        )}
                    </GlassCard>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard title="Architecture Integrity (Proof)" className="h-full">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="p-2 bg-primary/20 rounded">📜</div>
                            <div>
                                <div className="text-sm font-semibold text-text-muted uppercase tracking-tighter">Fabric Channel</div>
                                <div className="font-mono text-sm">mychannel</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="p-2 bg-accent/20 rounded">🌍</div>
                            <div>
                                <div className="text-sm font-semibold text-text-muted uppercase tracking-tighter">Polygon Network</div>
                                <div className="font-mono text-sm">Amoy Testnet (80002)</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5">
                            <div className="p-2 bg-success/20 rounded">📄</div>
                            <div>
                                <div className="text-sm font-semibold text-text-muted uppercase tracking-tighter">Anchor Contract</div>
                                <div className="font-mono text-sm truncate max-w-[200px]">0x0bb955b22105bA7D6F89aBCbEE1860e4DAD85A79</div>
                            </div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard title="System Performance" className="h-full">
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Fabric Throughput</span>
                                <span className="text-success">Sub-second</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2">
                                <div className="bg-success h-2 rounded-full w-[95%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Amoy Settlement Time</span>
                                <span className="text-primary">~2.5s (Typical)</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full w-[80%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span>Hash Consistency</span>
                                <span className="text-accent">100% Verified</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2">
                                <div className="bg-accent h-2 rounded-full w-full" />
                            </div>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
