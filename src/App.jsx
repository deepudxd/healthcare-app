import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import UploadReport from './pages/UploadReport';
import ViewReports from './pages/ViewReports';
import BloodDonors from './pages/BloodDonors';
import BMICalculator from './pages/BMICalculator';
import About from './pages/About';
import Disclaimer from './pages/Disclaimer';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/disclaimer" element={<Disclaimer />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/upload"
              element={
                <ProtectedRoute>
                  <UploadReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports/view"
              element={
                <ProtectedRoute>
                  <ViewReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/donors"
              element={
                <ProtectedRoute>
                  <BloodDonors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bmi"
              element={
                <ProtectedRoute>
                  <BMICalculator />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
