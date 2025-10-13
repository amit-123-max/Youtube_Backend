// src/pages/Settings.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Container, Alert, Paper, CircularProgress, Stack, Avatar } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const { user, isAuthenticated, isLoading: authLoading, setUser } = useAuth();
    const navigate = useNavigate();

    // 1. Initial State (Pre-populate from Auth Context)
    const [detailsForm, setDetailsForm] = useState({
        fullName: user?.fullName || '',
        email: user?.email || ''
    });

    // 2. File States
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverImageFile, setCoverImageFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Redirect logic
    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate]);

    if (!isAuthenticated || authLoading) return null; // Wait for auth check

    // Helper function to clear status messages
    const clearStatus = () => {
        setError('');
        setMessage('');
    }

    // --- A. Update Account Details Handler ---
    const handleDetailsChange = (e) => {
        setDetailsForm({ ...detailsForm, [e.target.name]: e.target.value });
    };

    const handleDetailsSubmit = async (e) => {
        e.preventDefault();
        clearStatus();

        if (!detailsForm.fullName.trim() || !detailsForm.email.trim()) {
            setError("Full Name and Email are required.");
            return;
        }

        setLoading(true);
        try {
            // Backend Route: PATCH /users/update-account (Simple JSON)
            const updatedUser = await fetchFromAPI('users/update-account', 'PATCH', detailsForm);
            
            // Update Auth Context state
            setUser(updatedUser); 
            setMessage("Account details updated successfully!");

        } catch (err) {
            setError(err.message || "Failed to update details.");
        } finally {
            setLoading(false);
        }
    };

    // --- B. Update Avatar Handler (Uses FormData) ---
    const handleAvatarSubmit = async (e) => {
        e.preventDefault();
        clearStatus();

        if (!avatarFile) {
            setError("Please select a new avatar file.");
            return;
        }

        const formData = new FormData();
        formData.append('avatar', avatarFile); // Key must be 'avatar'
        
        setLoading(true);
        try {
            // Backend Route: PATCH /users/avatar (FormData)
            const updatedUser = await fetchFromAPI('users/avatar', 'PATCH', formData);
            
            // Update Auth Context state
            setUser(updatedUser); 
            setMessage("Avatar updated successfully!");
            setAvatarFile(null); // Clear file input view

        } catch (err) {
            setError(err.message || "Failed to update avatar.");
        } finally {
            setLoading(false);
        }
    };
    
    // --- C. Update Cover Image Handler (Uses FormData) ---
    const handleCoverImageSubmit = async (e) => {
        e.preventDefault();
        clearStatus();

        if (!coverImageFile) {
            setError("Please select a new cover image file.");
            return;
        }

        const formData = new FormData();
        formData.append('coverImage', coverImageFile); // Key must be 'coverImage'
        
        setLoading(true);
        try {
            // Backend Route: PATCH /users/cover-image (FormData)
            const updatedUser = await fetchFromAPI('users/cover-image', 'PATCH', formData);
            
            // Update Auth Context state
            setUser(updatedUser); 
            setMessage("Cover image updated successfully!");
            setCoverImageFile(null); // Clear file input view

        } catch (err) {
            setError(err.message || "Failed to update cover image.");
        } finally {
            setLoading(false);
        }
    };
    
    // --- Render Component ---
    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: 2 }}>
                <Typography variant="h4" color="white" gutterBottom>
                    Account Settings
                </Typography>
                <Typography variant="subtitle1" color="#aaa" mb={3}>
                    @{user.username}
                </Typography>

                {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress color="error" /></Box>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

                <Stack spacing={4}>
                    
                    {/* 1. Update Details Form */}
                    <Box component="form" onSubmit={handleDetailsSubmit} sx={{ p: 3, border: '1px solid #3d3d3d', borderRadius: 1 }}>
                        <Typography variant="h6" color="white" mb={2}>Update Details</Typography>
                        <TextField
                            name="fullName"
                            label="Full Name"
                            value={detailsForm.fullName}
                            onChange={handleDetailsChange}
                            required
                            fullWidth
                            sx={{ mb: 2, input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
                        />
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            value={detailsForm.email}
                            onChange={handleDetailsChange}
                            required
                            fullWidth
                            sx={{ mb: 2, input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
                        />
                        <Button type="submit" variant="contained" color="error" disabled={loading}>
                            Save Details
                        </Button>
                    </Box>

                    {/* 2. Update Avatar Form */}
                    <Box component="form" onSubmit={handleAvatarSubmit} sx={{ p: 3, border: '1px solid #3d3d3d', borderRadius: 1 }}>
                        <Typography variant="h6" color="white" mb={2}>Update Avatar</Typography>
                        <Stack direction="row" spacing={3} alignItems="center" mb={3}>
                            <Avatar src={user.avatar} sx={{ width: 80, height: 80 }} />
                            <input
                                type="file"
                                name="avatar"
                                accept="image/*"
                                onChange={(e) => setAvatarFile(e.target.files[0])}
                                style={{ color: 'white' }}
                            />
                        </Stack>
                        <Button type="submit" variant="contained" color="error" disabled={loading || !avatarFile}>
                            Update Avatar
                        </Button>
                    </Box>

                    {/* 3. Update Cover Image Form */}
                    <Box component="form" onSubmit={handleCoverImageSubmit} sx={{ p: 3, border: '1px solid #3d3d3d', borderRadius: 1 }}>
                        <Typography variant="h6" color="white" mb={2}>Update Cover Image</Typography>
                        <Box mb={2} sx={{ height: '150px', background: 'gray', backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover' }} />
                        <input
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            onChange={(e) => setCoverImageFile(e.target.files[0])}
                            style={{ color: 'white' }}
                        />
                        <Button type="submit" variant="contained" color="error" disabled={loading || !coverImageFile} sx={{ mt: 2 }}>
                            Update Cover
                        </Button>
                    </Box>
                </Stack>
            </Paper>
        </Container>
    );
};

export default Settings;