import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../utils/constants';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { BackgroundGrid } from './ui/BackgroundGrid';
import { BhoomikaChat } from './BhoomikaChat';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, userRole } = useAuth();
    const isLoginPage = location.pathname === '/login';

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <BackgroundGrid />
            {!isLoginPage && (
                <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center">
                                <Link to={userRole === 'registrar' ? '/registrar' : '/dashboard'} className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                                    {APP_NAME}
                                </Link>
                                {userRole && (
                                    <span className="ml-3 px-2 py-0.5 rounded text-xs bg-gray-100 text-text-muted uppercase tracking-wider border border-gray-200">
                                        {userRole}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center space-x-4">
                                {/* Citizen Navigation */}
                                {userRole === 'citizen' && (
                                    <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
                                        <Link
                                            to="/dashboard"
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === '/dashboard' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
                                        >
                                            Home
                                        </Link>
                                        <Link
                                            to="/dashboard"
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname.includes('/property') ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
                                        >
                                            My Properties
                                        </Link>
                                        <Link
                                            to="/documents"
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname === '/documents' ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
                                        >
                                            Documents
                                        </Link>
                                        <Link
                                            to="/transfer"
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${location.pathname.includes('/transfer') ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}
                                        >
                                            Initiate Transfer
                                        </Link>
                                    </div>
                                )}

                                {/* Registrar Navigation */}
                                {userRole === 'registrar' && (
                                    <div className="hidden md:flex items-center space-x-6">
                                        <Link to="/registrar" className="px-3 py-2 rounded-md text-sm font-medium bg-orange-100 text-orange-600">Registrar Console</Link>
                                    </div>
                                )}
                                {user && (
                                    <div className="hidden md:flex items-center gap-3 mr-4">
                                        <img
                                            src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full border border-gray-200"
                                        />
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-medium text-gray-900">{user.displayName}</span>
                                            <span className="text-xs text-text-muted">{user.email}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

                                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            {/* Bhoomika AI Assistant */}
            {user && userRole === 'citizen' && <BhoomikaChat />}

            <footer className="border-t border-orange-200/50 bg-transparent py-6">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-700">
                    <p>&copy; 2024 {APP_NAME}. Decentralized Land Registry.</p>
                </div>
            </footer>
        </div>
    );
};
