import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const RegistrarLogin: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { setRegistrarSession } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Check for error from OIDC callback
    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(decodeURIComponent(errorParam));
        }
    }, [searchParams]);

    const handleLogin = () => {
        setLoading(true);
        // Redirect to backend OIDC endpoint
        window.location.href = `${API_BASE_URL}/auth/registrar/login`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <GlassCard className="p-8">
                    <div className="text-center mb-8">
                        {/* Government Logo Placeholder */}
                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-full flex items-center justify-center border border-amber-500/30">
                            <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2">Registrar Portal</h1>
                        <p className="text-text-muted text-sm">
                            Government officials authenticate via e-Pramaan SSO
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-sm">
                            <p className="text-amber-200 mb-2 font-medium">🔒 Secure Government Login</p>
                            <p className="text-amber-200/70 text-xs">
                                You will be redirected to the official government authentication portal.
                                Only authorized Sub-Registrars and Revenue Department officials can access this system.
                            </p>
                        </div>

                        <Button
                            fullWidth
                            size="lg"
                            onClick={handleLogin}
                            disabled={loading}
                            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 h-14"
                        >
                            <span className="flex items-center justify-center gap-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                {loading ? 'Redirecting...' : 'Login with e-Pramaan'}
                            </span>
                        </Button>

                        <p className="text-xs text-text-muted text-center mt-4">
                            Using Auth0 as development placeholder for e-Pramaan
                        </p>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <p className="text-sm text-text-muted">
                            Are you a citizen?{' '}
                            <button
                                onClick={() => navigate('/login')}
                                className="text-primary hover:underline"
                            >
                                Login here
                            </button>
                        </p>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};
