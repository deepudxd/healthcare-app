import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();

    const quickAccessCards = [
        {
            title: 'Upload Reports',
            description: 'Upload your medical test reports and documents',
            icon: '📤',
            link: '/reports/upload',
            color: 'primary',
        },
        {
            title: 'View Reports',
            description: 'Access all your stored medical reports',
            icon: '📄',
            link: '/reports/view',
            color: 'success',
        },
        {
            title: 'Blood Donor Finder',
            description: 'Find blood donors or register as a donor',
            icon: '🩸',
            link: '/donors',
            color: 'danger',
        },
        {
            title: 'BMI Calculator',
            description: 'Calculate your Body Mass Index',
            icon: '⚖️',
            link: '/bmi',
            color: 'warning',
        },
    ];

    return (
        <div className="page">
            <div className="container">
                <div className="dashboard-header">
                    <h1 className="page-title">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="page-description">
                        Manage your healthcare information all in one place
                    </p>
                </div>

                <div className="alert alert-warning">
                    ⚠️ <strong>Medical Disclaimer:</strong> This website does not provide medical diagnosis or treatment. Always consult with a qualified healthcare professional.
                </div>

                <div className="grid grid-2">
                    {quickAccessCards.map((card, index) => (
                        <Link
                            to={card.link}
                            key={index}
                            className="dashboard-card card"
                            style={{ borderTop: `4px solid var(--${card.color}-color)` }}
                        >
                            <div className="dashboard-card-icon">{card.icon}</div>
                            <h3 className="card-title">{card.title}</h3>
                            <p className="card-content">{card.description}</p>
                            <div className="dashboard-card-arrow">→</div>
                        </Link>
                    ))}
                </div>

                <div className="dashboard-info mt-xl">
                    <div className="card">
                        <h3>Quick Tips for Elder Users:</h3>
                        <ul className="dashboard-tips">
                            <li>✓ All your data is stored securely on your device</li>
                            <li>✓ You can upload medical reports as PDF or images</li>
                            <li>✓ Search for blood donors by blood group and location</li>
                            <li>✓ Use the BMI calculator to track your health</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
