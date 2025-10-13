// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { fetchGet } from '../utils/fetchFromAPI';
import VideoCard from '../components/VideoCard';
import Sidebar from '../components/Sidebar'; // Assuming a basic sidebar component exists

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    // Note: Category filtering ke liye abhi hum 'All' select kar rahe hain
    // Categories ko handle karne ke liye sidebar mein logic lagega

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        // API call to fetch videos (Category ke liye hum query param use kar sakte hain)
        // Abhi hum sirf base route '/' call kar rahe hain
        const fetchVideos = async () => {
            try {
                // Backend route: /videos/
                const data = await fetchGet('videos'); 
                
                // data.docs mein actual video list hai (due to pagination)
                if (data && data.docs) {
                    setVideos(data.docs);
                } else {
                    setVideos([]);
                }
            } catch (err) {
                console.error("Home Feed Error:", err);
                setError("Failed to load videos. Please check backend connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, [selectedCategory]); // Category change hone par refetch karega

    return (
        <Stack sx={{ flexDirection: { sx: "column", md: "row" } }}>
            
            {/* 1. Left Sidebar (Categories) */}
            <Box sx={{ height: { sx: 'auto', md: '92vh' }, borderRight: '1px solid #3d3d3d', px: { sx: 0, md: 2 } }}>
                {/* Abhi hum ek simple Sidebar component bana rahe hain */}
                <Sidebar 
                    selectedCategory={selectedCategory} 
                    setSelectedCategory={setSelectedCategory} 
                />
            </Box>

            {/* 2. Video Feed Area */}
            <Box p={2} sx={{ overflowY: 'auto', height: '90vh', flex: 2 }}>
                <Typography variant="h4" fontWeight="bold" mb={2} sx={{ color: 'white' }}>
                    {selectedCategory} <span style={{ color: '#FC1503' }}>Videos</span>
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                        <CircularProgress color="error" />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : (
                    <Grid container spacing={3}>
                        {videos.map((item) => (
                            <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
                                <VideoCard video={item} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Stack>
    );
};

export default Home;