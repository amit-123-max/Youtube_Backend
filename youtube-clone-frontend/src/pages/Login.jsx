// src/pages/Login.jsx

import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login, isAuthenticated, isLoading } = useAuth();
    const [form, setForm] = useState({ loginId: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const loginData = {
            // Backend ko username OR email chahiye
            username: form.loginId.includes('@') ? undefined : form.loginId,
            email: form.loginId.includes('@') ? form.loginId : undefined,
            password: form.password
        };

        const result = await login(loginData);
        if (!result.success) {
            setError(result.message);
        }
    };

    if (isAuthenticated) return <Typography color="white" p={3}>You are already logged in!</Typography>;
    if (isLoading) return <Typography color="white" p={3}>Loading...</Typography>;

    return (
        <Container maxWidth="xs" sx={{ mt: 5 }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 4, bgcolor: '#121212', borderRadius: 2 }}>
                <Typography variant="h5" color="white" align="center">
                    Sign In
                </Typography>

                <TextField
                    name="loginId"
                    label="Username or Email"
                    required
                    value={form.loginId}
                    onChange={handleChange}
                    InputLabelProps={{ style: { color: '#aaa' } }}
                    sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#444' } } }}
                />
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    InputLabelProps={{ style: { color: '#aaa' } }}
                    sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#444' } } }}
                />

                {error && <Typography color="error" align="center">{error}</Typography>}

                <Button type="submit" variant="contained" color="error" disabled={isLoading}>
                    Login
                </Button>

                <Typography color="#aaa" align="center">
                    Don't have an account? <Link to="/register" style={{ color: '#fff' }}>Sign Up</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Login;