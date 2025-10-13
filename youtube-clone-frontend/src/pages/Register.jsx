// src/pages/Register.jsx

import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

const Register = () => {
    // Note: Registration form will be complex due to file uploads (avatar, coverImage)
    // We will build this form later using FormData logic.

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Box sx={{ p: 4, bgcolor: '#121212', borderRadius: 2 }}>
                <Typography variant="h5" color="white" align="center">
                    Register Page
                </Typography>
                <Typography color="#aaa" align="center" mt={2}>
                    This page requires a complex form using *FormData* (for avatar & cover image upload).
                    We will implement this after testing the basic login flow.
                </Typography>
                <Typography color="#aaa" align="center" mt={2}>
                    Already have an account? <Link to="/login" style={{ color: '#fff' }}>Sign In</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Register;