// src/components/Sidebar.jsx

import React from 'react';
import { Stack, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import MovieIcon from '@mui/icons-material/Movie';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import LiveTvIcon from '@mui/icons-material/LiveTv';

// Categories array jo 'query' parameter mein jayega
export const categories = [
    { name: 'All', icon: <HomeIcon /> },
    { name: 'Coding', icon: <CodeIcon /> },
    { name: 'Music', icon: <MusicNoteIcon /> },
    { name: 'Gaming', icon: <FitnessCenterIcon /> },
    { name: 'Movie', icon: <MovieIcon /> },
    { name: 'Trending', icon: <LiveTvIcon /> }, // 'Trending' bhi title mein search hoga
    { name: 'Sports', icon: <OndemandVideoIcon /> },
];

const Sidebar = ({ selectedCategory, setSelectedCategory }) => (
    <Stack
        direction="row"
        sx={{
            overflowY: "auto",
            height: { sx: 'auto', md: '95%' },
            flexDirection: { md: 'column' },
        }}
    >
        {categories.map((category) => (
            <Button
                key={category.name}
                // onClick mein category name set ho raha hai
                onClick={() => setSelectedCategory(category.name)} 
                className="category-btn"
                sx={{
                    borderRadius: '20px',
                    height: '40px',
                    justifyContent: 'flex-start',
                    margin: { md: '5px 0' },
                    padding: '8px 15px',
                    backgroundColor: category.name === selectedCategory && '#FC1503',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#FC1503',
                        color: 'white',
                    }
                }}
            >
                <span style={{ color: category.name === selectedCategory ? 'white' : 'red', marginRight: '15px' }}>
                    {category.icon}
                </span>
                <span style={{ opacity: category.name === selectedCategory ? '1' : '0.8' }}>
                    {category.name}
                </span>
            </Button>
        ))}
    </Stack>
);

export default Sidebar;