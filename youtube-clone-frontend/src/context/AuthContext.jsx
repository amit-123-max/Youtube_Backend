// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import { useNavigate } from 'react-router-dom';

// 1. Context create karein
const AuthContext = createContext();

// 2. Custom hook for easy access
export const useAuth = () => useContext(AuthContext);

// 3. Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stores logged-in user object
    const [isLoading, setIsLoading] = useState(true); // Tracks initial load status
    const navigate = useNavigate();

    // --- Core Functions ---

    // A. Check current user status on app load
    const checkUser = async () => {
        try {
            // This relies on the browser automatically sending the 'accessToken' cookie
            const currentUser = await fetchFromAPI('users/current-user', 'GET');
            setUser(currentUser);
        } catch (error) {
            // Agar token invalid/expired hai, toh backend error dega.
            // Hum user ko null set kar denge.
            setUser(null);
            console.log("No active session found.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []); // Sirf ek baar run hoga jab component mount hoga

    // B. Login function
    const login = async (loginData) => {
        setIsLoading(true);
        try {
            // Login call (data should contain username/email and password)
            const response = await fetchFromAPI('users/login', 'POST', loginData);
            
            // Backend response se loggedInUser object extract karein
            setUser(response.user); 
            
            // Login ke baad Home page par redirect karein
            navigate('/'); 
            return { success: true, message: 'Login successful' };
        } catch (error) {
            setUser(null);
            console.error(error);
            return { success: false, message: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    // C. Logout function
    const logout = async () => {
        try {
            // Logout call, jisse backend cookies clear karega
            await fetchFromAPI('users/logout', 'POST');
            
            setUser(null);
            // Logout ke baad Login page par redirect karein
            navigate('/login'); 
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

    // --- Context Value ---
    const contextValue = {
        user,
        isAuthenticated: !!user, // boolean flag
        isLoading,
        login,
        logout,
        setUser, // Function to update user details after profile edit
    };

    // D. Return Provider with value
    return (
        <AuthContext.Provider value={contextValue}>
            {/* Jab tak loading ho rahi hai, ek simple loader dikha sakte hain */}
            {isLoading ? 
                <div style={{ color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    Loading Application...
                </div> 
                : children
            }
        </AuthContext.Provider>
    );
};