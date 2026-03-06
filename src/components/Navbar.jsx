import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../services/firebaseService';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutUser();
            logout();
            setIsMenuOpen(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isActive = (path) => location.pathname === path;

    const handleLinkClick = () => {
        setIsMenuOpen(false); // Close menu when a link is clicked
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand" onClick={handleLinkClick}>
                    <span className="navbar-logo">🏥</span>
                    <span className="navbar-title">HealthCare Hub</span>
                </Link>

                {/* Hamburger Icon for Mobile */}
                <button
                    className="navbar-hamburger"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation menu"
                >
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                    <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
                </button>

                <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/dashboard"
                                className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
                                onClick={handleLinkClick}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/reports/view"
                                className={`navbar-link ${isActive('/reports/view') ? 'active' : ''}`}
                                onClick={handleLinkClick}
                            >
                                My Reports
                            </Link>
                            <Link
                                to="/donors"
                                className={`navbar-link ${isActive('/donors') ? 'active' : ''}`}
                                onClick={handleLinkClick}
                            >
                                Blood Donors
                            </Link>
                            <Link
                                to="/bmi"
                                className={`navbar-link ${isActive('/bmi') ? 'active' : ''}`}
                                onClick={handleLinkClick}
                            >
                                BMI Calculator
                            </Link>
                            <div className="navbar-user">
                                <span className="navbar-username">👤 {user?.name}</span>
                                <button onClick={handleLogout} className="btn btn-secondary navbar-logout">
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/about"
                                className={`navbar-link ${isActive('/about') ? 'active' : ''}`}
                                onClick={handleLinkClick}
                            >
                                About
                            </Link>
                            <Link
                                to="/login"
                                className="btn btn-primary"
                                onClick={handleLinkClick}
                            >
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
