import React from 'react';
import { Typography, Card, CardContent, CardMedia, Box, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
    const videoId = video._id; 
    const channelId = video.owner?.username; // Assuming owner object has username

    return (
        <Card sx={{ width: { xs: '100%', sm: '358px', md: '320px' }, boxShadow: 'none', borderRadius: 0, background: '#0f0f0f' }}>
            {/* 1. Thumbnail/Video Link */}
            <Link to={videoId ? `/video/${videoId}` : `/`}>
                <CardMedia 
                    image={video.thumbnail} 
                    alt={video.title} 
                    sx={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: '8px' }}
                />
            </Link>

            {/* 2. Title and Channel Info */}
            <CardContent sx={{ backgroundColor: '#0f0f0f', height: '100px', display: 'flex', alignItems: 'flex-start', p: 1 }}>
                
                {/* Channel Avatar */}
                <Link to={channelId ? `/channel/${channelId}` : `/`}>
                    <Avatar src={video.owner?.avatar} alt={video.owner?.username} sx={{ width: 36, height: 36, mr: 1.5, mt: 0.5, bgcolor: 'gray' }} />
                </Link>

                <Box>
                    {/* Video Title */}
                    <Link to={videoId ? `/video/${videoId}` : `/`} style={{ textDecoration: 'none' }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="#FFF" sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: '2', // Show max 2 lines
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.3
                        }}>
                            {video.title.slice(0, 60)}...
                        </Typography>
                    </Link>

                    {/* Channel Name */}
                    <Link to={channelId ? `/channel/${channelId}` : `/`} style={{ textDecoration: 'none' }}>
                        <Typography variant="subtitle2" color="gray">
                            {video.owner?.username}
                        </Typography>
                    </Link>
                    
                    {/* Views and Time (Optional) */}
                    <Typography variant="caption" color="gray">
                        {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

export default VideoCard;