import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Grid } from '@material-ui/core';
import purple from '@material-ui/core/colors/purple';

import ScreenerQuestions from './ScreenerQuestions';


const PublicScreenerSurvey = () => {

    const [page, setPage] = useState(10);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [zipCode, setZipCode] = useState('');

    // Validation status state for each field
    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [zipCodeError, setZipCodeError] = useState(false);
    const [answered, setAnswered] = useState(true);

    // State for the selected option
    const [household_size, setHousehold_size] = useState('');
    const [community_participation, setCommunity_participation] = useState('');
    const [life_satisfaction, setLife_satisfaction] = useState('');
    const [community_belonging, setCommunity_belonging] = useState('');
    const [lack_companionship, setLack_companionship] = useState('');
    const [felt_left_out, setFelt_left_out] = useState('');
    const [isolation, setIsolation] = useState('');
    const [confidentiality, setConfidentiality] = useState('');



    const handleOptionChange = (option) => {
        page === 2 && setHousehold_size(option);
        page === 3 && setCommunity_participation(option);
        page === 4 && setLife_satisfaction(option);
        page === 5 && setCommunity_belonging(option);
        page === 6 && setLack_companionship(option);
        page === 7 && setFelt_left_out(option);
        page === 8 && setIsolation(option);
        page === 9 && setConfidentiality(option);
        setAnswered(true);
        // console.log(life_satisfaction);
    };


    const handleNext = () => {
        // Perform validation here, and if valid, move to the next page
        if (page === 1) {
            // Check if the required fields are filled
            if (!firstName) {
                setFirstNameError(true);
            } else {
                setFirstNameError(false);
            }

            if (!lastName) {
                setLastNameError(true);
            } else {
                setLastNameError(false);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !email.match(emailRegex)) {
                setEmailError(true);
            } else {
                setEmailError(false);
            }

            if (!zipCode) {
                setZipCodeError(true);
            } else {
                setZipCodeError(false);
            }

            // Move to the next page only if all required fields are filled
            if (firstName && lastName && email && zipCode) {
                setPage((prevPage) => prevPage + 1);
                setAnswered(false);
            }
        } else {
            setPage((prevPage) => prevPage + 1);
            setAnswered(false);
        }
    };



    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100vw', // Take up the entire viewport width
                height: '100vh', // Take up the entire viewport height
                backgroundColor: '#f0f0f0', // Set the background color
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                bgcolor={purple[700]}
                color="#fff"
                textAlign="center"
                style={{
                    top: 0,
                    position: 'absolute',
                    width: '100vw',
                    height: '240px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                }}
            >
                <Typography variant="h2">Social Risk Survey</Typography>
            </Box>

            {/* Survey box container */}
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="400px"
                padding="16px"
                bgcolor="#ffffff"
                borderRadius="8px"
                marginTop="64px"
                maxWidth="60rem"
                width="90%"
            >
                {page == 10 && (
                    <Box width="80%" >
                        <Typography align="center" variant="h5" gutterBottom style={{ paddingBottom: "16px" }}>
                            Thank you for completing the survey!
                        </Typography>
                        <Typography align="center" variant="h6" gutterBottom style={{ paddingBottom: "16px", fontWeight: "400" }}>
                            Click the button below to view your results.
                        </Typography>
                        <Box my={2} /> {/* Spacer */}
                        <Box textAlign="center"> {/* Center the next button */}
                            <Button variant="contained" color="primary" onClick={handleNext} style={{ width: '200px' }}>
                                View Results
                            </Button>
                        </Box>

                    </Box>
                )}
                {page === 1 && (
                    <Box width="80%">
                        <Typography variant="h6" gutterBottom style={{ paddingBottom: "16px" }}>
                            Page 1 - Personal Information
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                    fullWidth
                                    error={firstNameError} // Add error prop
                                    helperText={firstNameError ? 'Please enter your first name.' : ''}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                    fullWidth
                                    error={lastNameError} // Add error prop
                                    helperText={lastNameError ? 'Please enter your last name.' : ''}
                                />
                            </Grid>
                        </Grid>
                        <Box my={2} /> {/* Spacer */}
                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    fullWidth
                                    error={emailError} // Add error prop
                                    helperText={emailError ? 'Please enter your email.' : ''}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="ZipCode"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    required
                                    fullWidth
                                    error={zipCodeError} // Add error prop
                                    helperText={zipCodeError ? 'Please enter your zip code.' : ''}
                                />
                            </Grid>
                        </Grid>

                    </Box>
                )}
                <ScreenerQuestions page={page} onOptionChange={handleOptionChange} />

                {page <= 9 && <Box textAlign="center"> {/* Center the next button */}
                    <Box my={4} /> {/* Spacer */}
                    <Button disabled={!answered} variant="contained" color="primary" onClick={handleNext} style={{ width: '200px' }}>
                        Next
                    </Button>
                </Box>}

                {/* Add other pages and their questions here */}
            </Box>
        </div>
    );
};

export default PublicScreenerSurvey;
