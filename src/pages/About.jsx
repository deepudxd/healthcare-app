import React from 'react';
import './InfoPages.css';

const About = () => {
    return (
        <div className="page">
            <div className="container">
                <div className="info-page-content">
                    <h1 className="page-title">About HealthCare Hub</h1>

                    <div className="card">
                        <h2>Our Mission</h2>
                        <p>
                            HealthCare Hub is designed to help individuals, especially elderly users,
                            manage their healthcare information in a simple, secure, and accessible manner.
                            We believe that everyone should have easy access to their medical records and
                            health tools.
                        </p>
                    </div>

                    <div className="card">
                        <h2>What We Offer</h2>
                        <ul className="info-list">
                            <li>
                                <strong>Medical Report Storage:</strong> Safely store your medical test reports,
                                lab results, and prescriptions. Access them anytime you need.
                            </li>
                            <li>
                                <strong>Blood Donor Network:</strong> Connect blood donors with those in need.
                                Register as a donor or search for donors in your area.
                            </li>
                            <li>
                                <strong>BMI Calculator:</strong> Monitor your health by calculating your Body Mass Index
                                and receiving personalized health recommendations.
                            </li>
                            <li>
                                <strong>Privacy First:</strong> All your data is stored locally on your device.
                                We don't collect or share your personal information.
                            </li>
                        </ul>
                    </div>

                    <div className="card">
                        <h2>Elder-Friendly Design</h2>
                        <p>
                            Our application is specifically designed with elderly users in mind:
                        </p>
                        <ul className="info-list">
                            <li>Large, readable fonts for better visibility</li>
                            <li>High contrast colors for easier reading</li>
                            <li>Simple navigation with clear labels</li>
                            <li>Large buttons for easy clicking</li>
                            <li>Minimal complexity for straightforward use</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h2>Educational Purpose</h2>
                        <p>
                            HealthCare Hub is a portfolio project created to demonstrate modern web development
                            practices using React. It showcases:
                        </p>
                        <ul className="info-list">
                            <li>React functional components and hooks</li>
                            <li>React Router for navigation</li>
                            <li>LocalStorage for data persistence</li>
                            <li>Responsive design principles</li>
                            <li>Accessible user interface design</li>
                        </ul>
                    </div>

                    <div className="alert alert-info">
                        <strong>Important:</strong> This is a demonstration project. For actual medical needs,
                        always consult with qualified healthcare professionals.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
