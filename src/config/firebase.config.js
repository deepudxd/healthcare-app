// Firebase Configuration
// Replace these values with your actual Firebase project credentials
// Get them from: Firebase Console > Project Settings > General > Your apps

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your Firebase project configuration
// You can find these values in Firebase Console > Project Settings
const firebaseConfig = {
    apiKey: "AIzaSyC-tsGpEyS2HYI7wgWqI20xCLJay2ZKcAQ",
    authDomain: "health-care-hub-83ad2.firebaseapp.com",
    databaseURL: "https://health-care-hub-83ad2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "health-care-hub-83ad2",
    storageBucket: "health-care-hub-83ad2.firebasestorage.app",
    messagingSenderId: "262932739344",
    appId: "1:262932739344:web:e3a48a659b678920576195"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services (Auth + Database + Storage)
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

// Log initialization status
console.log('🔥 Firebase initialized successfully (Auth + Database + Storage)');

export default app;
