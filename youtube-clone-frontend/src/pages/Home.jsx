import React from 'react';
import { Box, Typography } from '@mui/material';

// File ka naam yahan likhein (e.g., 'Home', 'VideoDetail')
const PageName = "Home"; 

const PageComponent = () => {
  return (
    <Box sx={{ p: 2, minHeight: '90vh', color: 'white' }}>
      <Typography variant="h4" color="white">
        {PageName} Page - Ready to build!
      </Typography>
    </Box>
  );
};

export default PageComponent;