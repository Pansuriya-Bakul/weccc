import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

// ==================== Components ====================
import StatusMessage from '../../components/StatusMessage';
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


    const handleTogglePasswordVisibility = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    const handleAgreeCheckboxChange = (event) => {
        setAgreedToConsent(event.target.checked);
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {

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

        if (password !== confirmPassword) {
            formErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(formErrors);

        // Check if there are any errors
        if (Object.keys(formErrors).some((key) => formErrors[key])) {
            return;
        }
        // Form is valid, proceed with registration logic
        setIsSubmitting(true);

        axios.post('/api/users/selfRegister', formData)
            .then((response) => {
                // Handle the response from the server (if needed)
                console.log('Registration successful!', response.data);
                // You can do any post-registration actions here (e.g., redirect to a success page)
            })
            .catch((error) => {
                // Handle errors (if needed)
                console.error('Registration error:', error);
            })
            .finally(() => {
                setIsSubmitting(false);
            });


        // Simulate a delay for the registration process
        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);
    };

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
                    <FormControl margin="normal" required fullWidth>
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
                    <FormControl margin="normal" required fullWidth>
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
                        {errors.password && <StatusMessage color="error">{errors.password}</StatusMessage>}
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
                            <StatusMessage color="error">{errors.confirmPassword}</StatusMessage>
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
                        <StatusMessage color="error">{errors.general}</StatusMessage>
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
