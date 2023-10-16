import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Button, Box, Typography, Grid, Select, MenuItem } from '@material-ui/core';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import CircularProgress from "@material-ui/core/CircularProgress";
import purple from '@material-ui/core/colors/purple';
import { pink } from '@material-ui/core/colors';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SocialHealthInfoPage from './SocialHealthInfoPage';

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import ScreenerQuestions from './ScreenerQuestions';
import hwfclogo from './hwfc-logo.png';
import mongoose from 'mongoose';
import TermsAndConditionsDialog from './TermsAndConditionsDialog';

import {
    MandatoryFieldCheck,
    ValidateEmail,
    ValidateName,
    ValidatePhoneNo
} from "../../helpers/utils/validation";

import PublicScreenerReport from './PublicScreenerReport';
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

    const [page, setPage] = useState(11);
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
    const options = ['HWFC Lab', 'WECCC', 'CARP', 'Media', 'Other'];

    const [isFormTouched, setIsFormTouched] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [reportsData, setReportsData] = useState({

        // Testing data

        "household2_size": "0",
        "community_activity_participate": "1",
        "life_satisfaction2": "6",
        "local_community_belonging": "1",
        "lack_companionship": "1",
        "feel_leftout": "2",
        "feel_isolated": "1",
        "con_que": "1"


    });

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
    // const [termsChecked, setTermsChecked] = useState(false);

    const [termsDialogOpen, setTermsDialogOpen] = useState(false);

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

            if (error.email == 'Cannot be empty' || error.email == '') { // email is not a required field
                error.email = '';
            }

            if (error.phone == 'cannot be empty' || error.email == '') { // phone is not a required field
                error.phone = ''
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

        // Test data
        // var data = {
        //     surveyTemplate: mongoose.Types.ObjectId("6327c88700c8944dc44dae38"),
        //     memberInfo: {
        //         name: "John Doe",
        //         email: "abc@abc.com",
        //         phone: "123456789",
        //         postalCode: "N9A 4N5",
        //     },
        //     source: "HWFC Lab",
        //     responseJSON: responseJSON
        // };


        try {
            // Send the data as a POST request using Axios with await
            const response = await axios({
                method: 'post',
                url: '/api/publicsurveys/create',
                headers: {
                    'Content-Type': 'application/json',
                },
                data: JSON.stringify(data),
                timeout: 5000
            })
            console.log('Data sent successfully!', response.data);
            setIsLoading(false);
            setIsSubmitted(true);

        } catch (error) {
            console.error('Error sending data:', error);
            setIsLoading(false);
            setIsSubmitted(false);

        }

    };

    const generateReport = () => {

        setReportsData({
            "household2_size": household_size,
            "community_activity_participate": community_participation,
            "life_satisfaction2": life_satisfaction,
            "local_community_belonging": community_belonging,
            "lack_companionship": lack_companionship,
            "feel_leftout": felt_left_out,
            "feel_isolated": isolation,
            "con_que": confidentiality
        });

        setPage(page + 1);

    }


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

        // if (errorMessages.email == 'Enter either email or phone number') {
        //     errorMessages.email = '';
        // }

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

    const openDialog = () => {
        setTermsDialogOpen(true);
    }

    const closeDialog = () => {
        setTermsDialogOpen(false);
    }

    const generatePDF = () => {

        const surveyHolder = document.getElementById("pdf");

        html2canvas(surveyHolder).then(function (canvas) {

            const doc = new jsPDF('p', 'px', [canvas.width, canvas.height]); // Use canvas dimensions for PDF

            const imgData = canvas.toDataURL('image/jpeg');

            const width = doc.internal.pageSize.getWidth();

            const height = doc.internal.pageSize.getHeight();

            doc.addImage(imgData, 'JPEG', 0, 60, width, height);

            doc.save('your-survey.pdf'); // Provide a desired filename for the PDF

        });

    };

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                margin: 0,
                padding: 0,
                bottom: 0,
                maxWidth: '100vw', // Take up the entire viewport width
                minHeight: '100vh', // Take up the entire viewport height
                backgroundColor: '#f0f0f0', // Set the background color
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                // justifyContent: 'center',
                overflow: "auto"
            }}
        >
            <Box
                bgcolor={pink[500]}
                color="#fff"
                textAlign="center"
                style={{
                    top: 0,
                    margin: 0,
                    // position: 'absolute',
                    width: '100%',
                    // minWidth: '100vw',
                    // zIndex: 1,
                    // 
                    padding: '24px 0',
                    alignItems: 'center',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}
            >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                    <a href="https://hwfc.ca/activation/"><img src={hwfclogo} alt="HWFC Logo" style={{ height: '40px' }} /></a>
                    <Typography variant="h6">Social Health Screener - Take the Survey</Typography>
                </div>
                <Typography variant="h2">How Good is Your Social Health?</Typography>
            </Box>
            <Box my={page == 11 ? 4 : 4} /> {/* Spacer */}

            {page == 11 ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    // minHeight="400px"
                    padding="16px"
                    bgcolor="#ffffff"
                    borderRadius="8px"
                    maxWidth="64rem"
                // width="100%"
                // height='100%'
                >
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Button variant="contained" color="primary" onClick={generatePDF} style={{ width: '200px', marginTop: '10px' }}>
                            Save as PDF
                        </Button>
                    </div>
                    <div id="pdf">
                        <PublicScreenerReport reportsData={reportsData} />
                    </div>
                    <Button variant="contained" color="primary" onClick={handleNext} style={{ width: '200px' }}>
                        What Next?
                    </Button>
                </Box>
            ) :
                < Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    // minHeight="400px"
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
                                <Button variant="contained" color="primary" onClick={generateReport} style={{ width: '200px' }}>
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

                    {page == -1 && (
                        <div style={{ padding: '32px' }}>
                            <IconButton onClick={() => setPage(1)} style={{ marginBottom: '16px' }}>
                                <ArrowBackIcon />
                            </IconButton>
                            <SocialHealthInfoPage />
                        </div>
                    )}


                    {page === 1 && (
                        <div style={{ padding: '32px' }}>
                            <Box width="100%">
                                <Typography variant="h6" gutterBottom style={{ textAlign: 'center', fontWeight: '400', whiteSpace: 'pre-line' }}>
                                    Social connection is the foundation of good health and is as fundamental a human need as food and water. Did you know that people with poor social health are sicker, less happy, and may even die earlier compared to others?
                                    <br /><br />
                                    Take our two-minute survey to help you understand risk factors and receive helpful information based on your personalized results.
                                </Typography>
                                <Box my={1} /> {/* Spacer */}
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
                                            error={errorMessages.phone == "" ? false : true} // Add error prop
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
                                <Box my={4} /> {/* Spacer */}
                                <Typography variant="subtitle1" gutterBottom style={{ textAlign: 'center', fontWeight: '400', whiteSpace: 'pre-line' }}>
                                    By clicking the "Next" button, I agree to be contacted in the future to receive helpful information about this topic. I also confirm I agree to HWFC Lab <span onClick={() => openDialog()} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>terms and conditions</span> regarding my personal information.
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom style={{ textAlign: 'center', fontWeight: '400', whiteSpace: 'pre-line' }}>
                                    <br></br>
                                    Not interested in a personalized report, but interested in learning more?
                                    <span onClick={() => setPage(-1)} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}> Click here</span> to learn why social health is important, common risks, and what you can do to protect yourself.
                                </Typography>
                                <TermsAndConditionsDialog open={termsDialogOpen} onClose={closeDialog} />
                            </Box>
                        </div>
                    )}
                    <ScreenerQuestions page={page} onOptionChange={handleOptionChange} />

                    {page < 9 && page > 0 && <Box textAlign="center" style={{ paddingBottom: '16px' }}> {/* Center the next button */}
                        <Box my={2} /> {/* Spacer */}
                        <Button disabled={!answered} variant="contained" color="primary" onClick={handleNext} style={{ width: '200px' }}>
                            Next
                        </Button>
                    </Box>}

                    {page == 9 && <Box textAlign="center" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px' }}>
                        <Box my={2} /> {/* Spacer */}
                        <Typography
                            variant="h6"
                            align="center"
                            gutterBottom
                        >
                            By clicking the "Submit Survey" button, I agree to be contacted in the future to receive helpful information about this topic. I also confirm I have reviewed and agree to HWFC Lab terms and conditions regarding collection of my personal information.
                        </Typography>
                        <Button variant="contained" color="primary" onClick={handleSubmit} style={{ width: '200px' }}>
                            Submit Survey
                        </Button>
                    </Box>}
                    {page == 12 && <Box textAlign="center" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px' }}>
                        <Typography
                            variant="h5"
                            align="center"
                            gutterBottom

                        >
                            Next Steps
                        </Typography>
                        <Typography
                            variant="body1"
                            align="left"
                            gutterBottom
                        >
                            Maintaining good social health and addressing social health concerns will improve your well-being along with your physical and mental health. Having trouble figuring out next steps?<br></br><br></br> CONTACT US at <a href="mailto:hwfc.lab@gmail.com" target="_blank" rel="noopener noreferrer">hwfc.lab@gmail.com</a> to talk to a trained Community Connector - we can help you set goals and find activities and resources to promote your health and address social risks.
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => { setPage(page - 1) }} style={{ width: '200px' }}>
                            Back to My Report
                        </Button>
                    </Box>}
                </Box>}
            <Box my={4} /> {/* Spacer */}
        </div >
    );
};

export default PublicScreenerSurvey;
