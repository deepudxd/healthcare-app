import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { saveReportToFirebase } from '../services/firebaseService';
import './Reports.css';

const UploadReport = () => {
    const [formData, setFormData] = useState({
        reportName: '',
        testDate: '',
        labName: '',
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { user } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
        setSuccess('');
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setError('');
        setSuccess('');

        if (!selectedFile) {
            setFile(null);
            return;
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(selectedFile.type)) {
            setError('Please upload a PDF or image file (JPG, PNG)');
            setFile(null);
            return;
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024;
        if (selectedFile.size > maxSize) {
            setError('File size must be less than 10MB');
            setFile(null);
            return;
        }

        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        setUploadProgress(0);

        // Validation
        if (!formData.reportName || !formData.testDate || !formData.labName) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }

        if (!file) {
            setError('Please select a file to upload');
            setLoading(false);
            return;
        }

        try {
            // Save report to Firebase (uploads file to Storage and saves metadata to Database)
            await saveReportToFirebase(
                formData,
                file,
                user.uid,
                (progress) => setUploadProgress(Math.round(progress))
            );

            setSuccess('Report uploaded successfully!');

            // Reset form
            setFormData({
                reportName: '',
                testDate: '',
                labName: '',
            });
            setFile(null);
            setUploadProgress(0);

            // Navigate to view reports after 2 seconds
            setTimeout(() => {
                navigate('/reports/view');
            }, 2000);
        } catch (error) {
            setError(error.message || 'Failed to upload report. Please try again.');
            console.error('Upload error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">Upload Medical Report</h1>
                    <p className="page-description">
                        Upload your medical test reports and store them securely
                    </p>
                </div>

                <div className="report-upload-container">
                    <div className="card">
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

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="reportName" className="form-label">
                                    Report Name *
                                </label>
                                <input
                                    type="text"
                                    id="reportName"
                                    name="reportName"
                                    className="form-input"
                                    placeholder="e.g., Blood Test, X-Ray Report"
                                    value={formData.reportName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="testDate" className="form-label">
                                    Test Date *
                                </label>
                                <input
                                    type="date"
                                    id="testDate"
                                    name="testDate"
                                    className="form-input"
                                    value={formData.testDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="labName" className="form-label">
                                    Lab/Hospital Name *
                                </label>
                                <input
                                    type="text"
                                    id="labName"
                                    name="labName"
                                    className="form-input"
                                    placeholder="e.g., City Hospital, ABC Labs"
                                    value={formData.labName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="file" className="form-label">
                                    📎 Upload File (PDF or Image) *
                                </label>
                                <div className="file-upload-wrapper">
                                    <input
                                        type="file"
                                        id="file"
                                        name="file"
                                        className="form-input file-input"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                    />
                                    <label htmlFor="file" className="file-upload-label">
                                        {file ? `📄 ${file.name}` : '📎 Choose File'}
                                    </label>
                                </div>
                                {file && (
                                    <div className="file-info mt-sm">
                                        <p>
                                            <strong>Selected:</strong> {file.name}
                                        </p>
                                        <p>
                                            <strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                        <p>
                                            <strong>Type:</strong> {file.type || 'Unknown'}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {loading && uploadProgress > 0 && (
                                <div className="upload-progress mt-sm">
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="progress-text">{uploadProgress}% uploaded</p>
                                </div>
                            )}

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="btn btn-primary btn-full"
                                    disabled={loading}
                                >
                                    {loading ? `⏫ Uploading... ${uploadProgress > 0 ? `${uploadProgress}%` : ''}` : '📤 Upload Report'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="card mt-lg">
                        <h3>📋 Important Information:</h3>
                        <ul className="info-list">
                            <li>Accepted file formats: PDF, JPG, PNG</li>
                            <li>Maximum file size: 10MB</li>
                            <li>Your files are stored securely in Firebase Storage</li>
                            <li>Only you can access your uploaded reports</li>
                            <li>Files are automatically organized by date</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploadReport;
