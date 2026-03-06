import React from 'react';
import './InfoPages.css';

const Disclaimer = () => {
    return (
        <div className="page">
            <div className="container">
                <div className="info-page-content">
                    <h1 className="page-title">Medical Disclaimer & Privacy Policy</h1>

                    <div className="alert alert-danger">
                        <strong>⚠️ IMPORTANT MEDICAL DISCLAIMER</strong>
                    </div>

                    <div className="card">
                        <h2>Medical Information Disclaimer</h2>
                        <p>
                            HealthCare Hub is <strong>NOT</strong> a medical service and does <strong>NOT</strong> provide:
                        </p>
                        <ul className="disclaimer-list">
                            <li>Medical diagnosis</li>
                            <li>Medical treatment or advice</li>
                            <li>Professional healthcare services</li>
                            <li>Emergency medical assistance</li>
                            <li>Prescription or medication recommendations</li>
                        </ul>
                        <p>
                            <strong>The information provided by this application is for general informational
                                purposes only.</strong> It is not intended as a substitute for professional medical
                            advice, diagnosis, or treatment.
                        </p>
                    </div>

                    <div className="card">
                        <h2>Always Consult Healthcare Professionals</h2>
                        <p>
                            <strong>Always seek the advice of your physician or other qualified health provider</strong> with
                            any questions you may have regarding:
                        </p>
                        <ul className="disclaimer-list">
                            <li>A medical condition</li>
                            <li>Health concerns</li>
                            <li>Treatment options</li>
                            <li>Medication or prescriptions</li>
                            <li>BMI results and health status</li>
                        </ul>
                        <p>
                            <strong>Never disregard professional medical advice or delay in seeking it</strong> because
                            of something you have read or calculated on this application.
                        </p>
                    </div>

                    <div className="card">
                        <h2>Emergency Situations</h2>
                        <p className="alert alert-danger">
                            <strong>If you think you may have a medical emergency, call your doctor or emergency
                                services (911 or your local emergency number) immediately.</strong>
                        </p>
                        <p>
                            This application is not designed for emergency situations and should never be used
                            as a replacement for emergency medical services.
                        </p>
                    </div>

                    <div className="card">
                        <h2>Data Storage & Privacy</h2>
                        <h3>Local Storage</h3>
                        <p>
                            All data you enter into HealthCare Hub is stored <strong>locally on your device</strong>
                            using browser localStorage. This means:
                        </p>
                        <ul className="info-list">
                            <li>Your data never leaves your device</li>
                            <li>We do not have access to your information</li>
                            <li>No data is transmitted to any servers</li>
                            <li>Your privacy is completely protected</li>
                        </ul>

                        <h3>Data Responsibility</h3>
                        <p>
                            You are responsible for:
                        </p>
                        <ul className="info-list">
                            <li>Backing up your own data if needed</li>
                            <li>Keeping your device secure</li>
                            <li>Managing browser data/cache clearing (which may delete your stored information)</li>
                            <li>Ensuring the accuracy of information you enter</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h2>User-Specific Data Access</h2>
                        <p>
                            Each user account has access only to their own data:
                        </p>
                        <ul className="info-list">
                            <li>Medical reports you upload are visible only to you</li>
                            <li>Your BMI calculations are private</li>
                            <li>Blood donor information is shared publicly to help connect donors with recipients</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h2>No Medical Prescription Display</h2>
                        <p>
                            In compliance with medical safety guidelines:
                        </p>
                        <ul className="disclaimer-list">
                            <li>We do not display medicine names</li>
                            <li>We do not show prescription details</li>
                            <li>We do not provide medication dosage information</li>
                        </ul>
                        <p>
                            This application is strictly for storing and organizing your medical documents,
                            not for providing medical guidance.
                        </p>
                    </div>

                    <div className="card">
                        <h2>BMI Calculator Limitations</h2>
                        <p>
                            The BMI calculator provided is a general screening tool and has limitations:
                        </p>
                        <ul className="disclaimer-list">
                            <li>May not be accurate for athletes with high muscle mass</li>
                            <li>May not be suitable for pregnant women</li>
                            <li>May not be appropriate for elderly individuals</li>
                            <li>Does not account for individual health conditions</li>
                            <li>Should not be used as the sole indicator of health</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h2>Limitation of Liability</h2>
                        <p>
                            HealthCare Hub and its creators assume <strong>no liability</strong> for:
                        </p>
                        <ul className="disclaimer-list">
                            <li>Accuracy of information you input</li>
                            <li>Any health decisions you make based on this application</li>
                            <li>Data loss due to browser cache clearing or device issues</li>
                            <li>Any direct or indirect consequences of using this application</li>
                        </ul>
                    </div>

                    <div className="card">
                        <h2>Project Purpose</h2>
                        <p>
                            HealthCare Hub is a <strong>portfolio/educational project</strong> created to demonstrate
                            web development skills. It is not a commercial medical application and should be used
                            accordingly.
                        </p>
                    </div>

                    <div className="alert alert-warning">
                        <strong>By using HealthCare Hub, you acknowledge that you have read, understood, and
                            agree to this disclaimer and privacy policy.</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Disclaimer;
