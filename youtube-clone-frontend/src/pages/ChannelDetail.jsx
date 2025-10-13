import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Avatar, CircularProgress, Button, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchGet, fetchFromAPI } from '../utils/fetchFromAPI';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard'; // Pichhle steps mein bana chuke hain
import { SubscriptionsOutlined } from '@mui/icons-material';

const ChannelDetail = () => {
    const { username } = useParams(); // URL se username nikalna (e.g., /channel/tech_master)
    const { isAuthenticated, user } = useAuth();
    
    const [channelDetails, setChannelDetails] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [interactionLoading, setInteractionLoading] = useState(false);

    // Data Fetching: Channel Profile aur Videos
    useEffect(() => {
        if (!username) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // 1. Fetch Channel Profile Details (Backend Route: GET /users/c/:username)
                const profileResponse = await fetchGet(`users/c/${username}`);
                setChannelDetails(profileResponse.data);

                const channelId = profileResponse.data?._id; 
                const isSubscribedStatus = profileResponse.data?.isSubscribed;
                
                setIsSubscribed(isSubscribedStatus);

                // 2. Fetch Channel Videos (Assuming Backend Route: GET /videos/user/:userId)
                if (channelId) {
                    const videosResponse = await fetchGet(`videos/user/${channelId}`);
                    // Assuming the backend returns an array of videos directly
                    setVideos(videosResponse.data || []); 
                }

            } catch (err) {
                console.error(err);
                setError(err.message || "Failed to load channel details or videos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [username]);


    // Subscription Toggle Handler (Reused Logic)
    const handleToggleSubscribe = async () => {
        if (!isAuthenticated) {
            alert("Please login to subscribe.");
            return;
        }
        if (!channelDetails || !channelDetails._id) return;
        
        setInteractionLoading(true);

        try {
            // Backend Route: POST /subscription/:channelId
            const response = await fetchFromAPI(`subscription/${channelDetails._id}`, 'POST');

            // Backend response mein 'isSubscribe' flag aayega
            if (response.isSubscribe !== undefined) {
                setIsSubscribed(response.isSubscribe);
                
                // Update subscriber count instantly for a better UX
                setChannelDetails(prev => ({
                    ...prev,
                    subscribersCount: response.isSubscribe ? prev.subscribersCount + 1 : prev.subscribersCount - 1
                }));
            }
        } catch (err) {
            alert(err.message || "Failed to toggle subscription.");
        } finally {
            setInteractionLoading(false);
        }
    };


    if (loading) {
        return (
            <Box minHeight="90vh" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress color="error" />
            </Box>
        );
    }
    
    if (error || !channelDetails) {
        return (
            <Box minHeight="90vh" sx={{ color: 'white', p: 3 }}>
                <Typography variant="h5" color="error">
                    {error || "Channel not found."}
                </Typography>
            </Box>
        );
    }

    // Check if the current user is viewing their own channel
    const isOwner = isAuthenticated && user?.username === channelDetails.username;


    return (
        <Box minHeight="90vh" sx={{ color: 'white' }}>
            
            {/* --- 1. Cover Image --- */}
            <Box>
                <img 
                    src={channelDetails.coverImage || 'https://via.placeholder.com/1200x200?text=Channel+Cover+Image'}
                    alt="Cover"
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
            </Box>

            {/* --- 2. Channel Info Header --- */}
            <Stack direction="row" alignItems="center" spacing={4} p={3} sx={{ borderBottom: '1px solid #3d3d3d' }}>
                
                {/* Avatar */}
                <Avatar 
                    src={channelDetails.avatar} 
                    sx={{ width: 120, height: 120, border: '4px solid #3d3d3d' }} 
                />
                
                <Box>
                    {/* Channel Name */}
                    <Typography variant="h4" fontWeight="bold">
                        {channelDetails.fullName}
                    </Typography>
                    
                    {/* Username and Stats */}
                    <Typography variant="subtitle1" color="#aaa" mt={0.5}>
                        @{channelDetails.username} • {channelDetails.subscribersCount} Subscribers • {videos.length} Videos
                    </Typography>
                </Box>
                
                {/* Subscribe Button / Edit Button */}
                {!isOwner ? (
                    <Button
                        variant="contained"
                        onClick={handleToggleSubscribe}
                        disabled={interactionLoading}
                        startIcon={!isSubscribed && <SubscriptionsOutlined />}
                        sx={{ 
                            ml: 'auto !important', // Push button to the right
                            bgcolor: isSubscribed ? '#555' : 'red', 
                            '&:hover': { bgcolor: isSubscribed ? '#444' : '#cc0000' },
                            height: '40px'
                        }}
                    >
                        {interactionLoading ? <CircularProgress size={20} color="inherit" /> : (isSubscribed ? 'Subscribed' : 'Subscribe')}
                    </Button>
                ) : (
                    // TODO: Profile Edit Button
                    <Button 
                        variant="outlined" 
                        color="error" 
                        sx={{ ml: 'auto !important', height: '40px' }}
                        // onClick={() => navigate('/edit-profile')} // Example routing
                    >
                        Edit Profile
                    </Button>
                )}
            </Stack>

            {/* --- 3. Videos Section --- */}
            <Box p={3}>
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    {isOwner ? 'Your Videos' : 'Channel Videos'}
                </Typography>

                {videos.length > 0 ? (
                    <Grid container spacing={3}>
                        {videos.map((item) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                                <VideoCard video={item} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography color="#aaa">
                        This channel has no videos yet.
                    </Typography>
                )}
            </Box>

        </Box>
    );
};

export default ChannelDetail;