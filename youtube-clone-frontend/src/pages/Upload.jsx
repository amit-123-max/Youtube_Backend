// src/pages/Upload.jsx

import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Container, Alert, LinearProgress, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { fetchFromAPI } from '../utils/fetchFromAPI';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Agar user logged in nahi hai, toh redirect kar do
    if (!isAuthenticated && !authLoading) {
        navigate('/login');
        return null; 
    }

    const handleFileUpload = (e) => {
        // Clear old files and messages
        setError('');
        setMessage('');

        // Files ko state mein store karo
        const file = e.target.files[0];
        if (e.target.name === 'videoFile') {
            setVideoFile(file);
        } else if (e.target.name === 'thumbnail') {
            setThumbnail(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        // 1. Client-side Validation: Check if files are selected
        if (!videoFile || !thumbnail || !title.trim() || !description.trim()) {
            setError("All fields (Title, Description, Video File, Thumbnail) are required.");
            return;
        }

        // 2. FormData Object Create Karein (Crucial Step)
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('videoFile', videoFile); // Key 'videoFile' match honi chahiye backend Multer key se
        formData.append('thumbnail', thumbnail); // Key 'thumbnail' match honi chahiye backend Multer key se

        setLoading(true);
        
        try {
            // 3. API Call: fetchFromAPI ko POST method aur FormData object pass karein
            const uploadedVideo = await fetchFromAPI('videos/uploadVideo', 'POST', formData);

            setMessage(`Video uploaded successfully! Title: ${uploadedVideo.title}`);
            
            // Form ko clear karein aur user ko new video page par redirect karein
            setTitle('');
            setDescription('');
            setVideoFile(null);
            setThumbnail(null);
            
            // Delay ke baad video detail page par navigate karein
            setTimeout(() => {
                navigate(`/video/${uploadedVideo._id}`); 
            }, 2000);

        } catch (err) {
            console.error(err);
            setError(err.message || "Video upload failed due to a network error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Paper elevation={3} sx={{ p: 4, bgcolor: '#1e1e1e', borderRadius: 2 }}>
                <Typography variant="h4" color="white" gutterBottom>
                    Upload a New Video
                </Typography>
                
                {loading && <LinearProgress color="error" sx={{ mb: 2 }} />}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    
                    {/* Title */}
                    <TextField
                        label="Video Title"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{ input: { color: 'white' }, fieldset: { borderColor: '#444' } }}
                    />

                    {/* Description */}
                    <TextField
                        label="Video Description"
                        required
                        multiline
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{ textarea: { color: 'white' }, fieldset: { borderColor: '#444' } }}
                    />
                    
                    {/* Video File Input */}
                    <Box sx={{ border: '1px dashed #444', p: 2, borderRadius: 1 }}>
                        <Typography color="#aaa" mb={1}>Select Video File (MP4, MOV etc.)</Typography>
                        <input
                            type="file"
                            name="videoFile"
                            accept="video/*"
                            onChange={handleFileUpload}
                            style={{ color: 'white' }}
                            required
                        />
                        {videoFile && <Typography color="#ccc" variant="caption" display="block">Selected: {videoFile.name}</Typography>}
                    </Box>

                    {/* Thumbnail File Input */}
                    <Box sx={{ border: '1px dashed #444', p: 2, borderRadius: 1 }}>
                        <Typography color="#aaa" mb={1}>Select Thumbnail Image (JPG, PNG)</Typography>
                        <input
                            type="file"
                            name="thumbnail"
                            accept="image/*"
                            onChange={handleFileUpload}
                            style={{ color: 'white' }}
                            required
                        />
                        {thumbnail && <Typography color="#ccc" variant="caption" display="block">Selected: {thumbnail.name}</Typography>}
                    </Box>

                    <Button type="submit" variant="contained" color="error" disabled={loading} sx={{ py: 1.5 }}>
                        {loading ? 'Uploading...' : 'Upload Video'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Upload;