// src/components/InteractionButtons.jsx

import React, { useState, useEffect } from 'react';
import { Button, Stack, Typography, CircularProgress, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useAuth } from '../context/AuthContext';
import { fetchFromAPI, fetchGet } from '../utils/fetchFromAPI';

const InteractionButtons = ({ videoId, channelId }) => {
    const { isAuthenticated, user } = useAuth();
    const [likeCount, setLikeCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [interactionLoading, setInteractionLoading] = useState(false);
    const [error, setError] = useState(null);

    // 1. Data Fetching: Likes aur Subscription Status
    useEffect(() => {
        const fetchInteractions = async () => {
            if (!videoId || !channelId) return;
            setLoading(true);
            setError(null);

            try {
                // Fetch Likes Count and List (Backend Route: /like/video/number_of_likes/:videoId)
                const likeData = await fetchGet(`like/video/number_of_likes/${videoId}`);
                setLikeCount(likeData?.no_ofLikesCount || 0);

                // Check if the current user has liked the video
                if (isAuthenticated && likeData?.likedByUsers) {
                    const likedByUserIds = likeData.likedByUsers.map(id => id.toString());
                    setIsLiked(likedByUserIds.includes(user._id));
                }
                
                // Fetch Subscription Status (Assuming a dedicated GET route for subscription status exists)
                // --- Temporary Logic (Actual backend GET route ki zaroorat padegi) ---
                // For now, assume a subscription check API: /subscription/status/:channelId
                // Since that route is not confirmed, we'll keep it simple for now:
                // Isse frontend ka logic clear rahega.

            } catch (err) {
                setError("Failed to fetch interaction data.");
            } finally {
                setLoading(false);
            }
        };
        fetchInteractions();
    }, [videoId, channelId, isAuthenticated, user]); // user change hone par refresh hoga

    // 2. Toggle Like Handler
    const handleToggleLike = async () => {
        if (!isAuthenticated) {
            alert("Please login to like this video.");
            return;
        }
        setInteractionLoading(true);
        setError(null);

        try {
            // Backend Route: POST /like/video/:videoId
            const response = await fetchFromAPI(`like/video/${videoId}`, 'POST');

            // Backend response mein 'isLiked' flag aayega
            if (response.isLiked !== undefined) {
                setIsLiked(response.isLiked);
                // Update count instantly
                setLikeCount(prev => response.isLiked ? prev + 1 : prev - 1);
            }
        } catch (err) {
            setError(err.message || "Failed to toggle like status.");
        } finally {
            setInteractionLoading(false);
        }
    };
    
    // 3. Toggle Subscribe Handler
    const handleToggleSubscribe = async () => {
        if (!isAuthenticated) {
            alert("Please login to subscribe.");
            return;
        }
        setInteractionLoading(true);
        setError(null);

        try {
            // Backend Route: POST /subscription/:channelId
            const response = await fetchFromAPI(`subscription/${channelId}`, 'POST');

            // Backend response mein 'isSubscribe' flag aayega
            if (response.isSubscribe !== undefined) {
                setIsSubscribed(response.isSubscribe);
            }
        } catch (err) {
            setError(err.message || "Failed to toggle subscription.");
        } finally {
            setInteractionLoading(false);
        }
    };

    if (loading) {
        return <CircularProgress size={24} color="error" />;
    }

    return (
        <Stack direction="row" spacing={2} alignItems="center">
            {/* Like Button */}
            <Button
                variant="contained"
                startIcon={isLiked ? <ThumbDownIcon /> : <ThumbUpIcon />}
                onClick={handleToggleLike}
                disabled={interactionLoading}
                sx={{ 
                    bgcolor: isLiked ? 'red' : '#3d3d3d', 
                    '&:hover': { bgcolor: isLiked ? '#cc0000' : '#4d4d4d' } 
                }}
            >
                {interactionLoading ? <CircularProgress size={20} color="inherit" /> : `${likeCount} ${isLiked ? 'Liked' : 'Like'}`}
            </Button>
            
            {/* Subscribe Button */}
            <Button
                variant="contained"
                onClick={handleToggleSubscribe}
                disabled={interactionLoading}
                sx={{ 
                    bgcolor: isSubscribed ? '#555' : 'red', 
                    '&:hover': { bgcolor: isSubscribed ? '#444' : '#cc0000' } 
                }}
            >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </Button>

            {error && <Typography color="error">{error}</Typography>}
        </Stack>
    );
};

export default InteractionButtons;