import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cloud, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition">
                        <Cloud className="w-8 h-8" />
                        <span className="font-bold text-xl tracking-tight hidden sm:block">Personal Cloud</span>
                    </Link>
                    
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-sm text-gray-600 font-medium hidden sm:block">
                                    Hello, {user.name}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition px-3 py-2 rounded-md hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm font-medium">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">Log in</Link>
                                <Link to="/register" className="text-sm font-medium bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition shadow-sm">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
