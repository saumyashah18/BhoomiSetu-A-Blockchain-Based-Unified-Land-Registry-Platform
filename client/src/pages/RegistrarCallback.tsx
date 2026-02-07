import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const RegistrarCallback: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setRegistrarSession } = useAuth();

    const [status, setStatus] = useState<'loading' | 'wallet' | 'success' | 'error'>('loading');
    const [claims, setClaims] = useState<any>(null);
    const [error, setError] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

    useEffect(() => {
        const sessionToken = searchParams.get('session');
        if (!sessionToken) {
            setError('No session token received');
            setStatus('error');
            return;
        }

        // Store session token and fetch claims
        fetchSession(sessionToken);
    }, [searchParams]);

    const fetchSession = async (sessionToken: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/registrar/session`, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                }
            });

            if (!response.ok) {
                throw new Error('Session invalid or expired');
            }

            const data = await response.json();
            setClaims(data.claims);

            // Store session token in localStorage
            localStorage.setItem('registrarSessionToken', sessionToken);

            // Move to wallet binding step
            setStatus('wallet');
        } catch (err: any) {
            setError(err.message);
            setStatus('error');
        }
    };

    const connectWallet = async () => {
        try {
            if (typeof window.ethereum === 'undefined') {
                throw new Error('MetaMask is not installed');
            }

            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts found');
            }

            setWalletAddress(accounts[0]);
            await bindWallet(accounts[0]);
        } catch (err: any) {
            setError(err.message);
        }
    };

    const bindWallet = async (address: string) => {
        try {
            const sessionToken = localStorage.getItem('registrarSessionToken');

            const response = await fetch(`${API_BASE_URL}/auth/registrar/bind-wallet`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ walletAddress: address })
            });

            if (!response.ok) {
                throw new Error('Failed to bind wallet');
            }

            const data = await response.json();

            // Update auth context
            setRegistrarSession({
                sessionToken: sessionToken!,
                claims,
                walletAddress: address
            });

            setStatus('success');

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                navigate('/registrar-dashboard');
            }, 2000);

        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <GlassCard className="p-8">
                    {status === 'loading' && (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                                <svg className="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">Verifying Session</h2>
                            <p className="text-text-muted">Please wait...</p>
                        </div>
                    )}

                    {status === 'wallet' && (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-2">Identity Verified!</h2>
                            <p className="text-text-muted mb-6">Welcome, {claims?.name}</p>

                            <div className="bg-surface/50 rounded-lg p-4 mb-6 text-left text-sm">
                                <div className="flex justify-between mb-2">
                                    <span className="text-text-muted">Designation</span>
                                    <span className="text-white font-medium">{claims?.designation}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-muted">Jurisdiction</span>
                                    <span className="text-primary font-medium">{claims?.jurisdiction}</span>
                                </div>
                            </div>

                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                                <p className="text-blue-200 text-sm">
                                    Connect your wallet to receive your <strong>Registrar Role Token</strong> (soulbound NFT) that authorizes you to perform official duties on the blockchain.
                                </p>
                            </div>

                            <Button
                                fullWidth
                                onClick={connectWallet}
                                className="h-12"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Connect MetaMask
                                </span>
                            </Button>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce-gentle">
                                <span className="text-4xl">🎉</span>
                            </div>
                            <h2 className="text-xl font-semibold text-green-400 mb-2">Authorization Complete!</h2>
                            <p className="text-text-muted mb-4">
                                Your Registrar Role Token has been issued.
                            </p>
                            <p className="text-xs text-text-muted font-mono bg-surface/50 p-2 rounded">
                                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                            </p>
                            <p className="text-sm text-text-muted mt-4">Redirecting to dashboard...</p>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-red-400 mb-2">Authentication Failed</h2>
                            <p className="text-text-muted mb-6">{error}</p>
                            <Button onClick={() => navigate('/registrar/login')} variant="outline">
                                Try Again
                            </Button>
                        </div>
                    )}

                    {error && status !== 'error' && (
                        <p className="text-red-400 text-sm text-center mt-4">{error}</p>
                    )}
                </GlassCard>
            </div>
        </div>
    );
};
