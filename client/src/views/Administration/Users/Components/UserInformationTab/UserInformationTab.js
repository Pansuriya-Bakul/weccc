// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================
// import ChangesUserDialog from '../Dialog/ChangesUserDialog';

// ==================== Helpers =====================
import patch from '../../../../../helpers/common/patch';
import AlertType from '../../../../../helpers/models/AlertType';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins
import Card from '@material-ui/core/Card';  //Like the paper module, a visual sheet to place things
import Divider from '@material-ui/core/Divider';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';

import { TextField } from '@material-ui/core';

// ==================== MUI Icons ====================
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/Refresh';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SaveIcon from '@material-ui/icons/Save';
import get from "../../../../../helpers/common/get";
import { validateOtherLanguages } from '../../../../../helpers/utils/validation';
import { deleteEmptyKeys, getAddress, getOtherLanguages } from '../../../../../helpers/common/helperFunctions';




// ==================== MUI Styles ===================

const useStyles = makeStyles((theme) =>    //Notice the hook useStyles
({
    root: {
        flexGrow: 1,     // CSS determined this way, flexbox properties
        height: '100%'
    },
    rootGrid: {
        height: '100%'
    },
    languageOption: {
        color: 'red'
    }
}));


// ================= Static Variables ================
const backLink = "/administration/users/management";
const nameRegex = /^[a-zA-Z]+$/;
const phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
const wordsRegex = /^.+$/
const streetRegex = /^(\d{1,})[a-zA-Z0-9\s]+(\.)?$/;    //WIP currently accepts number only
const postalCodeRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const UserInformationTab = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

    // Style variable declaration
    const classes = useStyles();

    // Declaration of Stateful Variables ===
    const { appState, userID, setParentAlert, getParentInfo, panelId, panelIndex, userOriginal, allFacilities } = props;

    const [userEdit, setUserEdit] = useState(null);

    // Unlock editable fields
    const [editable, setEditable] = useState(false);

    const [changedInformationProperties, setChangedInformationProperties] = useState(false);

    //  Editable Variables ==========

    const [name, setName] = useState("");
    const [nameError, setNameError] = useState(false);

    const [dateOfBirth, setDateOfBirth] = useState("");
    const [dateOfBirthError, setDateOfBirthError] = useState(false);

    const [gender, setGender] = useState("");
    const [genderError, setGenderError] = useState(false);

    const [facility, setFacility] = useState("");

    const [gender2, setGender2] = useState("");
    const [isGender2, setIsGender2] = useState("");
    const [gender2Error, setGender2Error] = useState(false);

    const [language, setLanguage] = useState("");
    const [languageError, setLanguageError] = useState(false);

    const [language2, setLanguage2] = useState("");
    const [isLanguage2, setIsLanguage2] = useState(false);
    const [language2Error, setLanguage2Error] = useState(false);

    // const [allFacilities, setAllFacilities] = useState([]);

    // Non-Required Parameters ========================================

    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState(false);

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

    const [referral, setReferral] = useState("");
    const [referralError, setReferralError] = useState(false);

    // Functions ===

    const editablePropertiesHandler = useCallback((event) => {

        setUserEdit({ ...userOriginal })
        setEditable(!editable);

        if (userOriginal) {
            setUserEdit({ ...userOriginal }
            );

            setName(userOriginal.info.name);
            setNameError(false);

            setDateOfBirth(userOriginal.info.dateOfBirth);
            setDateOfBirthError(false);

            if (userOriginal.info.gender != "Male" && userOriginal.info.gender != "Female") {
                setGender("NonBinary");

                setIsGender2(true);

                if (userOriginal && userOriginal.info) {
                    setGender2(userOriginal.info.gender);

                    if (userOriginal.info.gender.length === 0) {
                        setGender2Error(true);
                    }
                    else {
                        setGender2Error(false);
                    }
                }
            }
            else {
                setGender(userOriginal.info.gender);

                setIsGender2(false);
                setGender2("");
                setGender2Error(false);
            }

            setGenderError(false);

            if (userOriginal.info.language != "English" && userOriginal.info.language != "French") {
                setLanguage("Other");

                setLanguage2(userOriginal.info.language);

                if (userOriginal.info.language.length === 0) {
                    setLanguage2Error(true);
                }
                else {
                    setLanguage2Error(false);
                }

            }
            else {
                setLanguage(userOriginal.info.language);

                setIsLanguage2(false);
                setLanguage2("");
                setLanguage2Error(false);
            }

            setLanguageError(false);

            if (userOriginal.info && userOriginal.info.phone) {
                setPhone(userOriginal.info.phone);
            }
            else {
                setPhone("");
            }

            setPhoneError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.street) {
                setStreet(userOriginal.info.currentAddress.street);
            }
            else {
                setStreet("");
            }

            setStreetError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.city) {
                setCity(userOriginal.info.currentAddress.city);
            }
            else {
                setCity("");
            }

            setCityError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.code) {
                setPostalCode(userOriginal.info.currentAddress.code);
            }
            else {
                setPostalCode("");
            }

            setPostalCodeError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.state) {
                setProvince(userOriginal.info.currentAddress.state);
            }
            else {
                setProvince("");
            }

            setProvinceError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.country) {
                setCountry(userOriginal.info.currentAddress.country);
            }
            else {
                setCountry("");
            }

            setCountryError(false);

            if (userOriginal.info && userOriginal.info.referral) {
                setReferral(userOriginal.info.referral);
            }
            else {
                setReferral("");
            }

            setReferralError(false);
        }

    }, [editable, setEditable, userOriginal, setUserEdit, setName, setNameError, setDateOfBirth, setDateOfBirthError, setGender, setGenderError, setIsGender2, setGender2, setGender2Error,
        setLanguage, setLanguageError, setIsLanguage2, setLanguage2, setLanguage2Error, setPhone, setPhoneError, setStreet, setStreetError, setPostalCode, setPostalCodeError, setCity, setCityError,
        setProvince, setProvinceError, setCountry, setCountryError, setFacility, setReferral, setReferralError]);

    const nameHandler = useCallback((event) => {

        if (event.target.value.length === 0) {
            setNameError(true);
        }

        setUserEdit({
            ...userEdit,
            info: {
                ...userEdit.info,
                name: event.target.value
            }
        });

    }, [userEdit, setUserEdit, setNameError]);

    const genderHandler = useCallback((event) => {
        setGender(event.target.value);
    }, [setGender]);

    const facilityHandler = useCallback((event) => {

        const selectedFacilityName = event.target.value;
        const selectedFacility = allFacilities.find(facility => facility.name === selectedFacilityName);

        if (selectedFacility) {
            setUserEdit(prevState => ({
                ...prevState,
                facilityId: {
                    name: selectedFacility.name,
                    _id: selectedFacility._id,
                    prefix: selectedFacility.prefix
                }
            }));
        }

    }, [userEdit, setUserEdit]);

    const gender2Handler = useCallback((event) => {
        if (wordsRegex.test(String(event.target.value))) {
            setGender2Error(false);
        }
        else {
            setGender2Error(true);
        }

        setGender2(event.target.value);

    }, [wordsRegex, setGender2, setGender2Error]);

    const dateOfBirthHandler = useCallback((event) => {
        const dob = event.target.value;

        if (dob === '') {
            setUserEdit({
                ...userEdit,
                info: {
                    ...userEdit.info,
                    dateOfBirth: dob
                }
            });

        } else {
            setUserEdit({
                ...userEdit,
                info: {
                    ...userEdit.info,
                    dateOfBirth: new Date(event.target.value)
                }
            });
        }

    }, [userEdit, setUserEdit, setDateOfBirthError]);

    const languageHandler = useCallback((event) => {
        setLanguage(event.target.value);
    }, [setLanguage]);

    const language2Handler = useCallback((event) => {

        let error = validateOtherLanguages(event.target.value)
        if (error !== "") {
            setLanguage2Error(true);
        } else {
            setLanguage2Error(false);
        }
        setLanguage2(event.target.value);
    }, [wordsRegex, setLanguage2, setLanguage2Error, userEdit, language2]);

    function extractDigits(phoneNumber) {
        // Remove all non-digit characters from the phone number
        const strippedNumber = phoneNumber.replace(/\D/g, '');

        // Extract the first 10 digits
        const extractedDigits = strippedNumber.slice(0, 10);

        return extractedDigits;
    }


    const phoneHandler = useCallback((event) => {
        const digits = extractDigits(event.target.value);

        if (phoneRegex.test(String(digits))) {

            setPhoneError(false);
        }
        else {
            if (event.target.value.length === 0) {
                setPhoneError(false);
            }
            else {
                setPhoneError(true);
            }

        }

        setUserEdit({
            ...userEdit,
            info: {
                ...userEdit.info,
                phone: event.target.value
            }
        });

        setPhone(digits);

    }, [setPhone, setPhoneError, phoneRegex, userEdit]);

    const streetHandler = useCallback((event) => {
        if (streetRegex.test(String(event.target.value))) {
            setStreetError(false);
        }
        else {
            if (event.target.value.length === 0) {
                setStreetError(true);
            }
            else {
                setStreetError(false);
            }

        }

        setUserEdit({
            ...userEdit,
            info: {
                ...userEdit.info,
                currentAddress: {
                    ...userEdit.info.currentAddress,
                    street: event.target.value
                }
            }
        });

        setStreet(event.target.value);

    }, [setStreet, userEdit, setStreetError, streetRegex]);

    const cityHandler = useCallback((event) => {

        setUserEdit({
            ...userEdit,
            info: {
                ...userEdit.info,
                currentAddress: {
                    ...userEdit.info.currentAddress,
                    city: event.target.value
                }
            }
        });

        setCity(event.target.value);

    }, [setCity, userEdit]);

    const provinceHandler = useCallback((event) => {
        setUserEdit({
            ...userEdit,
            info: {
                ...userEdit.info,
                currentAddress: {
                    ...userEdit.info.currentAddress,
                    state: event.target.value
                }
            }
        });

        setProvince(event.target.value);

    }, [setProvince, userEdit]);

    const postalCodeHandler = useCallback((event) => {
        if (postalCodeRegex.test(String(event.target.value))) {
            setPostalCodeError(false);
        }
        else {
            if (event.target.value.length === 0) {
                setPostalCodeError(false);
            }
            else {
                setPostalCodeError(true);
            }
        }
        setUserEdit({
            ...userEdit,
            info: {
                ...userEdit.info,
                currentAddress: {
                    ...userEdit.info.currentAddress,
                    code: event.target.value
                }
            }
        });

        setPostalCode(event.target.value);

    }, [setPostalCode, setPostalCodeError, userEdit, postalCodeRegex]);

    const countryHandler = useCallback((event) => {
        setUserEdit({
            ...userEdit,
            info: {
                ...userEdit.info,
                currentAddress: {
                    ...userEdit.info.currentAddress,
                    country: event.target.value
                }
            }
        });

        setCountry(event.target.value);

    }, [setCountry, userEdit]);

    const referralHandler = useCallback((event) => {

        setReferral(event.target.value);

    }, [setReferral]);

    const resetInformationProperties = useCallback((event) => {
        if (userOriginal) {
            setUserEdit(
                {
                    ...userOriginal,
                }
            );

            setName(userOriginal.info.name);
            setNameError(false);

            setDateOfBirth(userOriginal.info.dateOfBirth);
            setDateOfBirthError(false);

            if (userOriginal.info.gender != "Male" && userOriginal.info.gender != "Female") {
                setGender("NonBinary");

                setIsGender2(true);

                if (userOriginal && userOriginal.info) {
                    setGender2(userOriginal.info.gender);

                    if (userOriginal.info.gender.length === 0) {
                        setGender2Error(true);
                    }
                    else {
                        setGender2Error(false);
                    }
                }
            }
            else {
                setGender(userOriginal.info.gender);

                setIsGender2(false);
                setGender2("");
                setGender2Error(false);
            }

            setGenderError(false);

            if (userOriginal.info.language != "English") {
                setLanguage("Other");

                setLanguage2(userOriginal.info.language);

                if (userOriginal.info.language.length === 0) {
                    setLanguage2Error(true);
                }
                else {
                    setLanguage2Error(false);
                }

            }
            else {
                setLanguage(userOriginal.info.language);

                setIsLanguage2(false);
                setLanguage2("");
                setLanguage2Error(false);
            }

            setLanguageError(false);

            if (userOriginal.info && userOriginal.info.phone) {
                setPhone(userOriginal.info.phone);
            }
            else {
                setPhone("");
            }

            setPhoneError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.street) {
                setStreet(userOriginal.info.currentAddress.street);
            }
            else {
                setStreet("");
            }

            setStreetError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.city) {
                setCity(userOriginal.info.currentAddress.city);
            }
            else {
                setCity("");
            }

            setCityError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.code) {
                setPostalCode(userOriginal.info.currentAddress.code);
            }
            else {
                setPostalCode("");
            }

            setPostalCodeError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.state) {
                setProvince(userOriginal.info.currentAddress.state);
            }
            else {
                setProvince("");
            }

            setProvinceError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.country) {
                setCountry(userOriginal.info.currentAddress.country);
            }
            else {
                setCountry("");
            }

            setCountryError(false);

            if (userOriginal.info && userOriginal.info.referral) {
                setReferral(userOriginal.info.referral);
            }
            else {
                setReferral("");
            }

            setReferralError(false);
        }

    }, [userOriginal, userEdit, setUserEdit, setName, setNameError, setDateOfBirth, setDateOfBirthError, setGender, setGenderError, setIsGender2, setGender2, setGender2Error,
        setLanguage, setLanguageError, setIsLanguage2, setLanguage2, setLanguage2Error, setPhone, setPhoneError, setStreet, setStreetError, setPostalCode, setPostalCodeError, setCity, setCityError,
        setProvince, setProvinceError, setCountry, setCountryError, setReferral, setReferralError]);

    const saveInformationProperties = useCallback((event) => {
        if (nameError || genderError || gender2Error || dateOfBirthError || languageError || language2Error
            || phoneError || streetError || cityError || postalCodeError || provinceError || countryError || referralError) {
            setParentAlert(new AlertType('One or more fields have errors. Please correct them and try again.', "error"));
            return;
        }

        let updateData = {
            info: {
                name: userEdit.info.name,
                dateOfBirth: userEdit.info.dateOfBirth ? userEdit.info.dateOfBirth.toISOString() : '',
                currentAddress: {
                    _id: getAddress(userEdit, '_id'),
                    street: getAddress(userEdit, 'street'),
                    city: getAddress(userEdit, 'city'),
                    code: getAddress(userEdit, 'code'),
                    state: getAddress(userEdit, 'state'),
                    country: getAddress(userEdit, 'country')
                },
                gender: userEdit.info.gender,
                language: userEdit.info.language,
                phone: userEdit.info.phone,
                referral: userEdit.info.referral
            },
            facilityId: userEdit.facilityId
        };
        if (isGender2) {
            if (gender2 !== userEdit.info.gender) {
                updateData = {
                    ...updateData,
                    info: {
                        ...updateData.info,
                        gender: gender2
                    }
                };
            }
        }
        else {
            if (gender !== userEdit.info.gender) {
                updateData = {
                    ...updateData,
                    info: {
                        ...updateData.info,
                        gender: gender
                    }
                };
            }
        }
        if (isLanguage2) {
            if (language2 !== userEdit.info.language) {
                updateData = {
                    ...updateData,
                    info: {
                        ...updateData.info,
                        language: language2
                    }
                };
            }
        }
        else {
            if (language !== userEdit.info.language) {
                updateData = {
                    ...updateData,
                    info: {
                        ...updateData.info,
                        language: language
                    }
                };
            }
        }

        if (phone !== userEdit.info.phone) {
            updateData = {
                ...updateData,
                info: {
                    ...updateData.info,
                    phone: phone
                }
            };
        }

        if (referral !== userEdit.info.referral) {
            updateData = {
                ...updateData,
                info: {
                    ...updateData.info,
                    referral: referral
                }
            };
        }

        if (userEdit.facilityId.name !== userOriginal.facilityId.name) {
            updateData = {
                ...updateData,
                facilityId: userEdit.facilityId
            }
            //console.log('update',updateData);
        }

        if (street !== getAddress(userEdit, 'street')) {
            updateData = {
                ...updateData,
                info: {
                    ...updateData.info,
                    currentAddress: {
                        ...updateData.info.currentAddress,
                        street: street
                    }
                }
            };
        }

        if (city !== getAddress(userEdit, 'city')) {
            updateData = {
                ...updateData,
                info: {
                    ...updateData.info,
                    currentAddress: {
                        ...updateData.info.currentAddress,
                        city: city
                    }
                }
            };
        }

        if (postalCode !== getAddress(userEdit, 'code')) {
            updateData = {
                ...updateData,
                info: {
                    ...updateData.info,
                    currentAddress: {
                        ...updateData.info.currentAddress,
                        code: postalCode
                    }
                }
            };
        }


        if (province !== getAddress(userEdit, 'state')) {
            updateData = {
                ...updateData,
                info: {
                    ...updateData.info,
                    currentAddress: {
                        ...updateData.info.currentAddress,
                        state: province
                    }
                }
            };
        }

        // convert language variable to array
        updateData = {
            ...updateData,
            info: {
                ...updateData.info,
                language: Array.isArray(updateData.info.language) ? updateData.info.language : getOtherLanguages(updateData.info.language),
            }
        };
        //removing all emppty keys from obj
        updateData.info = deleteEmptyKeys(updateData.info)
        console.log(updateData);

        if (userID != null) {
            patch("users/" + userID, appState.token, updateData, (error, response) => {
                if (error) {
                    setParentAlert(new AlertType('Unable to save changes to User. Please refresh and try again.', "error"));
                }
                else {
                    if (response.status === 200 || response.status === 304) {
                        getParentInfo();
                        resetInformationProperties();
                        setParentAlert(new AlertType('Successfully saved changes to user.', "success"));
                    }
                    else {
                        setParentAlert(new AlertType('Unable to save changes to User. Please refresh and try again.', "error"));
                    }
                }
            });
        }
        else {
            setParentAlert(new AlertType('Unable to save changes to User. Please refresh and try again.', "error"));
        }


    }, [appState, userID, userEdit, setParentAlert, getParentInfo,
        nameError, genderError, gender2Error, dateOfBirthError, languageError, language2Error, phoneError, streetError, cityError, postalCodeError, provinceError, countryError,
        gender, isGender2, gender2, language, isLanguage2, language2, phone, street, city, postalCode, province, facility, setFacility, referral, referralError]);

    // Hooks ===

    useEffect(() => {
        setUserEdit(userOriginal);

        if (userOriginal) {
            if (userOriginal.facilityId.name) {
                setFacility(userOriginal.facilityId.name);
            }
            else
                setFacility("");

            if (userOriginal.info.gender != "Male" && userOriginal.info.gender != "Female") {
                setGender("NonBinary");
            }
            else {
                setGender(userOriginal.info.gender);
            }

            setGenderError(false);

            if (userOriginal.info.language != "English" && userOriginal.info.language != "French") {
                setLanguage("Other");
            }
            else {
                setLanguage(userOriginal.info.language);
            }

            setLanguageError(false);

            if (userOriginal.info && userOriginal.info.phone) {
                setPhone(userOriginal.info.phone);
            }
            else {
                setPhone("");
            }

            setPhoneError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.street) {
                setStreet(userOriginal.info.currentAddress.street);
            }
            else {
                setStreet("");
            }

            setStreetError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.city) {
                setCity(userOriginal.info.currentAddress.city);
            }
            else {
                setCity("");
            }

            setCityError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.code) {
                setPostalCode(userOriginal.info.currentAddress.code);
            }
            else {
                setPostalCode("");
            }

            setPostalCodeError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.state) {
                setProvince(userOriginal.info.currentAddress.state);
            }
            else {
                setProvince("");
            }

            setProvinceError(false);

            if (userOriginal.info && userOriginal.info.currentAddress && userOriginal.info.currentAddress.country) {
                setCountry(userOriginal.info.currentAddress.country);
            }
            else {
                setCountry("");
            }

            setCountryError(false);

            if (userOriginal.info && userOriginal.info.referral) {
                setReferral(userOriginal.info.referral);
            }
            else {
                setReferral("");
            }

        }

    }, [userOriginal]);

    // useEffect(() => {
    //     if (panelIndex !== panelId) {
    //         resetInformationProperties();
    //     }

    // }, [panelIndex, panelId, resetInformationProperties]);

    useEffect(() => {
        if (JSON.stringify(userEdit) === JSON.stringify(userOriginal)) {
            setChangedInformationProperties(false);
        }
        else {
            setChangedInformationProperties(true);
        }

    }, [userOriginal, userEdit, setChangedInformationProperties]);

    useEffect(() => {
        if (gender == "NonBinary") {
            setIsGender2(true);

            if (userOriginal && userOriginal.info) {
                setGender2(userOriginal.info.gender);

                if (userOriginal.info.gender.length === 0) {
                    setGender2Error(true);
                }
                else {
                    setGender2Error(false);
                }
            }
        }
        else {
            setIsGender2(false);
            setGender2("");
            setGender2Error(false);
        }
    }, [userOriginal, gender, setIsGender2, setGender2, setGender2Error]);

    useEffect(() => {
        if (language == "Other") {
            setIsLanguage2(true);

            if (userOriginal && userOriginal.info) {
                setLanguage2(userOriginal.info.language);

                if (userOriginal.info.language && userOriginal.info.language.length === 0) {
                    setLanguage2Error(true);
                }
                else {
                    setLanguage2Error(false);
                }
            }
        }
        else {
            setIsLanguage2(false);
            setLanguage2("");
            setLanguage2Error(false);
        }
    }, [userOriginal, language, setIsLanguage2, setLanguage2, setLanguage2Error]);

    useEffect(() => {
        if (userEdit) {
            if (getDateOfBirth() > new Date().toISOString().split('T')[0]) {
                setDateOfBirthError(true);
            }
            else {
                setDateOfBirthError(false);
            }
        }

    }, [userEdit, setDateOfBirthError]);

    useEffect(() => {
        if (userOriginal && userOriginal.info) {
            if (!isGender2) {
                if (gender !== userOriginal.info.gender) {
                    setChangedInformationProperties(true);
                }
                else {
                    setChangedInformationProperties(false);
                }
            }
            else {
                if (gender2 !== userOriginal.info.gender) {
                    setChangedInformationProperties(true);
                }
                else {
                    setChangedInformationProperties(false);
                }
            }
        }
    }, [userOriginal, gender, isGender2, gender2, setChangedInformationProperties]);

    useEffect(() => {
        if (userOriginal && userOriginal.info) {
            if (!isLanguage2) {
                if (language !== userOriginal.info.language) {
                    setChangedInformationProperties(true);
                }
                else {
                    setChangedInformationProperties(false);
                }
            }
            else {
                if (isLanguage2 && language2 !== userOriginal.info.language) {
                    setChangedInformationProperties(true);
                }
                else {
                    setChangedInformationProperties(false);
                }
            }
        }
    }, [userOriginal, language, isLanguage2, language2, setChangedInformationProperties]);

    useEffect(() => {
        if (userOriginal && userOriginal.info) {
            if (phone !== userOriginal.info.phone) {
                if (phone.length === 0 && userOriginal.info.phone === undefined) {
                    setChangedInformationProperties(false);
                }
                else {
                    setChangedInformationProperties(true);
                }
            }
            else {
                setChangedInformationProperties(false);
            }
        }
    }, [phone, userOriginal, setChangedInformationProperties]);

    useEffect(() => {
        if (userOriginal && userOriginal.info && userOriginal.info.currentAddress) {
            if (street !== userOriginal.info.currentAddress.street) {
                if (street.length === 0 && userOriginal.info.currentAddress.street === undefined) {
                    setChangedInformationProperties(false);
                }
                else {
                    setChangedInformationProperties(true);
                }
            }
            else {
                setChangedInformationProperties(false);
            }
        }
    }, [street, userOriginal, setChangedInformationProperties]);

    useEffect(() => {
        if (userOriginal && userOriginal.info && userOriginal.info.currentAddress) {
            if (city !== userOriginal.info.currentAddress.city) {
                if (city.length === 0 && userOriginal.info.currentAddress.city === undefined) {
                    setChangedInformationProperties(false);
                }
                else {
                    setChangedInformationProperties(true);
                }
            }
            else {
                setChangedInformationProperties(false);
            }
        }
    }, [city, userOriginal, setChangedInformationProperties]);

    useEffect(() => {
        if (userOriginal && userOriginal.info && userOriginal.info.currentAddress) {
            if (postalCode !== userOriginal.info.currentAddress.code) {
                if (postalCode.length === 0 && userOriginal.info.currentAddress.code === undefined) {
                    setChangedInformationProperties(false);
                }
                else {
                    setChangedInformationProperties(true);
                }
            }
            else {
                setChangedInformationProperties(false);
            }
        }
    }, [postalCode, userOriginal, setChangedInformationProperties]);

    useEffect(() => {
        if (userOriginal && userOriginal.info && userOriginal.info.currentAddress) {
            if (province !== userOriginal.info.currentAddress.state) {
                if (province.length === 0 && userOriginal.info.currentAddress.state === undefined) {
                    setChangedInformationProperties(false);
                }
                else {
                    setChangedInformationProperties(true);
                }
            }
            else {
                setChangedInformationProperties(false);
            }
        }
    }, [province, userOriginal, setChangedInformationProperties]);

    useEffect(() => {
        if (userOriginal && userOriginal.info) {
            if (referral !== userOriginal.info.referral) {
                if (referral.length === 0 && userOriginal.info.referral === undefined) {
                    setChangedInformationProperties(false);
                }
                else {
                    setChangedInformationProperties(true);
                }
            }
            else {
                setChangedInformationProperties(false);
            }
        }
    }, [referral, userOriginal, setChangedInformationProperties]);

    // const fetchAllFacilities = () => {
    //     if (userEdit) {
    //         get("facilities/", appState.token, (err, res) => {
    //             if (err) {
    //                 console.log('error retrieving facilities');
    //             }
    //             else {
    //                 if (res.status === 200) {
    //                     setAllFacilities(res.data.response.facilities);
    //                 }
    //             }
    //         });
    //     }
    // }

    // useEffect(() => {
    //     fetchAllFacilities();

    // }, []);

    // Render Section ===

    const getDateOfBirth = () => {
        return userEdit.info.dateOfBirth ? new Date(userEdit.info.dateOfBirth).toISOString().split('T')[0] : ''
    }

    return (
        userOriginal != null ? (
            <div
                role="tabpanel"
                hidden={panelIndex !== panelId}
                id={`Panel-${panelId}`}
            >
                <Collapse in={panelIndex == panelId ? true : false}>
                    {userEdit ? (
                        <Grid
                            container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="stretch"
                            spacing={1}
                        >
                            <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                                <Grid item>
                                    <Typography variant="h6" component="h6">
                                        My Information
                                    </Typography>
                                    <Divider />
                                </Grid>
                                <Grid item xs>
                                    <Box mx={3} my={1} boxShadow={0}>
                                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                            <Grid item>
                                                <Tooltip
                                                    placement="bottom"
                                                    title="Unlock editable fields"
                                                >
                                                    <IconButton
                                                        size="small"
                                                        color="primary"
                                                        onClick={() => { editablePropertiesHandler(); }}
                                                    >
                                                        {editable ? (
                                                            <LockOpenIcon />
                                                        ) : (
                                                            <LockIcon />
                                                        )}
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                            <Grid item
                                                hidden={!editable}
                                            >
                                                <Collapse in={editable}>
                                                    <ButtonGroup color="primary">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="default"
                                                            startIcon={<RefreshIcon />}
                                                            onClick={() => { resetInformationProperties(); }}
                                                        >
                                                            Reset
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="secondary"
                                                            disabled={!changedInformationProperties}
                                                            startIcon={<SaveIcon />}
                                                            onClick={() => { saveInformationProperties(); }}
                                                        >
                                                            Save
                                                        </Button>
                                                    </ButtonGroup>
                                                </Collapse>
                                            </Grid>
                                            <Grid item
                                            // hidden={!editable}
                                            >
                                                <Collapse in={changedInformationProperties}>
                                                    <Typography variant="caption" color="textSecondary" align="left" gutterBottom>
                                                        {changedInformationProperties ? "Changes have been made." : ""}
                                                    </Typography>
                                                </Collapse>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        placement="left"
                                        title="This page views user information."
                                    >
                                        <IconButton>
                                            <HelpOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Box mx={1} my={1} boxShadow={0}>
                                    <Grid container direction="row" justifyContent="flex-start" alignItems="stretch" spacing={3}>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" component="h6" color="textPrimary">
                                                System Information
                                            </Typography>
                                            <Divider light />
                                        </Grid>
                                        {/* <Grid item xs={2}>
                                            <TextField id="Sequence-id" size="small" variant="outlined" fullWidth label="Sequence ID" readOnly disabled value={userEdit.sequence_id} />
                                        </Grid> */}
                                        <Grid item xs={3}>
                                            <TextField id="Sequence-prefix" size="small" variant="outlined" fullWidth label="Facility Prefix" readOnly disabled value={(userEdit.facilityId) ? userEdit.facilityId.prefix : ""} />
                                        </Grid>
                                        {appState.role !== "Admin" ? (
                                            <Grid item xs={3}>
                                                <TextField id="Facility-name" size="small" variant="outlined" fullWidth label="Facility" readOnly disabled value={(userEdit.facilityId) ? userEdit.facilityId.name : ""} />
                                            </Grid>
                                        )
                                            : (
                                                <Grid item xs={3}>  {/* Edited by P., making the facility changable*/}
                                                    <TextField
                                                        id="Facility-name"
                                                        select
                                                        //required
                                                        fullWidth
                                                        label="Facility"
                                                        value={(userEdit.facilityId) ? userEdit.facilityId.name : ""}
                                                        onChange={(event) => { facilityHandler(event); }}
                                                        size="small"
                                                        variant="outlined"
                                                        readOnly={editable ? false : true}
                                                        disabled={editable ? false : true}
                                                    >
                                                        {allFacilities.map((facility) => (
                                                            <MenuItem key={facility._id} value={facility.name}>
                                                                {facility.name}
                                                            </MenuItem>
                                                        ))}


                                                    </TextField>
                                                </Grid>)}
                                        <Grid item xs={7}></Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" component="h6" color="textPrimary">
                                                General User Information
                                            </Typography>
                                            <Divider light />
                                        </Grid>
                                        <Grid item xs={5}>
                                            <TextField id="Name" required size="small" variant="outlined" fullWidth label="Name" onChange={(event) => { nameHandler(event); }} value={userEdit.info.name} error={nameError}
                                                readOnly={editable ? false : true}
                                                disabled={editable ? false : true}
                                            />
                                        </Grid>
                                        <Grid item xs={7}></Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                id="Gender"
                                                select
                                                required
                                                fullWidth
                                                label="Gender"
                                                value={gender}
                                                onChange={(event) => { genderHandler(event); }}
                                                size="small"
                                                variant="outlined"
                                                readOnly={editable ? false : true}
                                                disabled={editable ? false : true}
                                            >
                                                <MenuItem key={'Male'} value={'Male'}>Male</MenuItem>
                                                <MenuItem key={'Female'} value={'Female'}>Female</MenuItem>
                                                <MenuItem key={'NonBinary'} value={'NonBinary'}>Non-Binary</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField id="Gender2" fullWidth label="Specify Gender" onChange={(event) => { gender2Handler(event); }} value={gender2} error={gender2Error}
                                                size="small"
                                                variant="outlined"
                                                required={isGender2}
                                                readOnly={!editable || !isGender2}
                                                disabled={!editable || !isGender2}
                                            />
                                        </Grid>
                                        <Grid item xs={7}></Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                id="Date-Of-Birth"
                                                fullWidth
                                                label="Date of Birth"
                                                type="date"
                                                value={getDateOfBirth()}
                                                error={dateOfBirthError}
                                                onChange={(event) => { dateOfBirthHandler(event); }}
                                                InputLabelProps={{
                                                    shrink: true
                                                }}
                                                inputProps={
                                                    {
                                                        required: true,
                                                        max: new Date().toISOString().split('T')[0]
                                                    }
                                                }
                                                size="small"
                                                variant="outlined"
                                                required
                                                readOnly={editable ? false : true}
                                                disabled={editable ? false : true}
                                            />
                                        </Grid>
                                        {/* <Grid item xs={1}>
                                                <IconButton size="small">
                                                    <EditIcon />
                                                </IconButton>
                                            </Grid> */}
                                        <Grid item xs={10}></Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                id="Language"
                                                select
                                                required
                                                fullWidth
                                                label="Language"
                                                value={language}
                                                onChange={(event) => { languageHandler(event); }}
                                                size="small"
                                                variant="outlined"
                                                readOnly={editable ? false : true}
                                                disabled={editable ? false : true}
                                            >
                                                <MenuItem key={'English'} value={'English'}>English</MenuItem>
                                                <MenuItem key={'French'} value={'French'}>French</MenuItem>
                                                <MenuItem key={'Other'} value={'Other'}>Other</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <TextField id="Language2" fullWidth
                                                label="Specify Language"
                                                onChange={(event) => { language2Handler(event); }}
                                                value={language2} error={language2Error}
                                                size="small"
                                                variant="outlined"
                                                required={isLanguage2}
                                                readOnly={!editable || !isLanguage2}
                                                disabled={!editable || !isLanguage2}

                                            />
                                            <Typography variant="caption" className={classes.languageOption}>{(isLanguage2 && language2Error) && 'Please enter languages separated with comma'}</Typography>
                                        </Grid>
                                        <Grid item xs={10}></Grid>
                                        {/* <Grid item xs={2}>
                                                <TextField id="Language" size="small" variant="outlined" fullWidth label="Language" value={(userEdit.info)? userEdit.info.language : ""} error={languageError}
                                                    readOnly={editable? false : true}
                                                    disabled={editable? false : true} 
                                                />
                                            </Grid> */}
                                        {/* <Grid item xs={1}>
                                                <IconButton size="small">
                                                    <EditIcon />
                                                </IconButton>
                                            </Grid> */}
                                        <Grid item xs={10}></Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" component="h6" color="textPrimary">
                                                User Contact Information
                                            </Typography>
                                            <Divider light />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField id="Phone" size="small" variant="outlined" fullWidth label="Phone" onChange={(event) => { phoneHandler(event); }}
                                                value={phone} error={phoneError}
                                                readOnly={editable ? false : true}
                                                disabled={editable ? false : true}
                                            />
                                        </Grid>
                                        {/* <Grid item xs={1}>
                                                <IconButton size="small">
                                                    <EditIcon />
                                                </IconButton>
                                            </Grid> */}
                                        <Grid item xs={10}></Grid>
                                        <Grid item xs={3}>
                                            <TextField id="Street" size="small" variant="outlined" fullWidth label="Street" onChange={(event) => { streetHandler(event); }}
                                                value={street} error={streetError}
                                                readOnly={editable ? false : true}
                                                disabled={editable ? false : true}
                                            />
                                        </Grid>
                                        {/* <Grid item xs={1}>
                                                <IconButton size="small">
                                                    <EditIcon />
                                                </IconButton>
                                            </Grid> */}
                                        <Grid item xs={7}></Grid>
                                        <Grid item xs={3}>
                                            <TextField id="City" size="small" variant="outlined" fullWidth label="City" onChange={(event) => { cityHandler(event); }}
                                                value={city} error={cityError}
                                                readOnly={editable ? false : true}
                                                disabled={editable ? false : true}
                                            />
                                        </Grid>
                                        {/* <Grid item xs={1}>
                                                <IconButton size="small">
                                                    <EditIcon />
                                                </IconButton>
                                            </Grid> */}
                                        <Grid item xs={8}></Grid>
                                        <Grid item xs={2}>
                                            <TextField id="PostalCode" size="small" variant="outlined" fullWidth label="Postal Code" onChange={(event) => { postalCodeHandler(event); }}
                                                value={postalCode} error={postalCodeError}
                                                readOnly={editable ? false : true}
                                                disabled={editable ? false : true}
                                            />
                                        </Grid>
                                        {/* <Grid item xs={1}>
                                                <IconButton size="small">
                                                    <EditIcon />
                                                </IconButton>
                                            </Grid> */}
                                        <Grid item xs={10}></Grid>
                                        <Grid item xs={3}>
                                            <TextField
                                                id="Province"
                                                select
                                                fullWidth
                                                label="Province"
                                                value={province}
                                                onChange={(event) => { provinceHandler(event); }}
                                                size="small"
                                                variant="outlined"
                                                readOnly={editable ? false : true}
                                                disabled={editable ? false : true}
                                            >
                                                <MenuItem key={'None'} value={''}>None</MenuItem>
                                                <MenuItem key={'AB'} value={'AB'}>Alberta</MenuItem>
                                                <MenuItem key={'BC'} value={'BC'}>British Columbia</MenuItem>
                                                <MenuItem key={'MB'} value={'MB'}>Manitoba</MenuItem>
                                                <MenuItem key={'NB'} value={'NB'}>New Brunswick</MenuItem>
                                                <MenuItem key={'NL'} value={'NL'}>Newfoundland and Labrador</MenuItem>
                                                <MenuItem key={'NT'} value={'NT'}>Northwest Territories</MenuItem>
                                                <MenuItem key={'NS'} value={'NS'}>Nova Scotia</MenuItem>
                                                <MenuItem key={'NU'} value={'NU'}>Nunavut</MenuItem>
                                                <MenuItem key={'ON'} value={'ON'}>Ontario</MenuItem>
                                                <MenuItem key={'PE'} value={'PE'}>Prince Edward Island</MenuItem>
                                                <MenuItem key={'QC'} value={'QC'}>Quebec</MenuItem>
                                                <MenuItem key={'SK'} value={'SK'}>Saskatchewan</MenuItem>
                                                <MenuItem key={'YT'} value={'YT'}>Yukon</MenuItem>
                                            </TextField>
                                        </Grid>
                                        {/* <Grid item xs={1}>
                                                <IconButton size="small">
                                                    <EditIcon />
                                                </IconButton>
                                            </Grid> */}
                                        <Grid item xs={7}></Grid>
                                        <Grid item xs={3}>
                                            <TextField id="Country" size="small" variant="outlined" fullWidth label="Country"
                                                value={country} error={countryError}
                                                required
                                                readOnly
                                                onChange={(e) => countryHandler(e)}
                                                disabled={editable ? false : true}
                                            />
                                        </Grid>

                                        <Grid item xs={7}></Grid>
                                        <Grid item xs={3}>
                                            <TextField id="Referral" size="small" variant="outlined" fullWidth label="Referral Details" onChange={(event) => { referralHandler(event); }}
                                                value={referral} error={referralError}
                                                readOnly={editable ? false : true}
                                                disabled={editable ? false : true}
                                            />
                                        </Grid>
                                        {/* <Grid item xs={1}>
                                                <IconButton size="small">
                                                    <EditIcon />
                                                </IconButton>
                                            </Grid> */}
                                        <Grid item xs={10}></Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid
                            container
                            direction="column"
                            justifyContent="flex-start"
                            alignItems="stretch"
                            spacing={1}
                        >
                            <Grid item xs={12} container direction="row" justifyContent="center" alignItems="stretch" spacing={1}>
                                <Grid item>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <CircularProgress />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Collapse>
            </div>
        ) : (
            <>
            </>
            // <Typography variant="h6" color="inherit" align="center" gutterBottom>
            //     Not Authorized. Please refresh and try again.
            // </Typography>
        )

    );
}

// ======================== Component PropType Check ========================
UserInformationTab.propTypes =
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    userID: PropTypes.string.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    getParentInfo: PropTypes.func.isRequired,
    panelId: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    userOriginal: PropTypes.object
}

UserInformationTab.defaultProps =
{
    appState: {},
    userID: null,
    setParentAlert: () => { },
    getParentInfo: () => { },
    panelId: null,
    panelIndex: null,
    userOriginal: {}
}

export default UserInformationTab;  // You can even shorthand this line by adding this at the function [Component] declaration stage