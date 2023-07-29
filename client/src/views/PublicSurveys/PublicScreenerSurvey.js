import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@material-ui/core';

// Header component for the large heading
const Header = () => {
  return (
    <Typography variant="h4" align="center" gutterBottom>
      Social Risk Survey
    </Typography>
  );
};

const PublicScreenerSurvey = () => {
  const [page, setPage] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleNext = () => {
    // Perform validation here, and if valid, move to the next page
    if (page === 1 && firstName && lastName && email && zipCode) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" marginTop="24px">
      {/* Include the Header component at the top */}
      <Header />

      {page === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Page 1 - Personal Information
          </Typography>
          <TextField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="ZipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
        </Box>
      )}

      {/* Add other pages and their questions here */}
    </Box>
  );
};

export default PublicScreenerSurvey;
