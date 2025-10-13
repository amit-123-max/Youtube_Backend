// src/pages/SearchFeed.jsx

import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchGet } from '../utils/fetchFromAPI';
import VideoCard from '../components/VideoCard'; 

const SearchFeed = () => {
    // 1. URL parameters se 'searchTerm' nikalna
    const { searchTerm } = useParams();
    
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        setVideos([]); // Jab bhi search term badle, purane results clear karein

        if (!searchTerm) {
            setLoading(false);
            return;
        }

        const fetchSearchResults = async () => {
            try {
                // 2. API Call: /videos endpoint par 'query' parameter ke saath search term bhejna
                // Yeh call aapke backend ke 'getAllVideos' controller ko use karegi.
                const url = `videos?query=${searchTerm}`;
                const data = await fetchGet(url); 
                
                if (data && data.docs) {
                    setVideos(data.docs);
                } else {
                    setVideos([]);
                }
            } catch (err) {
                console.error("Search Feed Error:", err);
                setError("Failed to load search results.");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchTerm]); // Dependency: Search term change hone par data fetch hoga

    return (
        <Box p={2} sx={{ minHeight: '90vh', color: 'white' }}>
            <Typography variant="h4" fontWeight="bold" mb={2}>
                Search Results for: <span style={{ color: '#FC1503' }}>{searchTerm}</span>
            </Typography>

            {/* Loading / Error State Handling */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                    <CircularProgress color="error" />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : videos.length === 0 ? (
                 <Typography variant="h6" color="#aaa" mt={5}>
                    No videos found matching your search term.
                </Typography>
            ) : (
                /* 3. Display Results in a Grid */
                <Grid container spacing={3}>
                    {videos.map((item) => (
                        <Grid item key={item._id || Math.random()} xs={12} sm={6} md={4} lg={3}>
                            <VideoCard video={item} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default SearchFeed;