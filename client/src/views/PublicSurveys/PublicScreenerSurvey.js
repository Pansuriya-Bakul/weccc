import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Box, Typography, Grid, Select, MenuItem } from '@material-ui/core';
import CircularProgress from "@material-ui/core/CircularProgress";
import purple from '@material-ui/core/colors/purple';
import axios from 'axios';

import ScreenerQuestions from './ScreenerQuestions';
import hwfclogo from './hwfc-logo.png';
import mongoose from 'mongoose';

import {
    MandatoryFieldCheck,
    ValidateEmail,
    ValidateName,
    ValidatePhoneNo
} from "../../helpers/utils/validation";
import { error } from 'jquery';
import { set } from 'joi/lib/types/lazy';


// ================= Static Variables ================
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const nameRegex = /^[a-zA-Z]+$/;
const postalCodeRegex =
    /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

const initialErrorMessages = {
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    postalCode: "",
};


const PublicScreenerSurvey = () => {

    const [page, setPage] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Validation status state for each field
    const [errorMessages, seterrorMessages] = useState(initialErrorMessages);

    const [firstNameError, setFirstNameError] = useState(false);
    const [lastNameError, setLastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [postalCode, setPostalCode] = useState('');
    const [postalCodeError, setPostalCodeError] = useState(false);

    const [emailAndPhoneError, setEmailAndPhoneError] = useState(false);

    const [howDidYouHear, setHowDidYouHear] = useState('');
    const options = ['HWFC Lab', 'WECCC', 'CARP', 'media', 'other'];

    const [isFormTouched, setIsFormTouched] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

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
        if (page == 1) {
            let error = {
                email: ValidateEmail(email),
                firstName: ValidateName(firstName),
                lastName: ValidateName(lastName),
                phone: ValidatePhoneNo(phone),

            };

            if (error.email == 'Cannot be empty' && error.phone == 'Cannot be empty') {
                error.email = 'Enter either email or phone number';
                error.phone = '';
            } else if (error.email == "Cannot be empty") {
                error.email = '';
            } else if (error.phone == "Cannot be empty") {
                error.phone = '';
            }

            seterrorMessages({ ...errorMessages, ...error });
            if (
                error.email === "" &&
                error.firstName === "" &&
                error.lastName === "" &&
                error.phone === ""
            ) {
                setPage(page + 1);
            }
        } else {
            setPage(page + 1);
            setAnswered(false);
        }
        
    };


    // Handle submit button click event
    const handleSubmit = async () => {

        setIsLoading(true);
        setPage((prevPage) => prevPage + 1);

        const surveyTemplate = mongoose.Types.ObjectId("6327c88700c8944dc44dae38");

        let sanatized_firstName = firstName.trim().charAt(0).toUpperCase() + firstName.trim().slice(1).toLowerCase();
        let sanatized_lastName = lastName.trim().charAt(0).toUpperCase() + lastName.trim().slice(1).toLowerCase();
        let sanatized_email = email ? email.trim().toLowerCase() : "";
        let responseJSON = {
            "household2_size": household_size,
            "community_activity_participate": community_participation,
            "life_satisfaction2": life_satisfaction,
            "local_community_belonging": community_belonging,
            "lack_companionship": lack_companionship,
            "feel_leftout": felt_left_out,
            "feel_isolated": isolation,
            "con_que": confidentiality
        }

        var data = {
            surveyTemplate: surveyTemplate,
            memberInfo: {
                name: sanatized_firstName + " " + sanatized_lastName,
                email: sanatized_email,
                phone: phone,
                postalCode: postalCode,
            },
            source: howDidYouHear,
            responseJSON: responseJSON
        };

        try {
            // Send the data as a POST request using Axios with await
            const response = await axios.post('publicsurveys/create', data);
            console.log('Data sent successfully!', response.data);
            setIsLoading(false);
            setIsSubmitted(true);
            // ... Add any other logic or actions here ...
        } catch (error) {
            console.error('Error sending data:', error);
            setIsLoading(false);
            setIsSubmitted(false);

        }

    };

    const emailHandler = (event) => {
        const email = event.target.value.toLowerCase();
        const emailValidation = ValidateEmail(email);
        let emailError = '';

        if (emailValidation !== "" && emailValidation !== 'Cannot be empty') {
            setEmailError(true);
            seterrorMessages({ ...errorMessages, email: emailValidation });
        } else {
            setEmailError(false);
            seterrorMessages({ ...errorMessages, email: "" });
        }
        setEmail(email);
    }

    const phoneHandler = (event) => {
        const phone = event.target.value;
        const phoneValidation = ValidatePhoneNo(phone);
        let phoneError = '';

        if (errorMessages.email == 'Enter either email or phone number') {
            errorMessages.email = '';
        }

        if (phoneValidation !== "" && phoneValidation !== 'Cannot be empty') {
            setPhoneError(true);
            seterrorMessages({ ...errorMessages, phone: phoneValidation });
        } else {
            setPhoneError(false);
            seterrorMessages({ ...errorMessages, phone: "" });
        }
        setPhone(phone);
    }

    const firstNameHandler = (event) => {
        let error = ValidateName(event.target.value);
        if (error !== "") {
            setFirstNameError(true);
        } else {
            setFirstNameError(false);
        }
        seterrorMessages({ ...errorMessages, firstName: error });
        setFirstName(event.target.value);
    };

    const lastNameHandler = (event) => {
        let error = ValidateName(event.target.value);
        if (error !== "") {
            setLastNameError(true);
        } else {
            setLastNameError(false);
        }
        seterrorMessages({ ...errorMessages, lastName: error });
        setLastName(event.target.value);
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
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                    <img src={hwfclogo} alt="HWFC Logo" style={{ height: '40px' }} />
                    <Typography variant="h6">Social Health Screener - Take the Survey</Typography>
                </div>
                <Typography variant="h2">How Good is Your Social Health?</Typography>
            </Box>
            <Box my={8} /> {/* Spacer */}
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
                maxWidth="60rem"
                width="90%"
            >
                {isLoading && page == 10 ? (
                    // Show loading indicator and "Submitting" Typography
                    <Box width="80%">
                        <CircularProgress />
                        <Typography align="center" variant="h5" gutterBottom style={{ paddingBottom: "16px" }}>
                            Submitting your survey...
                        </Typography>
                    </Box>
                ) : isSubmitted && page == 10 ? (
                    // Show the content inside the box when isSubmitted is true and page is 10
                    <Box width="80%">
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
                ) : (
                    // Show the error message when isSubmitted is false or page is not 10
                    page == 10 && <Box width="80%">
                        <Typography align="center" variant="h5" gutterBottom style={{ paddingBottom: "16px" }}>
                            Error submitting your survey. Please try again.
                        </Typography>
                    </Box>
                )}


                {page === 1 && (
                    <div style={{ padding: '32px' }}>
                        <Box width="100%">
                            <Typography variant="h6" gutterBottom style={{ textAlign: 'center', fontWeight: '400', whiteSpace: 'pre-line' }}>
                                Social connection is the foundation of good health and is as fundamental a human need as food and water. Did you know that people with poor social health are sicker, less happy, and may even die earlier compared to others?
                                <br /><br />
                                Take our two-minute survey to help you understand risk factors and receive helpful information based on your personalized results.
                            </Typography>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="First Name"
                                        value={firstName}
                                        onChange={firstNameHandler}
                                        required
                                        fullWidth
                                        error={errorMessages.firstName == "" ? false : true} // Add error prop
                                        helperText={errorMessages.firstName}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Last Name"
                                        value={lastName}
                                        onChange={lastNameHandler}
                                        required
                                        fullWidth
                                        error={errorMessages.lastName == "" ? false : true} // Add error prop
                                        helperText={errorMessages.lastName}
                                    />
                                </Grid>
                            </Grid>
                            <Box my={1} /> {/* Spacer */}
                            <Grid container spacing={4} >
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={emailHandler}
                                        fullWidth
                                        error={errorMessages.email == "" ? false : true} // Add error prop
                                        helperText={errorMessages.email}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Phone Number"
                                        value={phone}
                                        onChange={phoneHandler}
                                        fullWidth
                                        error={errorMessages.phone==""? false : true} // Add error prop
                                        helperText={errorMessages.phone}
                                    />
                                </Grid>
                            </Grid>
                            <Box my={1} /> {/* Spacer */}
                            <Grid container spacing={4} >
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Postal Code"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        // error={postalCodeError} // Add error prop
                                        // helperText={postalCodeError ? 'Enter a valid postal code.' : ''}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        label="How did you hear about this?"
                                        value={howDidYouHear}
                                        onChange={(e) => setHowDidYouHear(e.target.value)}
                                        fullWidth
                                    >
                                        {options.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {option}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>

                        </Box>
                    </div>
                )}
                <ScreenerQuestions page={page} onOptionChange={handleOptionChange} />

                {page < 9 && <Box textAlign="center" style={{ paddingBottom: '16px' }}> {/* Center the next button */}
                    <Box my={2} /> {/* Spacer */}
                    <Button disabled={!answered} variant="contained" color="primary" onClick={handleNext} style={{ width: '200px' }}>
                        Next
                    </Button>
                </Box>}

                {page == 9 && <Box textAlign="center" style={{ paddingBottom: '16px' }}> {/* Center the next button */}
                    <Box my={2} /> {/* Spacer */}
                    <Button disabled={!answered} variant="contained" color="primary" onClick={handleSubmit} style={{ width: '200px' }}>
                        Submit Survey
                    </Button>
                </Box>}

                {/* Add other pages and their questions here */}
            </Box>
        </div>
    );
};

export default PublicScreenerSurvey;
