// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// 1. AuthProvider ko import karein
import { AuthProvider } from './context/AuthContext'; 

// 2. Pages ko import karein
import Home from './pages/Home';
import VideoDetail from './pages/VideoDetail';
import ChannelDetail from './pages/ChannelDetail';
import SearchFeed from './pages/SearchFeed';
import Login from './pages/Login'; // New
import Register from './pages/Register'; // New
import Upload from './pages/Upload'; // New

// 3. Components ko import karein
import Navbar from './components/Navbar'; 

const App = () => (
  <BrowserRouter>
    {/* 4. Pura App AuthProvider se wrap karein */}
    <AuthProvider>
      <Box sx={{ backgroundColor: '#0f0f0f', minHeight: '100vh' }}>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/video/:videoId" element={<VideoDetail />} />
          <Route path="/channel/:username" element={<ChannelDetail />} />
          <Route path="/search/:searchTerm" element={<SearchFeed />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/upload" element={<Upload />} />
        </Routes>
      </Box>
    </AuthProvider>
  </BrowserRouter>
);

export default App;