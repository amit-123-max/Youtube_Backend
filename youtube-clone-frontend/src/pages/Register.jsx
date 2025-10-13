// src/pages/Register.jsx

import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Container, Alert, Paper, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { fetchFromAPI } from '../utils/fetchFromAPI';

const Register = () => {
    const navigate = useNavigate();
    
    // --- State Management ---
    const [form, setForm] = useState({ 
        fullName: '', 
        username: '', 
        email: '', 
        password: '',
        avatar: null,      // File object
        coverImage: null   // File object
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        // Store the file object in state
        setForm({ ...form, [name]: files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // 1. Basic Client-side Validation
        const requiredFields = ['fullName', 'username', 'email', 'password'];
        for (const field of requiredFields) {
            if (!form[field].trim()) {
                setError(`The field "${field}" is required.`);
                return;
            }
        }
        if (!form.avatar) {
            setError("Avatar image is required.");
            return;
        }

        // 2. Create FormData Object (Crucial for File Uploads)
        const formData = new FormData();
        
        // Append text fields
        formData.append('fullName', form.fullName);
        formData.append('username', form.username);
        formData.append('email', form.email);
        formData.append('password', form.password);
        
        // Append file fields (Keys must match backend Multer keys!)
        formData.append('avatar', form.avatar);
        if (form.coverImage) {
            formData.append('coverImage', form.coverImage);
        }

        setLoading(true);

        try {
            // 3. API Call: POST to /users/register with FormData
            await fetchFromAPI('users/register', 'POST', formData);

            setSuccess("Registration successful! Redirecting to login...");
            
            // Redirect to login page after successful registration
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            // Error is handled by fetchFromAPI and re-thrown
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: 2 }}>
                <Typography variant="h4" color="white" align="center" gutterBottom>
                    Create Your Account
                </Typography>

                {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}><CircularProgress color="error" /></Box>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    
                    {/* Full Name */}
                    <TextField
                        name="fullName"
                        label="Full Name"
                        required
                        value={form.fullName}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
                    />
                    
                    {/* Username */}
                    <TextField
                        name="username"
                        label="Username"
                        required
                        value={form.username}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
                    />

                    {/* Email */}
                    <TextField
                        name="email"
                        label="Email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
                    />

                    {/* Password */}
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        required
                        value={form.password}
                        onChange={handleChange}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
                    />
                    
                    {/* Avatar File Input */}
                    <Box sx={{ border: '1px dashed #444', p: 2, borderRadius: 1 }}>
                        <Typography color="#aaa" mb={1}>Select Avatar Image (Required)</Typography>
                        <input
                            type="file"
                            name="avatar"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ color: 'white' }}
                            required
                        />
                        {form.avatar && <Typography color="#ccc" variant="caption" display="block">Selected: {form.avatar.name}</Typography>}
                    </Box>

                    {/* Cover Image File Input (Optional) */}
                    <Box sx={{ border: '1px dashed #444', p: 2, borderRadius: 1 }}>
                        <Typography color="#aaa" mb={1}>Select Cover Image (Optional)</Typography>
                        <input
                            type="file"
                            name="coverImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ color: 'white' }}
                        />
                         {form.coverImage && <Typography color="#ccc" variant="caption" display="block">Selected: {form.coverImage.name}</Typography>}
                    </Box>

                    <Button type="submit" variant="contained" color="error" disabled={loading} sx={{ py: 1.5 }}>
                        {loading ? 'Registering...' : 'Register'}
                    </Button>

                    <Typography color="#aaa" align="center">
                        Already have an account? <Link to="/login" style={{ color: 'white' }}>Sign In</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;