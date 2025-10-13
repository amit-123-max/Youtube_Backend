// src/utils/fetchFromAPI.js

import axios from 'axios';

// Backend ka Base URL (Port 8000 aur /api/v1 prefix)
const BASE_URL = 'http://localhost:8000/api/v1';

// Axios Instance Create Karein
const api = axios.create({
    baseURL: BASE_URL,
    // *IMPORTANT:* Yeh line zaroori hai cookies (JWT) send karne ke liye
    withCredentials: true, 
    headers: {
        'Content-Type': 'application/json', // Default to JSON
    },
});

/**
 * Common function for making API calls.
 * * @param {string} url - API ka endpoint (e.g., 'users/login', 'videos/trending')
 * @param {string} method - HTTP method ('GET', 'POST', 'PATCH', 'DELETE')
 * @param {any} data - Request body data (JSON object or FormData)
 */
export const fetchFromAPI = async (url, method = 'GET', data = null) => {
    // Agar data FormData hai (File Upload), toh Content-Type header ko 'unset' karein
    // Taki browser automatic boundary set kar sakein
    let headers = {};
    if (data instanceof FormData) {
        // Yeh browser ko bata deta hai ki Content-Type: multipart/form-data hai
        // Aur boundary automatically set ho jati hai
        headers['Content-Type'] = 'multipart/form-data'; 
    }
    
    try {
        const response = await api.request({
            url,
            method,
            data,
            headers,
        });

        // Backend se humein { data, message, statusCode, success } milta hai
        // Hum sirf asli 'data' object return karenge
        return response.data.data; 

    } catch (error) {
        // Error handling: Agar ApiError aaya hai toh uska message show karein
        const errorMessage = error.response?.data?.message || 'An unknown API error occurred';
        console.error(`API Error on ${method} ${url}:`, errorMessage, error);
        
        // Error ko throw karein taki calling component use handle kar sakein
        throw new Error(errorMessage);
    }
};

// Example utility for GET requests (optional shorthand)
export const fetchGet = (url) => fetchFromAPI(url, 'GET');