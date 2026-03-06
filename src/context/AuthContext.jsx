import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange } from '../services/firebaseService';
import { database } from '../config/firebase.config';
import { ref, get } from 'firebase/database';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChange(async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    // Fetch user profile data from database
                    const userRef = ref(database, `users/${firebaseUser.uid}`);
                    const snapshot = await get(userRef);

                    if (snapshot.exists()) {
                        setUser({
                            uid: firebaseUser.uid,
                            id: firebaseUser.uid, // For backward compatibility
                            ...snapshot.val()
                        });
                    } else {
                        // Fallback if profile data doesn't exist
                        setUser({
                            uid: firebaseUser.uid,
                            id: firebaseUser.uid,
                            email: firebaseUser.email
                        });
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                    setUser({
                        uid: firebaseUser.uid,
                        id: firebaseUser.uid,
                        email: firebaseUser.email
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const login = (userData) => {
        // Firebase auth state listener will automatically update user
        // This function is mainly for compatibility with existing code
        setUser(userData);
    };

    const logout = async () => {
        // The actual logout is handled in Login/Signup components
        // This is for immediate UI update
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
