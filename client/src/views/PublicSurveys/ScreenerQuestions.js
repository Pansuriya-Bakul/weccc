import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Container, Grid } from '@material-ui/core';
import purple from '@material-ui/core/colors/purple';
import { Radio, RadioGroup, FormControlLabel, FormControl, Rating } from '@material-ui/core';


const ScreenerQuestions = (props) => {
    const page = props.page;
    const onOptionChange = props.onOptionChange;

    const handleChange = (event, value) => {
        // Call the callback function with the selected option
        onOptionChange(value);
    };

    const [rating, setRating] = useState(5); // Default rating value

    const handleRatingChange = (event, value) => {
        setRating(value);
    };



    return (
        <>
            {page === 2 && (
                <Box width="80%">
                    <FormControl component="fieldset">
                        <Typography variant="h6" align="center" style={{ marginBottom: '1rem' }}>
                            How many people do you live with?
                        </Typography>
                        <RadioGroup name="livingWith" onChange={(event) => handleChange(event, event.target.value)}>
                            <FormControlLabel value="0" control={<Radio />} label="Live alone" />
                            <FormControlLabel value="1" control={<Radio />} label="1 person" />
                            <FormControlLabel value="2" control={<Radio />} label="2 people" />
                            <FormControlLabel value="3" control={<Radio />} label="3 people" />
                            <FormControlLabel value="4" control={<Radio />} label="4 or more people" />
                        </RadioGroup>
                    </FormControl>
                </Box>

            )}

            {page === 3 && (
                <Box width="80%">
                    <FormControl component="fieldset">
                        <Typography variant="h6" align="center" style={{ marginBottom: '1rem' }}>
                            Do you participate in community activities as much as you would like?
                        </Typography>
                        <RadioGroup name="livingWith" onChange={(event) => handleChange(event, event.target.value)}>
                            <FormControlLabel value="1" control={<Radio />} label="Yes" />
                            <FormControlLabel value="0" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Box>

            )}

            {page === 4 && (
                <Box width="80%">
                    <FormControl component="fieldset">
                        <Typography variant="h6" align="center" style={{ marginBottom: '1rem' }}>
                            Using a scale of 1 to 10 where 1 means "Very dissatisfied" and 10 means "Very satisfied", how do you feel about your life as a whole right now?
                        </Typography>
                        <RadioGroup
                            row
                            onChange={(event) => handleChange(event, parseInt(event.target.value, 10))}
                            style={{ display: 'flex', justifyContent: 'center' }}
                        >
                            {[...Array(10)].map((_, index) => (
                                <FormControlLabel
                                    key={index + 1}
                                    value={(index + 1).toString()}
                                    control={<Radio />}
                                    label={index + 1}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                </Box>

            )}

            {page === 5 && (
                <Box width="80%">
                    <FormControl component="fieldset">
                        <Typography variant="h6" align="center" style={{ marginBottom: '1rem' }}>
                            How would you describe your sense of belonging to your local community?
                            Would you say it is:
                        </Typography>
                        <RadioGroup name="livingWith" onChange={(event) => handleChange(event, event.target.value)}>
                            <FormControlLabel value="3" control={<Radio />} label="Very strong" />
                            <FormControlLabel value="2" control={<Radio />} label="Somewhat strong" />
                            <FormControlLabel value="1" control={<Radio />} label="Somewhat weak" />
                            <FormControlLabel value="0" control={<Radio />} label="Very weak" />
                        </RadioGroup>
                    </FormControl>
                </Box>

            )}

            {page === 6 && (
                <Box width="80%">
                    <FormControl component="fieldset">
                        <Typography variant="h6" align="center" style={{ marginBottom: '1rem' }}>
                            How often do you feel that you lack companionship?
                        </Typography>
                        <RadioGroup name="livingWith" onChange={(event) => handleChange(event, event.target.value)}>
                            <FormControlLabel value="0" control={<Radio />} label="Hardly Ever" />
                            <FormControlLabel value="1" control={<Radio />} label="Sometimes" />
                            <FormControlLabel value="2" control={<Radio />} label="Often" />
                        </RadioGroup>
                    </FormControl>
                </Box>

            )}

            {page === 7 && (
                <Box width="80%">
                    <FormControl component="fieldset">
                        <Typography variant="h6" align="center" style={{ marginBottom: '1rem' }}>
                            How often do you feel left out?
                        </Typography>
                        <RadioGroup name="livingWith" onChange={(event) => handleChange(event, event.target.value)}>
                            <FormControlLabel value="0" control={<Radio />} label="Hardly Ever" />
                            <FormControlLabel value="1" control={<Radio />} label="Sometimes" />
                            <FormControlLabel value="2" control={<Radio />} label="Often" />
                        </RadioGroup>
                    </FormControl>
                </Box>

            )}

            {page === 8 && (
                <Box width="80%">
                    <FormControl component="fieldset">
                        <Typography variant="h6" align="center" style={{ marginBottom: '1rem' }}>
                            How often do you feel isolated from others?
                        </Typography>
                        <RadioGroup name="livingWith" onChange={(event) => handleChange(event, event.target.value)}>
                            <FormControlLabel value="0" control={<Radio />} label="Hardly Ever" />
                            <FormControlLabel value="1" control={<Radio />} label="Sometimes" />
                            <FormControlLabel value="2" control={<Radio />} label="Often" />
                        </RadioGroup>
                    </FormControl>
                </Box>

            )}

            {page === 9 && (
                <Box width="80%">
                    <FormControl component="fieldset">
                        <Typography variant="h5" align="center" style={{ marginBottom: '1rem' }}>
                            Confidentiality Question
                        </Typography>
                        <Typography variant="h6" align="center" style={{ marginBottom: '1rem' }}>
                            Do you agree to be contacted in the future to receive your private and confidential personal results of the Neighbours mini screening questions, along with suggested community resources, programs and support options?
                        </Typography>
                        <RadioGroup name="livingWith" onChange={(event) => handleChange(event, event.target.value)}>
                            <FormControlLabel value="1" control={<Radio />} label="Yes" />
                            <FormControlLabel value="0" control={<Radio />} label="No" />
                        </RadioGroup>
                    </FormControl>
                </Box>

            )}
        </>
    )
}

export default ScreenerQuestions;