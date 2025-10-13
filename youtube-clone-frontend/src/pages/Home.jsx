// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { fetchGet } from '../utils/fetchFromAPI';
import VideoCard from '../components/VideoCard';
import Sidebar from '../components/Sidebar';

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All'); // Default: 'All'

    useEffect(() => {
        setLoading(true);
        setError(null);
        
        const fetchVideos = async () => {
            try {
                // Logic: Agar 'All' hai toh sirf base /videos call hoga.
                // Warna, selectedCategory ko 'query' parameter mein bhejenge (Example: videos?query=Music)
                const url = selectedCategory === 'All' ? 'videos' : `videos?query=${selectedCategory}`; 
                
                const data = await fetchGet(url); 
                
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
    }, [selectedCategory]); // Category change hone par refetch hoga

    return (
        <Stack sx={{ flexDirection: { xs: "column", md: "row" } }}>
            
            {/* 1. Left Sidebar (Categories) */}
            <Box sx={{ 
                height: { xs: 'auto', md: '92vh' }, 
                borderRight: { md: '1px solid #3d3d3d' }, 
                px: { xs: 0, md: 2 },
                pb: { xs: 2, md: 0 } // Mobile bottom padding
            }}>
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
                            // Ensure item._id exists before using it as key
                            <Grid item key={item._id || Math.random()} xs={12} sm={6} md={4} lg={3}> 
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