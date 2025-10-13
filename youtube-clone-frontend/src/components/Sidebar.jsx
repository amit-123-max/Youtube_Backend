// src/components/Sidebar.jsx

import React from 'react';
import { Stack, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import HistoryIcon from '@mui/icons-material/History';

// Dummy Categories
const categories = [
    { name: 'All', icon: <HomeIcon /> },
    { name: 'Trending', icon: <SubscriptionsIcon /> },
    { name: 'Gaming', icon: <HistoryIcon /> },
    { name: 'Music', icon: <HomeIcon /> },
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