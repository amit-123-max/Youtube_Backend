// src/components/Navbar.jsx

import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';

const Navbar = () => (
    // Stack horizontally arrange karta hai (display: flex)
    <Stack 
        direction="row" 
        alignItems="center" 
        p={2} 
        sx={{ 
            position: 'sticky', 
            top: 0, 
            backgroundColor: '#0f0f0f', 
            justifyContent: 'space-between', 
            borderBottom: '1px solid #3d3d3d' // light border
        }}
    >
        {/* Left Side: Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
            <VideoCameraBackIcon sx={{ color: 'red', fontSize: 32 }} />
            <Typography variant="h6" fontWeight="bold" ml={1} color="white">
                My<span style={{ color: 'red' }}>Tube</span>
            </Typography>
        </Link>

        {/* Center: Search Bar (Abhi dummy hai) */}
        <Box>
            {/* Search component yahan aayega */}
            <input 
                placeholder="Search..." 
                style={{ 
                    background: '#121212', 
                    border: '1px solid #3a3a3a', 
                    borderRadius: '20px', 
                    color: 'white', 
                    padding: '8px 15px',
                    width: '400px'
                }}
            />
        </Box>

        {/* Right Side: User Icons (Abhi dummy hai) */}
        <Box sx={{ color: 'white' }}>
            {/* Login, Register, Upload Icons yahan aayenge */}
            <Typography variant="body1">
                <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>
                    Login
                </Link>
                <Link to="/upload" style={{ color: 'white', textDecoration: 'none' }}>
                    Upload
                </Link>
            </Typography>
        </Box>
    </Stack>
);

export default Navbar;