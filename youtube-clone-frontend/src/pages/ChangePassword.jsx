// src/pages/ChangePassword.jsx

import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Container, Alert, Paper, CircularProgress, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Redirect if not logged in
    if (!isAuthenticated && !authLoading) {
        navigate('/login');
        return null;
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // 1. Client-side Validation
        if (form.newPassword !== form.confirmPassword) {
            setError("New password and Confirm password do not match.");
            return;
        }
        if (form.newPassword.length < 6) { // Basic length check
            setError("New password must be at least 6 characters long.");
            return;
        }
        
        // 2. Data to be sent
        const dataToSend = {
            oldPassword: form.oldPassword,
            newPassword: form.newPassword
        };

        setLoading(true);
        try {
            // Backend Route: POST /users/change-password (Protected route)
            await fetchFromAPI('users/change-password', 'POST', dataToSend);

            setMessage("Password updated successfully! For security, please login again.");
            
            // 3. Security Step: Force Logout
            // Password change ke baad user ko log out kar dena best security practice hai.
            setTimeout(() => {
                logout(); 
            }, 2000);

        } catch (err) {
            // Backend error aayega agar old password galat hai
            setError(err.message || "Password change failed. Check your old password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: 2 }}>
                <Typography variant="h4" color="white" align="center" gutterBottom>
                    Change Password
                </Typography>

                {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress color="error" /></Box>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    
                    {/* Old Password */}
                    <TextField
                        name="oldPassword"
                        label="Current Password"
                        type="password"
                        required
                        value={form.oldPassword}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
                    />
                    
                    {/* New Password */}
                    <TextField
                        name="newPassword"
                        label="New Password"
                        type="password"
                        required
                        value={form.newPassword}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
                    />

                    {/* Confirm New Password */}
                    <TextField
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        required
                        value={form.confirmPassword}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
                    />

                    <Button type="submit" variant="contained" color="error" disabled={loading} sx={{ py: 1.5 }}>
                        {loading ? 'Updating...' : 'Change Password'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ChangePassword;