import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { saveDonorToFirebase, subscribeToDonors, searchDonorsInFirebase } from '../services/firebaseService';
import './BloodDonors.css';

const BloodDonors = () => {
    const [activeTab, setActiveTab] = useState('search'); // 'search' or 'register'
    const [donors, setDonors] = useState([]);
    const [allDonors, setAllDonors] = useState([]); // Store all donors for filtering
    const [searchFilters, setSearchFilters] = useState({
        bloodGroup: '',
        location: '',
    });
    const [formData, setFormData] = useState({
        name: '',
        bloodGroup: '',
        location: '',
        contact: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    useEffect(() => {
        // Subscribe to real-time donor updates
        const unsubscribe = subscribeToDonors((donorsData) => {
            setAllDonors(donorsData);
            setDonors(donorsData);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const results = await searchDonorsInFirebase(searchFilters);
            setDonors(results);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSearchFilters({ bloodGroup: '', location: '' });
        setDonors(allDonors); // Reset to show all donors
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!formData.name || !formData.bloodGroup || !formData.location || !formData.contact) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.contact.length < 10) {
            setError('Please enter a valid contact number');
            return;
        }

        try {
            setLoading(true);
            // Save donor to Firebase
            await saveDonorToFirebase(formData, user.uid);
            setSuccess('Successfully registered as a donor!');

            // Reset form
            setFormData({
                name: '',
                bloodGroup: '',
                location: '',
                contact: '',
            });

            // Switch to search tab after 2 seconds
            setTimeout(() => {
                setActiveTab('search');
                setSuccess('');
            }, 2000);
        } catch (error) {
            setError(error.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">🩸 Blood Donor Finder</h1>
                    <p className="page-description">
                        Find blood donors in your area or register as a donor to help save lives
                    </p>
                </div>

                <div className="alert alert-info mb-lg">
                    💡 <strong>Help Save Lives:</strong> Register as a blood donor and help those in need. Your blood can save up to 3 lives!
                </div>

                <div className="donor-tabs">
                    <button
                        className={`donor-tab ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        🔍 Search Donors
                    </button>
                    <button
                        className={`donor-tab ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        ➕ Register as Donor
                    </button>
                </div>

                {activeTab === 'search' ? (
                    <div className="donor-search-section">
                        <div className="card mb-lg">
                            <h3>Search for Blood Donors</h3>
                            <form onSubmit={handleSearch} className="donor-search-form">
                                <div className="form-group">
                                    <label htmlFor="searchBloodGroup" className="form-label">
                                        Blood Group
                                    </label>
                                    <select
                                        id="searchBloodGroup"
                                        className="form-select"
                                        value={searchFilters.bloodGroup}
                                        onChange={(e) => setSearchFilters({ ...searchFilters, bloodGroup: e.target.value })}
                                    >
                                        <option value="">All Blood Groups</option>
                                        {bloodGroups.map(group => (
                                            <option key={group} value={group}>{group}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="searchLocation" className="form-label">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        id="searchLocation"
                                        className="form-input"
                                        placeholder="Enter city or area"
                                        value={searchFilters.location}
                                        onChange={(e) => setSearchFilters({ ...searchFilters, location: e.target.value })}
                                    />
                                </div>

                                <div className="donor-search-actions">
                                    <button type="submit" className="btn btn-primary">
                                        🔍 Search
                                    </button>
                                    <button type="button" onClick={handleReset} className="btn btn-secondary">
                                        Reset
                                    </button>
                                </div>
                            </form>
                        </div>

                        {donors.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">🩸</div>
                                <h2 className="empty-state-title">No donors found</h2>
                                <p className="empty-state-description">
                                    Try adjusting your search filters or register as a donor
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-2">
                                {donors.map((donor) => (
                                    <div key={donor.id} className="donor-card card">
                                        <div className="donor-blood-badge">
                                            {donor.bloodGroup}
                                        </div>
                                        <h3 className="donor-name">{donor.name}</h3>
                                        <div className="donor-info">
                                            <p>
                                                <strong>📍 Location:</strong> {donor.location}
                                            </p>
                                            <p>
                                                <strong>📞 Contact:</strong> {donor.contact}
                                            </p>
                                            <p className="donor-date">
                                                Registered: {new Date(donor.registeredDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <a
                                            href={`tel:${donor.contact}`}
                                            className="btn btn-success btn-full mt-sm"
                                        >
                                            📞 Call Donor
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="donor-register-section">
                        <div className="card">
                            <h3>Register as a Blood Donor</h3>

                            {error && (
                                <div className="alert alert-danger mb-md">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success mb-md">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleRegister}>
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-input"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="bloodGroup" className="form-label">
                                        Blood Group *
                                    </label>
                                    <select
                                        id="bloodGroup"
                                        className="form-select"
                                        value={formData.bloodGroup}
                                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                    >
                                        <option value="">Select Blood Group</option>
                                        {bloodGroups.map(group => (
                                            <option key={group} value={group}>{group}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="location" className="form-label">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        id="location"
                                        className="form-input"
                                        placeholder="Enter your city or area"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="contact" className="form-label">
                                        Contact Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="contact"
                                        className="form-input"
                                        placeholder="Enter your contact number"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    />
                                </div>

                                <button type="submit" className="btn btn-danger btn-full">
                                    Register as Donor
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BloodDonors;
