// src/components/CommentsSection.jsx

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Avatar, Stack } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { fetchFromAPI } from '../utils/fetchFromAPI';

const CommentCard = ({ comment }) => (
    <Stack direction="row" spacing={2} py={1}>
        <Avatar src={comment.owner?.avatar} sx={{ bgcolor: 'gray' }} />
        <Box>
            <Typography variant="subtitle2" color="#aaa">
                {comment.owner?.username}
            </Typography>
            <Typography variant="body2" color="white">
                {comment.content}
            </Typography>
            {/* TODO: Like/Reply buttons yahan aayenge */}
        </Box>
    </Stack>
);


const CommentsSection = ({ videoId, initialComments, setComments }) => {
    const { isAuthenticated, user } = useAuth();
    const [newCommentContent, setNewCommentContent] = useState('');
    const [loading, setLoading] = useState(false);

    // Add Comment Handler
    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newCommentContent.trim()) return;
        
        setLoading(true);
        try {
            // Backend Route: POST /comment/addComment/:videoId
            const postedComment = await fetchFromAPI(`comment/addComment/${videoId}`, 'POST', {
                content: newCommentContent
            });

            // Frontend State Update: Naye comment ko list mein add karein
            // Note: Humein postedComment mein owner details bhi milni chahiye, 
            // Varna hum current user ke details use karke use manually add kar sakte hain.
            const newComment = {
                ...postedComment,
                owner: { username: user?.username, avatar: user?.avatar, _id: user?._id } // Assuming current user data
            }

            setComments(prev => [newComment, ...prev]); // Newest comment upar aayega
            setNewCommentContent('');

        } catch (err) {
            alert(`Failed to post comment: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ mt: 5 }}>
            <Typography variant="h6" color="white" mb={2}>
                {initialComments.length} Comments
            </Typography>

            {/* Post New Comment Form */}
            {isAuthenticated ? (
                <Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', alignItems: 'flex-start', mb: 4, gap: 2 }}>
                    <Avatar src={user?.avatar} sx={{ mt: 1, bgcolor: 'gray' }} />
                    <TextField
                        fullWidth
                        placeholder="Add a comment..."
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        variant="standard"
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{ 
                            input: { color: 'white' }, 
                            textarea: { color: 'white' },
                            '& .MuiInputBase-input': { color: 'white' },
                            '& .MuiInput-underline:before': { borderBottomColor: '#444' },
                            '& .MuiInput-underline:after': { borderBottomColor: 'red' },
                        }}
                        multiline
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="error" 
                        disabled={loading || !newCommentContent.trim()}
                        sx={{ mt: 2, height: '40px' }}
                    >
                        {loading ? 'Posting...' : 'Comment'}
                    </Button>
                </Box>
            ) : (
                <Typography color="#aaa" mb={3}>
                    <Link to="/login" style={{ color: 'white' }}>Login</Link> to post comments.
                </Typography>
            )}

            {/* Display Existing Comments */}
            <Stack spacing={2}>
                {initialComments.map((comment) => (
                    <CommentCard key={comment._id} comment={comment} />
                ))}
            </Stack>
        </Box>
    );
};

export default CommentsSection;