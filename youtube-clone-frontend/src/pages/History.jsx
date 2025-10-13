// src/pages/History.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert, Divider, Container } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import { fetchGet } from '../utils/fetchFromAPI';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/VideoCard'; 

const History = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirect if not logged in
    useEffect(() => {
        if (!isAuthenticated && !authLoading) {
            navigate('/login');
            return;
        }

        if (isAuthenticated) {
            fetchHistory();
        }
    }, [isAuthenticated, authLoading, navigate]);


    const fetchHistory = async () => {
        setLoading(true);
        setError(null);
        setVideos([]);
        
        try {
            // Backend Route: GET /users/history (Protected route)
            // Backend directly videos ka array return karta hai (user.controller.js ke hisaab se)
            const historyVideos = await fetchGet('users/history'); 
            
            if (Array.isArray(historyVideos)) {
                // Videos are ordered by last watched (MongoDB mein push order ke according)
                // Optional: Yahaan hum reverse kar sakte hain taaki sabse naya video sabse upar dikhe.
                setVideos(historyVideos.reverse()); 
            } else {
                 setVideos([]);
            }
        } catch (err) {
            console.error("Watch History Error:", err);
            setError(err.message || "Failed to load watch history.");
        } finally {
            setLoading(false);
        }
    };


    if (!isAuthenticated || authLoading) return null;

    return (
        <Container maxWidth="xl" sx={{ mt: 5, minHeight: '90vh' }}>
            <Box p={2}>
                <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                    <HistoryIcon sx={{ color: 'white', fontSize: 35 }} />
                    <Typography variant="h4" fontWeight="bold" color="white">
                        Watch History
                    </Typography>
                </Stack>
                
                <Divider sx={{ mb: 4, bgcolor: '#3d3d3d' }} />

                {/* Loading / Error State Handling */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                        <CircularProgress color="error" />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : videos.length === 0 ? (
                    <Typography variant="h6" color="#aaa" mt={5} align="center">
                        You haven't watched any videos yet!
                    </Typography>
                ) : (
                    /* Display History Videos in a List/Grid */
                    <Grid container spacing={3}>
                        {videos.map((item) => (
                            // Watch history mein videos ko list view mein dikhana behtar hota hai
                            // Hum yahan VideoCard ko poori row dekar list view simulate kar sakte hain
                            <Grid item key={item._id} xs={12} sm={12} md={10} lg={8} sx={{ margin: '0 auto' }}>
                                {/* Note: VideoCard component ko yahan full width use karne ke liye adjust karna padega */}
                                <VideoCard video={item} />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default History;