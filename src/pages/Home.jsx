import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: '📄',
            title: 'Medical Report Storage',
            description: 'Securely store and access your medical test reports anytime, anywhere',
        },
        {
            icon: '🩸',
            title: 'Blood Donor Finder',
            description: 'Find blood donors in your area or register to help others in need',
        },
        {
            icon: '⚖️',
            title: 'BMI Calculator',
            description: 'Calculate your Body Mass Index and get personalized health insights',
        },
        {
            icon: '🔒',
            title: 'Secure & Private',
            description: 'Your data is stored locally on your device with complete privacy',
        },
    ];

    return (
        <div className="home-page">
            <div className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            🏥 HealthCare Hub
                        </h1>
                        <p className="hero-description">
                            Your personal healthcare companion to manage medical reports,
                            find blood donors, and track your health - all in one simple,
                            elder-friendly platform.
                        </p>
                        <div className="hero-actions">
                            {isAuthenticated ? (
                                <Link to="/dashboard" className="btn btn-primary btn-large">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/signup" className="btn btn-primary btn-large">
                                        Get Started
                                    </Link>
                                    <Link to="/login" className="btn btn-secondary btn-large">
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="alert-section">
                <div className="container">
                    <div className="alert alert-warning">
                        ⚠️ <strong>Medical Disclaimer:</strong> This website does not provide medical diagnosis or treatment.
                        Always consult with a qualified healthcare professional for medical advice.
                    </div>
                </div>
            </div>

            <div className="features-section">
                <div className="container">
                    <h2 className="section-title">Key Features</h2>
                    <div className="grid grid-2">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3 className="feature-title">{feature.title}</h3>
                                <p className="feature-description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Get Started?</h2>
                        <p>Join HealthCare Hub today and take control of your healthcare information</p>
                        {!isAuthenticated && (
                            <Link to="/signup" className="btn btn-primary btn-large mt-lg">
                                Create Free Account
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
