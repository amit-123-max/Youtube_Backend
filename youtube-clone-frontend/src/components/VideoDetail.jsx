// src/pages/VideoDetail.jsx

import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Grid, CircularProgress } from '@mui/material';
import ReactPlayer from 'react-player';
import { useParams } from 'react-router-dom';
import { fetchGet } from '../utils/fetchFromAPI';
import InteractionButtons from '../components/InteractionButtons'; 
import CommentsSection from '../components/CommentsSection'; // Next step ka component

// --- DUMMY Comments Data Fetching (Actual backend route assumed) ---
const fetchComments = async (videoId) => {
    // Backend route assumed: GET /comment/:videoId
    try {
        const data = await fetchGet(`comment/${videoId}`);
        return data || []; // Assuming backend returns array of comments
    } catch (err) {
        console.error("Failed to fetch comments list:", err.message);
        return [];
    }
}
// ------------------------------------------------------------------

const VideoDetail = () => {
    const { videoId } = useParams();
    const [videoDetails, setVideoDetails] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!videoId) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // 1. Fetch Video Details (Assuming Backend Route: GET /videos/:videoId)
                const videoData = await fetchGet(`videos/${videoId}`); 
                setVideoDetails(videoData);

                // 2. Fetch Comments (Assuming Backend Route: GET /comment/:videoId)
                const commentsData = await fetchComments(videoId);
                setComments(commentsData);

            } catch (err) {
                console.error(err);
                setError(err.message || "Failed to load video details.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [videoId]);


    if (loading) {
        return (
            <Box minHeight="90vh" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress color="error" />
            </Box>
        );
    }
    
    if (error || !videoDetails) {
        return (
            <Box minHeight="90vh" sx={{ color: 'white', p: 3 }}>
                <Typography variant="h5" color="error">
                    {error || "Video not found or details are missing."}
                </Typography>
            </Box>
        );
    }

    // Video URL, assuming your backend returns the cloudinary URL in videoFile
    const videoUrl = videoDetails?.videoFile; 
    const channelId = videoDetails?.owner?.username; // Channel ID/Username

    return (
        <Box minHeight="90vh">
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} p={2}>
                
                {/* --- Left Column: Video Player and Info --- */}
                <Box flex={1}>
                    {/* Video Player */}
                    <ReactPlayer 
                        url={videoUrl} 
                        className="react-player" 
                        controls 
                        width="100%" 
                        height="60vh" 
                    />

                    {/* Video Title */}
                    <Typography variant="h5" color="white" fontWeight="bold" py={2}>
                        {videoDetails.title}
                    </Typography>

                    {/* Interactions and Channel Info */}
                    <Stack direction="row" justifyContent="space-between" py={1} sx={{ color: 'white' }}>
                        {/* Channel Name */}
                        <Typography variant="subtitle1" color="#aaa">
                            {videoDetails.owner?.username}
                        </Typography>
                        
                        {/* Interaction Buttons (Like/Subscribe) */}
                        <InteractionButtons 
                            videoId={videoId} 
                            channelId={channelId} 
                        />
                    </Stack>
                    
                    {/* Description */}
                    <Box sx={{ borderTop: '1px solid #3d3d3d', pt: 2, mt: 2 }}>
                         <Typography variant="subtitle2" color="#aaa">
                            {videoDetails.views} Views • Published: {new Date(videoDetails.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" color="white" mt={1}>
                            {videoDetails.description}
                        </Typography>
                    </Box>

                    {/* Comments Section */}
                    <CommentsSection 
                        videoId={videoId} 
                        initialComments={comments} 
                        setComments={setComments}
                    />

                </Box>
                
                {/* --- Right Column: Related Videos (Placeholder) --- */}
                <Box px={2} py={{ md: 1, xs: 5 }} justifyContent="center" alignItems="center">
                    <Typography variant="h6" color="white">
                        Related Videos (WIP)
                    </Typography>
                    {/* Related Videos component yahan aayega */}
                </Box>
            </Stack>
        </Box>
    );
};

export default VideoDetail;