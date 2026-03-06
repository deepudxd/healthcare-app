// Firebase Service Layer
// Centralized module for all Firebase operations

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import {
    ref as dbRef,
    set,
    get,
    remove,
    query,
    orderByChild,
    equalTo,
    onValue,
    off
} from 'firebase/database';
import { auth, database } from '../config/firebase.config';
import { 
    uploadFileToSupabase, 
    deleteFileFromSupabase 
} from './supabaseStorageService';

// ==================== AUTHENTICATION ====================

/**
 * Sign up a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {object} profileData - Additional profile data (name, age, gender)
 * @returns {Promise<object>} User object with uid and profile data
 */
export const signUpUser = async (email, password, profileData) => {
    try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save additional profile data to Realtime Database
        const userRef = dbRef(database, `users/${user.uid}`);
        await set(userRef, {
            email: email,
            name: profileData.name,
            age: profileData.age,
            gender: profileData.gender,
            createdAt: new Date().toISOString()
        });

        return {
            uid: user.uid,
            email: user.email,
            ...profileData
        };
    } catch (error) {
        console.error('Signup error:', error);
        throw handleFirebaseError(error);
    }
};

/**
 * Login user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} User object with profile data
 */
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user profile data from database
        const userRef = dbRef(database, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            return {
                uid: user.uid,
                ...snapshot.val()
            };
        }

        return {
            uid: user.uid,
            email: user.email
        };
    } catch (error) {
        console.error('Login error:', error);
        throw handleFirebaseError(error);
    }
};

/**
 * Logout current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Logout error:', error);
        throw handleFirebaseError(error);
    }
};

/**
 * Get currently authenticated user
 * @returns {object|null} Current user or null
 */
export const getCurrentAuthUser = () => {
    return auth.currentUser;
};

/**
 * Listen to auth state changes
 * @param {function} callback - Callback function to handle auth state changes
 * @returns {function} Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};

// ==================== FILE STORAGE (SUPABASE STORAGE) ====================

/**
 * Upload file to Supabase Storage with progress tracking
 * @param {File} file - File to upload  
 * @param {string} userId - User ID (for organization)
 * @param {string} reportId - Report ID (for organization)
 * @param {function} onProgress - Progress callback (percentage)
 * @returns {Promise<object>} Object with downloadURL and storagePath
 */
export const uploadFileToStorage = async (file, userId, reportId, onProgress) => {
    try {
        const result = await uploadFileToSupabase(file, userId, reportId, onProgress);
        return {
            downloadURL: result.downloadURL,
            storagePath: result.storagePath
        };
    } catch (error) {
        console.error('Supabase Storage upload error:', error);
        throw new Error('Failed to upload file. Please try again.');
    }
};

/**
 * Delete file from Supabase Storage
 * @param {string} storagePath - Storage path of the file
 * @returns {Promise<void>}
 */
export const deleteFileFromStorage = async (storagePath) => {
    try {
        await deleteFileFromSupabase(storagePath);
    } catch (error) {
        console.error('Supabase Storage delete error:', error);
        // Don't throw error - continue with database deletion
    }
};

// ==================== MEDICAL REPORTS ====================

/**
 * Save medical report to Firebase (uploads file + saves metadata)
 * @param {object} reportData - Report metadata
 * @param {File} file - Report file
 * @param {string} userId - User ID
 * @param {function} onProgress - Upload progress callback
 * @returns {Promise<object>} Saved report object
 */
export const saveReportToFirebase = async (reportData, file, userId, onProgress) => {
    try {
        const reportId = Date.now().toString();

        // Upload file to Supabase Storage
        const { downloadURL, storagePath } = await uploadFileToStorage(
            file,
            userId,
            reportId,
            onProgress
        );

        // Save metadata to Realtime Database
        const reportRef = dbRef(database, `reports/${userId}/${reportId}`);
        const reportMetadata = {
            reportName: reportData.reportName,
            testDate: reportData.testDate,
            labName: reportData.labName,
            fileName: file.name,
            fileType: file.type,
            fileUrl: downloadURL,        // Supabase Storage public URL
            filePath: storagePath,        // Supabase Storage path
            uploadDate: new Date().toISOString()
        };

        await set(reportRef, reportMetadata);

        return {
            id: reportId,
            ...reportMetadata
        };
    } catch (error) {
        console.error('Save report error:', error);
        throw handleFirebaseError(error);
    }
};

/**
 * Get all medical reports for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of report objects
 */
export const getUserReportsFromFirebase = async (userId) => {
    try {
        const reportsRef = dbRef(database, `reports/${userId}`);
        const snapshot = await get(reportsRef);

        if (!snapshot.exists()) {
            return [];
        }

        const reportsData = snapshot.val();
        return Object.keys(reportsData).map(id => ({
            id,
            ...reportsData[id]
        }));
    } catch (error) {
        console.error('Get reports error:', error);
        throw handleFirebaseError(error);
    }
};

/**
 * Delete a medical report (removes both file and metadata)
 * @param {string} reportId - Report ID
 * @param {string} userId - User ID
 * @param {string} filePath - Storage path of the file
 * @returns {Promise<void>}
 */
export const deleteReportFromFirebase = async (reportId, userId, filePath) => {
    try {
        // Delete file from Storage
        if (filePath) {
            await deleteFileFromStorage(filePath);
        }

        // Delete metadata from Database
        const reportRef = dbRef(database, `reports/${userId}/${reportId}`);
        await remove(reportRef);
    } catch (error) {
        console.error('Delete report error:', error);
        throw handleFirebaseError(error);
    }
};

/**
 * Listen to real-time updates for user reports
 * @param {string} userId - User ID
 * @param {function} callback - Callback with updated reports array
 * @returns {function} Unsubscribe function
 */
export const subscribeToUserReports = (userId, callback) => {
    const reportsRef = dbRef(database, `reports/${userId}`);

    const listener = onValue(reportsRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback([]);
            return;
        }

        const reportsData = snapshot.val();
        const reports = Object.keys(reportsData).map(id => ({
            id,
            ...reportsData[id]
        }));
        callback(reports);
    });

    // Return unsubscribe function
    return () => off(reportsRef, 'value', listener);
};

// ==================== BLOOD DONORS ====================

/**
 * Register a new blood donor
 * @param {object} donorData - Donor information
 * @param {string} userId - User ID
 * @returns {Promise<object>} Saved donor object
 */
export const saveDonorToFirebase = async (donorData, userId) => {
    try {
        const donorId = Date.now().toString();
        const donorRef = dbRef(database, `donors/${donorId}`);

        const donor = {
            userId,
            name: donorData.name,
            bloodGroup: donorData.bloodGroup,
            location: donorData.location,
            contact: donorData.contact,
            registeredDate: new Date().toISOString()
        };

        await set(donorRef, donor);

        return {
            id: donorId,
            ...donor
        };
    } catch (error) {
        console.error('Save donor error:', error);
        throw handleFirebaseError(error);
    }
};

/**
 * Get all blood donors
 * @returns {Promise<Array>} Array of donor objects
 */
export const getAllDonorsFromFirebase = async () => {
    try {
        const donorsRef = dbRef(database, 'donors');
        const snapshot = await get(donorsRef);

        if (!snapshot.exists()) {
            return [];
        }

        const donorsData = snapshot.val();
        return Object.keys(donorsData).map(id => ({
            id,
            ...donorsData[id]
        }));
    } catch (error) {
        console.error('Get donors error:', error);
        throw handleFirebaseError(error);
    }
};

/**
 * Search blood donors by filters
 * @param {object} filters - Search filters (bloodGroup, location)
 * @returns {Promise<Array>} Array of filtered donor objects
 */
export const searchDonorsInFirebase = async (filters) => {
    try {
        const { bloodGroup, location } = filters;
        let donors = await getAllDonorsFromFirebase();

        // Filter by blood group
        if (bloodGroup) {
            donors = donors.filter(donor =>
                donor.bloodGroup.toLowerCase() === bloodGroup.toLowerCase()
            );
        }

        // Filter by location
        if (location) {
            donors = donors.filter(donor =>
                donor.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        return donors;
    } catch (error) {
        console.error('Search donors error:', error);
        throw handleFirebaseError(error);
    }
};

/**
 * Listen to real-time updates for all donors
 * @param {function} callback - Callback with updated donors array
 * @returns {function} Unsubscribe function
 */
export const subscribeToDonors = (callback) => {
    const donorsRef = dbRef(database, 'donors');

    const listener = onValue(donorsRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback([]);
            return;
        }

        const donorsData = snapshot.val();
        const donors = Object.keys(donorsData).map(id => ({
            id,
            ...donorsData[id]
        }));
        callback(donors);
    });

    // Return unsubscribe function
    return () => off(donorsRef, 'value', listener);
};

// ==================== ERROR HANDLING ====================

/**
 * Convert Firebase errors to user-friendly messages
 * @param {Error} error - Firebase error object
 * @returns {Error} Error with user-friendly message
 */
const handleFirebaseError = (error) => {
    let message = 'An error occurred. Please try again.';

    switch (error.code) {
        // Auth errors
        case 'auth/email-already-in-use':
            message = 'This email is already registered. Please login instead.';
            break;
        case 'auth/invalid-email':
            message = 'Invalid email address.';
            break;
        case 'auth/weak-password':
            message = 'Password should be at least 6 characters.';
            break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            message = 'Invalid email or password.';
            break;
        case 'auth/too-many-requests':
            message = 'Too many failed attempts. Please try again later.';
            break;
        case 'auth/network-request-failed':
            message = 'Network error. Please check your internet connection.';
            break;

        // Storage errors
        case 'storage/unauthorized':
            message = 'You do not have permission to upload files.';
            break;
        case 'storage/canceled':
            message = 'Upload was cancelled.';
            break;
        case 'storage/quota-exceeded':
            message = 'Storage quota exceeded. Please contact support.';
            break;

        // Database errors
        case 'permission-denied':
            message = 'You do not have permission to perform this action.';
            break;

        default:
            message = error.message || message;
    }

    const customError = new Error(message);
    customError.code = error.code;
    return customError;
};
