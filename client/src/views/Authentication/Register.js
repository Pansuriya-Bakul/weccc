import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import axios from 'axios';

// ==================== Components ====================
import ConsentStatement from './ConsentStatement';
import {
    ValidateEmail,
    ValidateFullName,
    ValidatePassword,
    ValidatePhoneNo,
    ValidatePostalCode,
    ValidateCity
} from "../../helpers/utils/validation";

// ==================== MUI ====================
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { IconButton, InputAdornment } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';


const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block',
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(6))]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(5),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(3)}px ${theme.spacing(5)}px ${theme.spacing(5)}px`,
        boxShadow: `
    0px 3px 13px -1px rgba(0, 0, 0, 0.2), /* Top Shadow */
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), /* Middle Shadow */
    0px 1px 3px 0px rgba(0, 0, 0, 0.12)  /* Bottom Shadow */
  `,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
    spinner: {
        color: theme.palette.primary.main,
        position: 'absolute',
        left: '50%',
        marginTop: 0,
        marginLeft: -12,
    },
    consent: {
        maxHeight: '150px',
        overflowY: 'scroll',
        border: `1px solid ${theme.palette.primary.main}`,
        padding: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    agreeButton: {
        marginTop: theme.spacing(2),
    },
    errorMessage: {
        color: 'red',
        marginTop: theme.spacing(1),
    },
});

const Register = ({ classes }) => {

    const [formData, setFormData] = useState({
        name: '',
        city: '',
        postalCode: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [agreedToConsent, setAgreedToConsent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);


    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleAgreeCheckboxChange = (event) => {
        setAgreedToConsent(event.target.checked);
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        let trimmedValue = value;
        if (name === 'name' || name === 'city' || name === 'email') {
            trimmedValue = value.trimStart(); // Trim leading spaces
        }
        setFormData({ ...formData, [name]: trimmedValue });
    };

    const handleSubmit = async (event) => {

        event.preventDefault();
        // Perform form validation
        const formErrors = {};
        const { name, city, postalCode, email, phone, password, confirmPassword } = formData;

        formErrors.name = ValidateFullName(name);
        formErrors.email = ValidateEmail(email);
        formErrors.phone = ValidatePhoneNo(phone);
        formErrors.password = ValidatePassword(password);
        if (city) {
            formErrors.city = ValidateCity(city);
        }
        if (postalCode) {
            formErrors.postalCode = ValidatePostalCode(postalCode);
        }

        if (!email && !phone) {
            formErrors.general = 'Please enter either Email or Phone number.';
        } else {
            // Clear the error for phone and email fields if either one is entered
            if (email) {
                formErrors.phone = '';
            }
            if (phone) {
                formErrors.email = '';
            }
        }

        if (password !== confirmPassword) {
            formErrors.confirmPassword = "Passwords do not match";
        }
        console.log(formErrors)
        setErrors(formErrors);

        // Check if there are any errors
        if (Object.keys(formErrors).some((key) => formErrors[key])) {
            return;
        }
        // Form is valid, proceed with registration logic
        setIsSubmitting(true);

        const requestData = {
            email: email || undefined, // Omit email if it's empty
            phone: phone || undefined, // Omit phone if it's empty
            name,
            password,
            phone,
            city: city || undefined, // Omit city if it's empty
            postalCode: postalCode || undefined, // Omit postalCode if it's empty
        };

        try {
            const response = await axios.post('/api/users/selfRegister', requestData);
            console.log('Registration successful!', response.data);
            alert('Registration successful! Please log in to continue.');
            setRegistrationSuccess(true);
            // You can do any post-registration actions here (e.g., redirect to a success page)
        } catch (error) {
            if (error.response && error.response.status === 400) {
                if (error.response.data.error === 'Email already registered') {
                    setErrors({ emailError: 'Email is already registered. Please use a different email address.' });
                } else if (error.response.data.error === 'Phone number already registered') {
                    setErrors({ phoneError: 'Phone number is already registered. Please use a different phone number.' });
                } else {
                    console.error('Registration error:', error);
                    setErrors({ general: 'An error occurred. Please try again later.' });
                }
            } else {
                console.error('Registration error:', error);
                setErrors({ general: 'An error occurred. Please try again later.' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (registrationSuccess) {
        return <Redirect to="/" />;
    }

    return (
        <div className={classes.main}>
            <Paper className={classes.paper}>
                <Typography component="h1" variant="h5">
                    REGISTER
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <Input
                            id="name"
                            name="name"
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    {errors.name && (
                        <Typography variant="body2" className={classes.errorMessage}>
                            {errors.name}
                        </Typography>
                    )}
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="city">City</InputLabel>
                        <Input
                            id="city"
                            name="city"
                            autoComplete="city"
                            value={formData.city}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    {errors.city && (
                        <Typography variant="body2" className={classes.errorMessage}>
                            {errors.city}
                        </Typography>
                    )}
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="postalCode">Postal Code</InputLabel>
                        <Input
                            id="postalCode"
                            name="postalCode"
                            autoComplete="postalCode"
                            value={formData.postalCode}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    {errors.postalCode && (
                        <Typography variant="body2" className={classes.errorMessage}>
                            {errors.postalCode}
                        </Typography>
                    )}
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    {errors.emailError && (
                        <Typography variant="body2" className={classes.errorMessage}>
                            {errors.emailError}
                        </Typography>
                    )}
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="phone">Phone</InputLabel>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </FormControl>
                    {errors.phoneError && (
                        <Typography variant="body2" className={classes.errorMessage}>
                            {errors.phoneError}
                        </Typography>
                    )}
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <Input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleInputChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleTogglePasswordVisibility}
                                    >
                                        {showPassword ? <Icon>visibility</Icon> : <Icon>visibility_off</Icon>}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {errors.password && <Typography variant="body2" className={classes.errorMessage}>{errors.password}</Typography>}
                    </FormControl>

                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                        {errors.confirmPassword && (
                            <Typography variant="body2" className={classes.errorMessage}>{errors.confirmPassword}</Typography>
                        )}
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <div className={classes.consent}>
                            <Typography variant="body2">
                                <ConsentStatement />
                            </Typography>
                        </div>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={agreedToConsent}
                                    onChange={handleAgreeCheckboxChange}
                                    color="primary"
                                />
                            }
                            label={
                                <>
                                    I Agree <span style={{ color: 'red' }}>*</span>
                                </>
                            }
                        />
                    </FormControl>
                    {errors.general && (
                        <Typography variant="body2" className={classes.errorMessage}>{errors.general}</Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={isSubmitting || !agreedToConsent} // Disable submit button until consent is agreed
                    // onClick={handleSubmit}
                    >
                        Register
                        {isSubmitting && <CircularProgress size={24} className={classes.spinner} />}
                    </Button>
                    <Box mt={2}>
                        <Typography variant="body2" color="primary" style={{ textAlign: 'right' }}>
                            Already have an account?{' '}
                            <Link to="/" style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>
                                Login here
                            </Link>
                        </Typography>
                    </Box>
                </form>
            </Paper>
        </div>
    );
};

export default withStyles(styles)(Register);
