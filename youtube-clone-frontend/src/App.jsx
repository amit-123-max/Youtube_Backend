// src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';

// 1. Pages ko import karein (Abhi ke liye dummy banao)
import Home from './pages/Home';
import VideoDetail from './pages/VideoDetail';
import ChannelDetail from './pages/ChannelDetail';
import SearchFeed from './pages/SearchFeed';

// 2. Components ko import karein
import Navbar from './components/Navbar'; 

const App = () => (
  // 1. BrowserRouter se pura app wrap karein
  <BrowserRouter>
    {/* 2. Main container Box (YouTube ka dark background) */}
    <Box sx={{ backgroundColor: '#0f0f0f', minHeight: '100vh' }}>
      
      {/* 3. Navbar top par rahegi */}
      <Navbar />

      {/* 4. Routes define karein */}
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* URL mein ID ya parameter use hoga (apke backend routes ke hisaab se) */}
        <Route path="/video/:videoId" element={<VideoDetail />} />
        <Route path="/channel/:username" element={<ChannelDetail />} /> 
        <Route path="/search/:searchTerm" element={<SearchFeed />} />
        
        {/* Optional: Login/Register page ke routes baad mein add karenge */}
      </Routes>
    </Box>
  </BrowserRouter>
);

export default App;