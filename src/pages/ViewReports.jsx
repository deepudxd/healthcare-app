import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { subscribeToUserReports, deleteReportFromFirebase } from '../services/firebaseService';
import { downloadFile } from '../services/supabaseStorageService';
import './Reports.css';

const ViewReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        // Subscribe to real-time updates
        const unsubscribe = subscribeToUserReports(user.uid, (reportsData) => {
            setReports(reportsData);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [user]);

    const handleView = (report) => {
        // Show the report inside the app instead of opening an external browser
        setSelectedReport(report);
    };

    const handleCloseViewer = () => {
        setSelectedReport(null);
    };

    const handleDownload = async (report) => {
        try {
            setDownloadingId(report.id);
            // Use improved download function with mobile support
            await downloadFile(report.fileUrl, report.fileName);
            setDownloadingId(null);
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download file. Please try again.');
            setDownloadingId(null);
        }
    };

    const handleDelete = async (report) => {
        if (window.confirm('Are you sure you want to delete this report?')) {
            try {
                setLoading(true);
                await deleteReportFromFirebase(report.id, user.uid, report.filePath);
                // Real-time listener will automatically update the reports list
            } catch (error) {
                console.error('Delete error:', error);
                alert('Failed to delete report. Please try again.');
                setLoading(false);
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <div className="page-header-content">
                        <div>
                            <h1 className="page-title">My Medical Reports</h1>
                            <p className="page-description">
                                View, download, and manage your uploaded medical reports
                            </p>
                        </div>
                        {reports.length > 0 && (
                            <Link to="/reports/upload" className="btn btn-primary btn-upload-more">
                                ➕ Upload More
                            </Link>
                        )}
                    </div>
                </div>

                {reports.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📄</div>
                        <h2 className="empty-state-title">No reports uploaded yet</h2>
                        <p className="empty-state-description">
                            Upload your first medical report to get started
                        </p>
                        <a href="/reports/upload" className="btn btn-primary mt-md">
                            Upload Report
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-2">
                        {reports.map((report) => (
                            <div key={report.id} className="report-card card">
                                <div className="report-icon">
                                    {report.fileType.startsWith('image/') ? '🖼️' : '📄'}
                                </div>
                                <h3 className="report-title">{report.reportName}</h3>
                                <div className="report-details">
                                    <p>
                                        <strong>Test Date:</strong> {formatDate(report.testDate)}
                                    </p>
                                    <p>
                                        <strong>Lab/Hospital:</strong> {report.labName}
                                    </p>
                                    <p>
                                        <strong>Uploaded:</strong> {formatDate(report.uploadDate)}
                                    </p>
                                    <p>
                                        <strong>File:</strong> {report.fileName}
                                    </p>
                                </div>
                                <div className="report-actions">
                                    <button
                                        onClick={() => handleView(report)}
                                        className="btn btn-primary"
                                    >
                                        👁️ View
                                    </button>
                                    <button
                                        onClick={() => handleDownload(report)}
                                        className="btn btn-success"
                                        disabled={downloadingId === report.id}
                                    >
                                        {downloadingId === report.id ? '⏬ Downloading...' : '⬇️ Download'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(report)}
                                        className="btn btn-danger"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {selectedReport && (
                    <div className="report-viewer-overlay" onClick={handleCloseViewer}>
                        <div className="report-viewer" onClick={(e) => e.stopPropagation()}>
                            <div className="report-viewer-header">
                                <h2 className="report-viewer-title">
                                    {selectedReport.reportName || 'Report Preview'}
                                </h2>
                                <button
                                    type="button"
                                    className="btn btn-danger report-viewer-close"
                                    onClick={handleCloseViewer}
                                >
                                    ✖ Close
                                </button>
                            </div>
                            <div className="report-viewer-body">
                                {selectedReport.fileType?.startsWith('image/') ? (
                                    <img
                                        src={selectedReport.fileUrl}
                                        alt={selectedReport.fileName || 'Report'}
                                        className="report-viewer-media"
                                    />
                                ) : selectedReport.fileType === 'application/pdf' ||
                                  selectedReport.fileName?.toLowerCase().endsWith('.pdf') ? (
                                    <iframe
                                        // Use Google Docs viewer to improve PDF rendering support,
                                        // especially inside mobile webviews / Android WebView
                                        src={`https://docs.google.com/gview?url=${encodeURIComponent(
                                            selectedReport.fileUrl
                                        )}&embedded=true`}
                                        title={selectedReport.fileName || 'Report'}
                                        className="report-viewer-media"
                                    />
                                ) : (
                                    <iframe
                                        src={selectedReport.fileUrl}
                                        title={selectedReport.fileName || 'Report'}
                                        className="report-viewer-media"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewReports;
