import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography } from '@mui/material';

const TopBar = () => {
  return (
    <AppBar position="sticky" sx={{ backgroundColor: 'black' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            fontSize: '1.5rem',
          }}
        >
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            CryptLearn
          </Link>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
