// src/components/Navbar.jsx

import React from 'react';
import { Stack, Box, Typography, Button, IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import SearchIcon from '@mui/icons-material/Search';
import UploadIcon from '@mui/icons-material/CloudUpload';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext'; // Import the Auth context

const Navbar = () => {
    // Auth Context se data nikalna
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    // --- State for Menu ---
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    // -----------------------

    // --- Search Logic (dummy for now, will implement properly later) ---
    const [searchTerm, setSearchTerm] = React.useState('');
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            navigate(/search/${searchTerm});
            setSearchTerm('');
        }
    };
    // -----------------------

    return (
        <Stack 
            direction="row" 
            alignItems="center" 
            p={2} 
            sx={{ 
                position: 'sticky', 
                top: 0, 
                backgroundColor: '#0f0f0f', 
                justifyContent: 'space-between', 
                borderBottom: '1px solid #3d3d3d',
                zIndex: 100 // Taki navbar sabse upar rahe
            }}
        >
            {/* Left Side: Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                <VideoCameraBackIcon sx={{ color: 'red', fontSize: 32 }} />
                <Typography variant="h6" fontWeight="bold" ml={1} color="white" display={{ xs: 'none', sm: 'block' }}>
                    My<span style={{ color: 'red' }}>Tube</span>
                </Typography>
            </Link>

            {/* Center: Search Bar */}
            <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', alignItems: 'center' }}>
                <input 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ 
                        background: '#121212', 
                        border: '1px solid #3a3a3a', 
                        borderRight: 'none',
                        borderRadius: '20px 0 0 20px', 
                        color: 'white', 
                        padding: '8px 15px',
                        width: '300px',
                        outline: 'none'
                    }}
                />
                <IconButton 
                    type="submit" 
                    sx={{ p: '10px', color: '#aaa', background: '#222', borderRadius: '0 20px 20px 0', '&:hover': { background: '#333' } }}
                    aria-label="search"
                >
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* Right Side: User Actions */}
            <Box>
                {/* ---------------------------------------------------- */}
                {/* --- Logic 1: Agar User Authenticated hai (Logged In) --- */}
                {/* ---------------------------------------------------- */}
                {isAuthenticated ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                        {/* 1. Upload Button */}
                        <IconButton component={Link} to="/upload" sx={{ color: 'white' }}>
                            <UploadIcon />
                        </IconButton>
                        
                        {/* 2. User Avatar/Menu */}
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                            color="inherit"
                            sx={{ p: 0 }}
                        >
                            {/* Agar user ka avatar hai toh use dikhao, warna default icon */}
                            {user?.avatar ? (
                                <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                            ) : (
                                <AccountCircle sx={{ color: 'white', fontSize: 32 }} />
                            )}
                        </IconButton>
                        
                        {/* 3. Dropdown Menu */}
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            sx={{ '& .MuiPaper-root': { backgroundColor: '#282828', color: 'white' } }}
                        >
                            <MenuItem onClick={handleClose} component={Link} to={/channel/${user?.username}}>
                                Channel ({user?.username})
                            </MenuItem>
                            <MenuItem onClick={handleClose} component={Link} to="/settings">
                                Settings
                            </MenuItem>
                            <MenuItem onClick={() => { logout(); handleClose(); }} sx={{ color: 'red' }}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Stack>
                ) : (
                    /* --------------------------------------------------- */
                    /* --- Logic 2: Agar User Logged Out hai --- */
                    /* --------------------------------------------------- */
                    <Stack direction="row" spacing={1}>
                        <Button component={Link} to="/login" variant="outlined" sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'red' } }}>
                            Sign In
                        </Button>
                        <Button component={Link} to="/register" variant="contained" color="error">
                            Register
                        </Button>
                    </Stack>
                )}
            </Box>
        </Stack>
    );
};

export default Navbar;