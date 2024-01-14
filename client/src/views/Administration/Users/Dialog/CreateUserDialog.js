// ================================================
// Code associated with SaveChapterDialog
// ================================================
import React, { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types"; //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from "../../../../helpers/models/AlertType";

import post from "../../../../helpers/common/post";
import get from "../../../../helpers/common/get";

// ==================== MUI =========================
import { makeStyles } from "@material-ui/core/styles"; // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from "@material-ui/core/Grid"; // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from "@material-ui/core/Box"; // Padding and margins

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import Collapse from "@material-ui/core/Collapse";

import TextField from "@material-ui/core/TextField";

import Input from '@material-ui/core/Input';
import { IconButton, InputAdornment } from '@material-ui/core';

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@material-ui/core";

import CircularProgress from "@material-ui/core/CircularProgress";

// ==================== MUI Icons ====================
import AddBoxOutlinedIcon from "@material-ui/icons/AddBoxOutlined";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import NavigateBeforeIcon from "@material-ui/icons/NavigateBefore";
import LockIcon from '@material-ui/icons/LockOutlined';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import {
  MandatoryFieldCheck,
  ValidateEmail,
  ValidateName,
  ValidatePassword,
  ValidatePhoneNo
} from "../../../../helpers/utils/validation";

// ==================== MUI Styles ===================

const useStyles = makeStyles(
  (
    theme //Notice the hook useStyles
  ) => ({
    root: {
      flexGrow: 1, // CSS determined this way, flexbox properties
      height: "100%",
    },
    rootGrid: {
      height: "100%",
    },
  })
);



// ================= Static Variables ================
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const passwordRegex = /^.{4,}$/;
const nameRegex = /^[a-zA-Z]+$/;
const streetRegex = /^(\d{1,})[a-zA-Z0-9\s]+(\.)?$/; //WIP currently accepts number only
const postalCodeRegex =
  /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

// ================= Static Functions ================

// ======================== React Modern | Functional Component ========================
const initialErrorMessages = {
  email: "",
  password: "",
  confirmPassword: "",
  firstName: "",
  lastName: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  gender2: "",
  language: "",
  language2: "",
  role: "",
  street: "",
  postalCode: "",
  city: "",
  province: "",
  country: "",
};
const CreateUserDialog = (props) => {
  // Notice the arrow function... regular function()  works too

  // Variables ===

  // Style variable declaration
  const classes = useStyles();

  // Declaration of Stateful Variables ===
  const {
    appState,
    setParentAlert,
    getParentData,
    createUserDialog,
    setCreateUserDialog,
    createUserDialogExecuting,
    setCreateUserDialogExecuting,
  } = props;
  const [errorMessages, seterrorMessages] = useState(initialErrorMessages);
  // console.log(errorMessages);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailDup, setEmailDup] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);

  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [dateOfBirthError, setDateOfBirthError] = useState(false);

  const [gender, setGender] = useState("");
  const [genderError, setGenderError] = useState(false);

  const [gender2, setGender2] = useState("");
  const [isGender2, setIsGender2] = useState("");
  const [gender2Error, setGender2Error] = useState(false);

  const [language, setLanguage] = useState("");
  const [languageError, setLanguageError] = useState(false);

  const [language2, setLanguage2] = useState("");
  const [isLanguage2, setIsLanguage2] = useState(false);
  const [language2Error, setLanguage2Error] = useState(false);

  const [role, setRole] = useState("");
  const [roleError, setRoleError] = useState(false);

  const [enabled, setEnabled] = useState(true);
  const [status, setStatus] = useState('active');

  const [originOfContact, setOriginOfContact] = useState("");
  const [originOfContact2, setOriginOfContact2] = useState("");
  const [originOfContactOtherFlag, setOriginOfContactOtherFlag] = useState(false);

  const [facility, SetFacility] = useState("");




  // Non-Required Parameters ========================================

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneDup, setPhoneDup] = useState(false);

  const [street, setStreet] = useState("");
  const [streetError, setStreetError] = useState(false);
 
  const [postalCode, setPostalCode] = useState("");
  const [postalCodeError, setPostalCodeError] = useState(false);

  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState(false);

  const [province, setProvince] = useState("");
  const [provinceError, setProvinceError] = useState(false);

  const [country, setCountry] = useState("");
  const [countryError, setCountryError] = useState(false);

  const [page, setPage] = useState(0);

  const [referralDetails, setReferralDetails] = useState("");

  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [passwordVisibility2, setPasswordVisibility2] = useState(false);

  // Functions ===

  const createUser = useCallback(() => {
    let sanatized_firstName =
      firstName.trim().charAt(0).toUpperCase() +
      firstName.trim().slice(1).toLowerCase();
    let sanatized_lastName =
      lastName.trim().charAt(0).toUpperCase() +
      lastName.trim().slice(1).toLowerCase();

    let sanatized_language2 =
      language2.trim().charAt(0).toUpperCase() +
      language2.trim().slice(1).toLowerCase();
    let sanatized_gender2 =
      gender2.trim().charAt(0).toUpperCase() +
      gender2.trim().slice(1).toLowerCase();

    let sanatized_city =
      city.trim().charAt(0).toUpperCase() + city.trim().slice(1).toLowerCase(); // Does not take into account capitalizing multiple word named cities or towns

    var data = {
      email: email,
      role: role,
      password: password,
      enabled: enabled,
      facilityId: appState.facilityId,
      originOfContact: ((originOfContact === 'Other')? originOfContact2 : originOfContact) ,
      referralDetails: referralDetails,
      // facility: facility,
      
      info: {
        name: sanatized_firstName + " " + sanatized_lastName,
        gender: gender == "NonBinary" && isGender2 ? sanatized_gender2 : gender,
        dateOfBirth: new Date(dateOfBirth),
        phone: phone,
        language:
          language == "Other" && isLanguage2 ? sanatized_language2 : language,
        address: {
          street: street,
          city: sanatized_city,
          state: province,
          code: postalCode,
          country: country,
        },
      },
      status: status,
    };

    post("users/register", appState.token, data, (error, response) => {
      if (error) {
        setParentAlert(
          new AlertType(
            "Unable create user. Please refresh and try again.",
            "error"
          )
        );
      } else {
        if (response.status === 201) {
          getParentData();
          resetCreateForm();
          setParentAlert(new AlertType("User created.", "success"));
        } else {
          setParentAlert(
            new AlertType(
              "Unable create user. Please refresh and try again.",
              "error"
            )
          );
        }
      }
    });
  }, [
    appState,
    resetCreateForm,
    email,
    password,
    firstName,
    lastName,
    phone,
    enabled,
    status,
    role,
    gender,
    isGender2,
    gender2,
    language,
    isLanguage2,
    language2,
    dateOfBirth,
    street,
    city,
    postalCode,
    province,
    country,
    originOfContact,
    originOfContactOtherFlag,
    referralDetails,
    // facility
  ]);

  const resetCreateForm = useCallback(() => {
    setEmail("");
    setEmailError(false);

    setPassword("");
    setPasswordError(false);

    setConfirmPassword("");
    setConfirmPasswordError(false);

    setFirstName("");
    setFirstNameError(false);

    setLastName("");
    setLastNameError(false);

    setPhone("");
    setPhoneError(false);

    setRole("");
    setRoleError(false);

    setGender("");
    setGenderError(false);

    setIsGender2(false);
    setGender2("");
    setGender2Error(false);

    setLanguage("");
    setLanguageError(false);

    setIsLanguage2(false);
    setLanguage2("");
    setLanguage2Error(false);

    setDateOfBirth("");
    setDateOfBirthError(false);

    setStreet("");
    setStreetError(false);

    setCity("");
    setCityError(false);

    setPostalCode("");
    setPostalCodeError(false);

    setProvince("");
    setProvinceError(false);

    setCountry("");
    setCountryError(false);

    setPage(0);
  }, [
    setEmail,
    setEmailError,
    setPassword,
    setPasswordError,
    setConfirmPassword,
    setConfirmPasswordError,
    setFirstName,
    setFirstNameError,
    setLastName,
    setLastNameError,
    setPhone,
    setPhoneError,
    setRole,
    setRoleError,
    setGender,
    setGenderError,
    setIsGender2,
    setGender2,
    setGender2Error,
    setLanguage,
    setLanguageError,
    setIsLanguage2,
    setLanguage2,
    setLanguage2Error,
    setDateOfBirth,
    setDateOfBirthError,
    setStreet,
    setStreetError,
    setCity,
    setCityError,
    setPostalCode,
    setPostalCodeError,
    setProvince,
    setProvinceError,
    setCountry,
    setCountryError,
    setPage,
  ]);

  const closeHandler = useCallback(() => {
    setCreateUserDialog(false);
  }, []);

  const createHandler = () => {
    if (page == 3) {
      let error = {
        province: "",
          // MandatoryFieldCheck(province) !== ""
          //   ? MandatoryFieldCheck(province)
          //   : "",
        country: "",
          // MandatoryFieldCheck(country) !== ""
          //   ? MandatoryFieldCheck(country)
          //   : "",
        street: "",
          // MandatoryFieldCheck(street) !== "" ? MandatoryFieldCheck(street) : "",
        city: "",
        // MandatoryFieldCheck(city) !== "" ? MandatoryFieldCheck(city) : "",
        postalCode: ""
          // MandatoryFieldCheck(postalCode) !== ""
          //   ? MandatoryFieldCheck(postalCode)
          //   : "",
      };
      seterrorMessages({ ...errorMessages, ...error });
      if (
        error.province === "" &&
        error.country === "" &&
        error.street === "" &&
        error.city === "" &&
        error.postalCode === ""
      ) {
        setCreateUserDialogExecuting(true);
        createUser();
        setCreateUserDialogExecuting(false);
        setCreateUserDialog(false);
      }
    }
  };

  const navigateBack = () => {
    setPage(page - 1);
  };

  const navigateNext = () => {
    // add validation
    switch (page) {
      case 0: {
        let error = {
          email: (ValidateEmail(email) == '') ? (emailDup ? 'Email already exists' : '') : ValidateEmail(email),
          password: ValidatePassword(password),
          confirmPassword:
            ValidatePassword(confirmPassword) === ""
              ? confirmPassword !== password
                ? "Password must be matching"
                : ""
              : ValidatePassword(confirmPassword),
          firstName: ValidateName(firstName),
          lastName: ValidateName(lastName),
          phone: (ValidatePhoneNo(phone) == '') ? (phoneDup ? 'Phone number already exists' : '') : ValidatePhoneNo(phone),
        };

        if(error.email == 'Cannot be empty' && error.phone == 'Cannot be empty'){
          error.email = 'Enter either email or phone number';
          error.phone = '';
        } else if (error.email == "Cannot be empty") {
          error.email = '';
        } else if (error.phone == "Cannot be empty") {
          error.phone = "";
        }

        seterrorMessages({ ...errorMessages, ...error });
        if (
          error.email === "" &&
          error.password === "" &&
          error.confirmPassword === "" &&
          error.firstName === "" &&
          error.lastName === "" &&
          error.phone === "" &&
          confirmPassword === password
        ) {
          setPage(page + 1);
        }
        break;
      }
      case 1: {
        let error = {
          language: "",
            // MandatoryFieldCheck(language) !== ""
            //   ? MandatoryFieldCheck(language)
            //   : "",
          gender:"",
            // MandatoryFieldCheck(gender) !== ""
            //   ? MandatoryFieldCheck(gender)
            //   : "",
          language2:
            language === "Other" ? ""
              // ? MandatoryFieldCheck(language2) !== ""
              //   ? MandatoryFieldCheck(language2)
              //   : ""
              : "",
          gender2:
            gender === "NonBinary" ? ""
              // ? MandatoryFieldCheck(gender2) !== ""
              //   ? MandatoryFieldCheck(gender2)
              //   : ""
              : "",
        };
        seterrorMessages({ ...errorMessages, ...error });
        if (
          error.language === "" &&
          error.gender === "" &&
          error.language2 === "" &&
          error.gender2 === ""
        ) {
          setPage(page + 1);
        }
        break;
      }
      case 2: {
        let error = {
          dateOfBirth: "",
            // MandatoryFieldCheck(dateOfBirth) !== ""
            //   ? MandatoryFieldCheck(dateOfBirth)
            //   : "",
          role:
            MandatoryFieldCheck(role) !== "" ? MandatoryFieldCheck(role) : "",
        };
        seterrorMessages({ ...errorMessages, ...error });
        if (error.dateOfBirth === "" && error.role === "") {
          setPage(page + 1);
        }
        break;
      }

      default:
        break;
    }
  };



  const emailHandler = (event) => {
    const email = event.target.value.toLowerCase();
    const emailValidation = ValidateEmail(email);
    let emailError = '';

    
    
    if (emailValidation !== "" && emailValidation !== 'Cannot be empty') {
      setEmailError(true);
      seterrorMessages({...errorMessages, email: emailValidation});
    } else if (email.length>0) {
      let data = { email: email };
      post("users/checkdups", appState.token, data, (error, response) => {
        if (response.status === 200) {
          if (response.data.exists == true) {
            emailError = 'Email already exists';
            setEmailDup(true);
            setEmailError(true);
          } else {
            setEmailDup(false);
            setEmailError(false);
          }
        } else {
          emailError = 'Error checking email';
          // console.log(emailError);
          setEmailError(true);
        }
        seterrorMessages({...errorMessages, email: emailValidation ? emailValidation : emailError});
      });
    } else {
      setEmailError(false);
      seterrorMessages({...errorMessages, email: ""});
    }
    setEmail(email);
    // setEmailError(!!emailError);
  };
  
  const phoneHandler = (event) => {
    const phone = event.target.value;
    const phoneValidation = ValidatePhoneNo(phone);
    let phoneError = '';

    if(errorMessages.email == 'Enter either email or phone number'){
      errorMessages.email = '';
    }
    
    if (phoneValidation !== "" && phoneValidation !== 'Cannot be empty') {
      setPhoneError(true);
      seterrorMessages({...errorMessages, phone: phoneValidation});
    } else if (phone.length>0) {
      let data = { phone: phone };
      post("users/checkdups", appState.token, data, (error, response) => {
        if (response.status === 200) {
          if (response.data.exists == true) {
            phoneError = 'Phone number already exists';
            setPhoneDup(true);
            setPhoneError(true);
          } else {
            phoneError = '';
            setPhoneDup(false);
            setPhoneError(false);
          }
        } else {
          phoneError = 'Error checking phone number';
          // console.log(emailError);
          setPhoneError(true);
        }
        seterrorMessages({...errorMessages, phone: phoneValidation ? phoneValidation : phoneError});
      });
    } else {
      setPhoneError(false);
      seterrorMessages({...errorMessages, phone: ""});
    }
    setPhone(phone);
    // setEmailError(!!emailError);
  };
  

  const passwordHandler = (event) => {
    //   if (passwordRegex.test(String(event.target.value))) {
    //     setPasswordError(false);
    //   } else {
    //     setPasswordError(true);
    //   }
    let error = ValidatePassword(event.target.value);
    if (error !== "") {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    seterrorMessages({ ...errorMessages, password: error });
    setPassword(event.target.value);
  };

  const confirmPasswordHandler = (event) => {
    //   if (event.target.value != password) {
    //     setConfirmPasswordError(true);
    //   } else {
    //     setConfirmPasswordError(false);
    //   }
    let error = ValidatePassword(event.target.value);
    if (error !== "") {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
    seterrorMessages({ ...errorMessages, confirmPassword: error });
    setConfirmPassword(event.target.value);
  };

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

  // const phoneHandler = (event) => {
  //   let error = ValidatePhoneNo(event.target.value);
  //   if (error !== "") {
  //     setPhoneError(true);
  //   } else {
  //     setPhoneError(false);
  //   }
  //   seterrorMessages({ ...errorMessages, phone: error });
  //   setPhone(event.target.value);
  // };

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

  const dateOfBirthHandler = (event) => {
    setDateOfBirth(event.target.value);
  };

  const genderHandler = (event) => {
    setGender(event.target.value);
  };

  const gender2Handler = (event) => {
    setGender2(event.target.value);
  };

  const languageHandler = (event) => {
    setLanguage(event.target.value);
  };

  const language2Handler = (event) => {
    setLanguage2(event.target.value);
  };

  const roleHandler = (event) => {
    setRole(event.target.value);
  };

  const streetHandler = (event) => {
    //   if (streetRegex.test(String(event.target.value))) {
    //     setStreetError(false);
    //   } else {
    //     setStreetError(true);
    //   }
    // let error = MandatoryFieldCheck(event.target.value);
    let error = ""
    if (error !== "") {
      setStreetError(true);
    } else {
      setStreetError(false);
    }
    seterrorMessages({ ...errorMessages, street: error });
    setStreet(event.target.value);
  };

  const cityHandler = (event) => {
    // let error = MandatoryFieldCheck(event.target.value);
    let error = ""
    if (error !== "") {
      setCityError(true);
    } else {
      setCityError(false);
    }
    seterrorMessages({ ...errorMessages, city: error });
    setCity(event.target.value);
  };

  const provinceHandler = (event) => {
    setProvince(event.target.value);
  };

  const postalCodeHandler = (event) => {
    //   if (postalCodeRegex.test(String(event.target.value))) {
    //     setPostalCodeError(false);
    //   } else {
    //     setPostalCodeError(true);
    //   }
    // let error = MandatoryFieldCheck(event.target.value);
    let error = ""
    if (error !== "") {
      setPostalCodeError(true);
    } else {
      setPostalCodeError(false);
    }
    seterrorMessages({ ...errorMessages, postalCode: error });
    setPostalCode(event.target.value);
  };

  const countryHandler = (event) => {
    setCountry(event.target.value);
  };


  const originOfContactHandler = (event) =>{
    setOriginOfContact(event.target.value);

  }

  const originOfContactHandler2 = (event) =>{
    setOriginOfContact2(event.target.value);

  }

  const referralDetailsHandler = (event) =>{
    
    setReferralDetails(event.target.value);

  }

  const facilityHandler = (event) =>{
    
    SetFacility(event.target.value);

  }


 const togglePasswordVisibility = () => {
    setPasswordVisibility(!passwordVisibility);
};

const togglePasswordVisibility2 = () => {
  setPasswordVisibility2(!passwordVisibility2);
};

  // Hooks ===

  // Fetch User List | First Render Only
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gender == "NonBinary") {
      setIsGender2(true);
    } else {
      setIsGender2(false);
      setGender2("");
      setGender2Error(false);
    }
  }, [gender]);

  useEffect(() => {
    if (originOfContact == "Other") {
      setOriginOfContactOtherFlag(true);
    } else {
      setOriginOfContactOtherFlag(false);
      setOriginOfContact2("");
    }
  }, [originOfContact]);



  useEffect(() => {
    if (language == "Other") {
      setIsLanguage2(true);
    } else {
      setIsLanguage2(false);
      setLanguage2("");
      setLanguage2Error(false);
    }
  }, [language]);

  // Render Section ===

  return (
    <>
      {createUserDialog ? (
        <Dialog
          id="create-user-dialog"
          fullWidth
          maxWidth="md"
          open={createUserDialog}
          onClose={() => {
            closeHandler();
          }}
        >
          <DialogTitle>Create a User</DialogTitle>
          <DialogContent>
            {createUserDialogExecuting ? (
              <CircularProgress />
            ) : (
              <>
                <Typography
                  component="div"
                  variant="body1"
                  color="inherit"
                  gutterBottom={true}
                >
                  Please fill in user information to create the corresponding
                  account.
                </Typography>

                <Box mx={1} my={2} boxShadow={0}>
                  <Collapse in={page == 0 ? true : false}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="stretch"
                      spacing={1}
                      display={page == 0 ? "block" : "none"}
                    >
                      <Grid
                        item
                        xs
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                      >
                        <Grid item xs>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              autoFocus
                              id="Email"
                              fullWidth
                              label="Email"
                              // required
                              onChange={(event) => {
                                emailHandler(event);
                              }}
                              helperText={errorMessages.email}
                              value={email}
                              error={errorMessages.email === "" ? false : true}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="Password"
                              fullWidth
                              type={passwordVisibility? 'text' : 'password'}
                              label="Password"
                              required
                              onChange={(event) => {
                                passwordHandler(event);
                              }}
                              helperText={errorMessages.password}
                              value={password}
                              error={
                                errorMessages.password === "" ? false : true
                              }

                              InputProps={{
                                endAdornment:
                                <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility}>
                                            {passwordVisibility ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="ConfirmPassword"
                              fullWidth
                              type={passwordVisibility2? 'text' : 'password'}
                              label="Confirm Password"
                              required
                              disabled={
                                password == "" || passwordError ? true : false
                              }
                              onChange={(event) => {
                                confirmPasswordHandler(event);
                              }}
                              helperText={errorMessages.confirmPassword}
                              value={confirmPassword}
                              error={
                                errorMessages.confirmPassword === ""
                                  ? false
                                  : true
                              }
                              
                              InputProps={{
                                endAdornment:
                                <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility2}>
                                            {passwordVisibility2 ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }}

                            />
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                      >
                         <Grid item>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="phone"
                              fullWidth
                              label="Phone Number"
                              onChange={(event) => {
                                phoneHandler(event);
                              }}
                              helperText={errorMessages.phone}
                              value={phone}
                              error={
                                errorMessages.phone === "" ? false : true
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="FirstName"
                              fullWidth
                              label="First Name"
                              required
                              onChange={(event) => {
                                firstNameHandler(event);
                              }}
                              helperText={errorMessages.firstName}
                              value={firstName}
                              error={
                                errorMessages.firstName === "" ? false : true
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="LastName"
                              fullWidth
                              label="Last Name"
                              required
                              onChange={(event) => {
                                lastNameHandler(event);
                              }}
                              helperText={errorMessages.lastName}
                              value={lastName}
                              error={
                                errorMessages.lastName === "" ? false : true
                              }
                            />
                          </Box>
                        </Grid>
                       
                      </Grid>
                    </Grid>
                  </Collapse>
                  <Collapse in={page == 1 ? true : false}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="stretch"
                      spacing={1}
                      display={page == 0 ? "block" : "none"}
                    >
                      <Grid
                        item
                        xs
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        display={page == 1 ? "block" : "none"}
                      >
                        <Grid item>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="Language"
                              select
                              fullWidth
                              label="Language"
                              value={language}
                              helperText={errorMessages.language}
                              error={
                                errorMessages.language === "" ? false : true
                              }
                              onChange={(event) => {
                                languageHandler(event);
                              }}
                              variant="outlined"
                            >
                              <MenuItem key={"English"} value={"English"}>
                                English
                              </MenuItem>
                              <MenuItem key={"Other"} value={"Other"}>
                                Other
                              </MenuItem>
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="Language2"
                              fullWidth
                              label="Specify Language"
                              onChange={(event) => {
                                language2Handler(event);
                              }}
                              value={language2}
                              helperText={errorMessages.language2}
                              error={
                                errorMessages.language2 === "" ? false : true
                              }
                              disabled={!isLanguage2}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        display={page == 1 ? "block" : "none"}
                      >
                        <Grid item>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="Gender"
                              select
                              fullWidth
                              label="Gender"
                              value={gender}
                              onChange={(event) => {
                                genderHandler(event);
                              }}
                              error={errorMessages.gender === "" ? false : true}
                              helperText={errorMessages.gender}
                              variant="outlined"
                            >
                              <MenuItem key={"Male"} value={"Male"}>
                                Male
                              </MenuItem>
                              <MenuItem key={"Female"} value={"Female"}>
                                Female
                              </MenuItem>
                              <MenuItem key={"NonBinary"} value={"NonBinary"}>
                                Non-Binary
                              </MenuItem>
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="Gender2"
                              fullWidth
                              label="Specify Gender"
                              onChange={(event) => {
                                gender2Handler(event);
                              }}
                              helperText={errorMessages.gender2}
                              error={
                                errorMessages.gender2 === "" ? false : true
                              }
                              value={gender2}
                              disabled={!isGender2}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Collapse>
                  <Collapse in={page == 2 ? true : false}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="stretch"
                      spacing={1}
                      display={page == 0 ? "block" : "none"}
                    >
                      <Grid
                        item
                        xs
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        display={page == 2 ? "block" : "none"}
                      >
                        <Grid item>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="DateOfBirth"
                              fullWidth
                              label="Date of Birth"
                              type="date"
                              defaultValue={dateOfBirth}
                              onChange={(event) => {
                                dateOfBirthHandler(event);
                              }}
                              error={
                                errorMessages.dateOfBirth === "" ? false : true
                              }
                              helperText={errorMessages.dateOfBirth}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              inputProps={{
                                required: true,
                                max: new Date().toISOString().split("T")[0],
                              }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        display={page == 2 ? "block" : "none"}
                      >
                        <Grid item>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="Role"
                              select
                              required
                              fullWidth
                              label="Role"
                              value={role}
                              onChange={(event) => {
                                roleHandler(event);
                              }}
                              error={errorMessages.role === "" ? false : true}
                              helperText={errorMessages.role}
                              variant="outlined"
                            >
                              {appState.role == "Admin" && <MenuItem key={"Admin"} value={"Admin"}>
                                Admin
                              </MenuItem>}
                              {appState.role == "Admin" && <MenuItem key={"Coordinator"} value={"Coordinator"}>
                                Coordinator
                              </MenuItem>}
                              <MenuItem key={"Volunteer"} value={"Volunteer"}>
                                Volunteer
                              </MenuItem>
                              <MenuItem key={"Patient"} value={"Patient"}>
                                Member
                              </MenuItem>
                            </TextField>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="stretch"
                      spacing={1}
                      display={page == 0 ? "block" : "none"}
                    >

                      <Grid
                        item
                        xs
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        display={page == 2 ? "block" : "none"}
                      >
                        <Grid item>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="originOfContact"
                              select
                              required
                              fullWidth
                              label="OriginOfContact"
                              value={originOfContact}
                              onChange={(event) => {
                                originOfContactHandler(event);
                              }}
                              error={errorMessages.role === "" ? false : true}
                              helperText={errorMessages.role}
                              variant="outlined"
                            >
                              <MenuItem key={"New Referral"} value={"New Referral"}>
                                New Referral
                              </MenuItem>
                              <MenuItem key={"Service Transition"} value={"Service Transition"}>
                                Service Transition
                              </MenuItem>
                              <MenuItem key={"Former Student or Volunteer"} value={"Former Student or Volunteer"}>
                                Former Student or Volunteer
                              </MenuItem>
                              <MenuItem key={"Education Event"} value={"Education Event"}>
                                Education Event
                              </MenuItem>
                              <MenuItem key={"Other"} value={"Other"}>
                                Other
                              </MenuItem>
                            </TextField>
                          </Box>
                        </Grid>
                      </Grid>
                      

                      <Grid
                        item
                        xs
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        display={page == 2 ? "block" : "none"}
                      >
                        <Grid item>
                          <Box mx={2} my={0} boxShadow={0}>
                          <TextField
                              id="referralDetails"
                              fullWidth
                              label="Referral Details"
                              onChange={(event) => {
                                referralDetailsHandler(event);
                              }}
                              // helperText={errorMessages.city}
                              // value={referralDetails}
                              // error={errorMessages.city === "" ? false : true}
                            />
                          </Box>
                        </Grid>
                      </Grid>


                    </Grid>

                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="stretch"
                      spacing={1}
                      display={page == 0 ? "block" : "none"}
                    >

                      <Grid
                          item
                          xs
                          container
                          direction="column"
                          justifyContent="flex-start"
                          alignItems="stretch"
                          spacing={2}
                          display={page == 2 ? "block" : "none"}
                        >
                          <Grid item>

                            <Box mx={2} my={0} boxShadow={0}>
                              <TextField
                                  id="OriginOfContactOthers"
                                  fullWidth
                                  label="Specify Origin Of Contact"
                                  onChange={(event) => {
                                    originOfContactHandler2(event);
                                  }}
                                  helperText={errorMessages.city}
                                  error={errorMessages.city === "" ? false : true}
                                  disabled ={!originOfContactOtherFlag}
                                />
                            </Box>
                          </Grid>
                        </Grid>

                        <Grid
                          item
                          xs
                          container
                          direction="column"
                          justifyContent="flex-start"
                          alignItems="stretch"
                          spacing={2}
                          display={page == 2 ? "block" : "none"}
                        >
                          {/* <Grid item>
                            <Box mx={2} my={0} boxShadow={0}>
                              <TextField
                                  id="facility"
                                  fullWidth
                                  label="Facility"
                                  onChange={(event) => {
                                    facilityHandler(event);
                                  }}
                                  // helperText={errorMessages.city}
                                  // value={facility}
                                  // error={errorMessages.city === "" ? false : true}
                                />
                              </Box>
                            </Grid> */}

                        </Grid>


                      

                    </Grid>
                  </Collapse>
                  <Collapse in={page == 3 ? true : false}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="stretch"
                      spacing={1}
                      display={page == 0 ? "block" : "none"}
                    >
                      <Grid
                        item
                        xs
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        display={page == 3 ? "block" : "none"}
                      >
                        <Grid item xs>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              autoFocus
                              id="Street"
                              fullWidth
                              label="Street"
                              onChange={(event) => {
                                streetHandler(event);
                              }}
                              helperText={errorMessages.street}
                              value={street}
                              error={errorMessages.street === "" ? false : true}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="City"
                              fullWidth
                              label="City"
                              onChange={(event) => {
                                cityHandler(event);
                              }}
                              helperText={errorMessages.city}
                              value={city}
                              error={errorMessages.city === "" ? false : true}
                            />
                          </Box>
                        </Grid>
                        <Grid item xs>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="PostalCode"
                              fullWidth
                              label="Postal Code"
                              onChange={(event) => {
                                postalCodeHandler(event);
                              }}
                              helperText={errorMessages.postalCode}
                              value={postalCode}
                              error={
                                errorMessages.postalCode === "" ? false : true
                              }
                            />
                          </Box>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={2}
                        display={page == 3 ? "block" : "none"}
                      >
                        <Grid item>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="Province"
                              select
                              fullWidth
                              label="Province"
                              value={province}
                              onChange={(event) => {
                                provinceHandler(event);
                              }}
                              helperText={errorMessages.province}
                              error={
                                errorMessages.province === "" ? false : true
                              }
                              variant="outlined"
                            >
                              <MenuItem key={"AB"} value={"AB"}>
                                Alberta
                              </MenuItem>
                              <MenuItem key={"BC"} value={"BC"}>
                                British Columbia
                              </MenuItem>
                              <MenuItem key={"MB"} value={"MB"}>
                                Manitoba
                              </MenuItem>
                              <MenuItem key={"NB"} value={"NB"}>
                                New Brunswick
                              </MenuItem>
                              <MenuItem key={"NL"} value={"NL"}>
                                Newfoundland and Labrador
                              </MenuItem>
                              <MenuItem key={"NT"} value={"NT"}>
                                Northwest Territories
                              </MenuItem>
                              <MenuItem key={"NS"} value={"NS"}>
                                Nova Scotia
                              </MenuItem>
                              <MenuItem key={"NU"} value={"NU"}>
                                Nunavut
                              </MenuItem>
                              <MenuItem key={"ON"} value={"ON"}>
                                Ontario
                              </MenuItem>
                              <MenuItem key={"PE"} value={"PE"}>
                                Prince Edward Island
                              </MenuItem>
                              <MenuItem key={"QC"} value={"QC"}>
                                Quebec
                              </MenuItem>
                              <MenuItem key={"SK"} value={"SK"}>
                                Saskatchewan
                              </MenuItem>
                              <MenuItem key={"YT"} value={"YT"}>
                                Yukon
                              </MenuItem>
                            </TextField>
                          </Box>
                        </Grid>
                        <Grid item>
                          <Box mx={2} my={0} boxShadow={0}>
                            <TextField
                              id="Country"
                              select
                              fullWidth
                              label="Country"
                              value={country}
                              onChange={(event) => {
                                countryHandler(event);
                              }}
                              error={
                                errorMessages.country === "" ? false : true
                              }
                              helperText={errorMessages.country}
                              variant="outlined"
                            >
                              <MenuItem key={"Canada"} value={"Canada"}>
                                Canada
                              </MenuItem>
                            </TextField>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Collapse>
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                closeHandler();
              }}
              disabled={createUserDialogExecuting}
            >
              Cancel
            </Button>
            <Collapse in={page == 0 ? true : false}>
              <Box
                mx={2}
                my={0}
                boxShadow={0}
                display={page == 0 ? "block" : "none"}
              >
                <Button
                  color="secondary"
                  variant="contained"
                  endIcon={<NavigateNextIcon />}
                  onClick={() => {
                    navigateNext();
                  }}
                >
                  Next
                </Button>
              </Box>
            </Collapse>
            <Collapse in={page == 1 ? true : false}>
              <Box
                mx={2}
                my={0}
                boxShadow={0}
                display={page == 1 ? "block" : "none"}
              >
                <ButtonGroup display={page == 1 ? "block" : "none"}>
                  <Button
                    color="secondary"
                    variant="outlined"
                    startIcon={<NavigateBeforeIcon />}
                    onClick={() => {
                      navigateBack();
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    endIcon={<NavigateNextIcon />}
                    onClick={() => {
                      navigateNext();
                    }}
                  >
                    Next
                  </Button>
                </ButtonGroup>
              </Box>
            </Collapse>
            <Collapse in={page == 2 ? true : false}>
              <Box
                mx={2}
                my={0}
                boxShadow={0}
                display={page == 2 ? "block" : "none"}
              >
                <ButtonGroup display={page == 2 ? "block" : "none"}>
                  <Button
                    color="secondary"
                    variant="outlined"
                    startIcon={<NavigateBeforeIcon />}
                    onClick={() => {
                      navigateBack();
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    color="secondary"
                    variant="contained"
                    endIcon={<NavigateNextIcon />}
                    onClick={() => {
                      navigateNext();
                    }}
                  >
                    Next
                  </Button>
                </ButtonGroup>
              </Box>
            </Collapse>
            <Collapse in={page == 3 ? true : false}>
              <Box
                mx={2}
                my={0}
                boxShadow={0}
                display={page == 3 ? "block" : "none"}
              >
                <ButtonGroup display={page == 3 ? "block" : "none"}>
                  <Button
                    color="secondary"
                    variant="outlined"
                    startIcon={<NavigateBeforeIcon />}
                    onClick={() => {
                      navigateBack();
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    endIcon={<AddBoxOutlinedIcon />}
                    onClick={() => {
                      createHandler();
                    }}
                    disabled={createUserDialogExecuting}
                  >
                    Create
                  </Button>
                </ButtonGroup>
              </Box>
            </Collapse>
          </DialogActions>
        </Dialog>
      ) : null}
    </>
  );
};

// ======================== Component PropType Check ========================
CreateUserDialog.propTypes = {
  // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
  appState: PropTypes.object.isRequired,
  setParentAlert: PropTypes.func.isRequired,
  getParentData: PropTypes.func.isRequired,
  createUserDialog: PropTypes.bool.isRequired,
  setCreateUserDialog: PropTypes.func.isRequired,
  createUserDialogExecuting: PropTypes.bool.isRequired,
  setCreateUserDialogExecuting: PropTypes.func.isRequired,
};

CreateUserDialog.defaultProps = {
  appState: {},
  setParentAlert: () => { },
  getParentData: () => { },
  setCreateUserDialog: () => { },
  setCreateUserDialogExecuting: () => { },
};

export default CreateUserDialog; // You can even shorthand this line by adding this at the function [Component] declaration stage
