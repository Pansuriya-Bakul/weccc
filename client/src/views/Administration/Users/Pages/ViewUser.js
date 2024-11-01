// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Helpers =====================
import get from '../../../../helpers/common/get';
import AlertType from '../../../../helpers/models/AlertType';

// ==================== Components ==================
import AlertMessage from '../../../../components/AlertMessage';

import ChangesUserDialog from '../Dialog/ChangesUserDialog';

import UserCollectionsTab from '../Components/UserCollectionsTab/UserCollectionsTab';
import UserCommunityTab from '../Components/UserCommunityTab/UserCommunityTab';
import UserNotesTab from '../Components/UserNotesTab/UserNotesTab';
import UserInformationTab from '../Components/UserInformationTab/UserInformationTab';
import UserGeneralPropertiesTab from '../Components/UserGeneralPropertiesTab/UserGeneralPropertiesTab';
// import UserStatusTab from '../Components/UserStatusTab/UserStatusTab';
import VolStatusTab from '../Components/UserStatusTab/VolStatusTab';
import MemberStatusTab from '../Components/UserStatusTab/MemberStatusTab';

import LinearProgressWithLabel from '../Components/LinearProgressWithLabel/LinearProgressWithLabel';
import CircularProgressWithLabel from '../Components/CircularProgressWithLabel/CircularProgressWithLabel';


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

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

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

import AccountBoxIcon from '@material-ui/icons/AccountBox';

// ================= Static Variables ================
const editUserBaseLink = "/administration/booklets/";

// ==================== MUI Styles ===================

const useStyles = makeStyles((theme) =>    //Notice the hook useStyles
({
    root: {
        flexGrow: 1,     // CSS determined this way, flexbox properties
        height: '100%'
    },
    rootGrid: {
        height: '100%'
    }
}));


// ================= Static Variables ================
const backLink = "/administration/users/management";
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


// const surveyOptions = {

// };

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const ViewUser = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

    // Style variable declaration
    const classes = useStyles();

    // Declaration of Stateful Variables ===
    const { appState, userID, ToggleDrawerClose, CheckAuthenticationValidity } = props;

    const [userOriginal, setUserOriginal] = useState(null);

    const [userEdit, setUserEdit] = useState(null);

    const [allFacilities, setAllFacilities] = useState([]); 

    // Alert variable
    const [alert, setAlert] = useState(new AlertType());

    // Panel Control Variable
    const [panelIndex, setPanelIndex] = useState(0);

    // To be Panel Control Variable
    const [toBePanelIndex, setToBePanelIndex] = useState(0);

    //  Dialog Variables =====================================

    // changes User Dialog Logic variables
    const [changesUserDialog, setChangesUserDialog] = useState(false);
    const [changesUserDialogExecuting, setChangesUserDialogExecuting] = useState(false);


    //  Editable Variables ==========

    // Functions ===

    // Loads existing user chosen by user from the database
    const getUser = useCallback(() => {
        if (userID != null) {
            get("users/" + userID, appState.token, (error, response) => {
                if (error) {
                    setAlert(new AlertType('Unable to retrieve User. Please refresh and try again.', "error"));
                }
                else {
                    if (response.status === 200 || response.status === 304) {
                        setUserOriginal(response.data.user);
                        // setAlert(new AlertType('Successfully pulled user.', "success"));
                    }
                    else {
                        setAlert(new AlertType('Unable to retrieve User. Please refresh and try again.', "error"));
                    }
                }
            });
        }
        else {
            setAlert(new AlertType('Unable to retrieve User. Please refresh and try again.', "error"));
        }
    }, [userID, appState]);

    const panelHandler = useCallback((event, newValue) => {

        setToBePanelIndex(newValue);

        if (JSON.stringify(userEdit) === JSON.stringify(userOriginal)) {
            setPanelIndex(newValue);
        }
        else {
            setChangesUserDialog(true);
        }

    }, [userEdit, userOriginal, setToBePanelIndex, setPanelIndex, setChangesUserDialog]);

    const fetchAllFacilities = () => {

            get("facilities/", appState.token, (err, res) => {
                if (err) {
                    console.log('error retrieving facilities');
                }
                else {
                    if (res.status === 200) {
                        setAllFacilities(res.data.response.facilities);
                    }
                }
            });
        
    }


    // Hooks ===

    // First Render only because of the [ ] empty array tracking with the useEffect
    useEffect(() => {
        ToggleDrawerClose();
        setTimeout(() => {
            CheckAuthenticationValidity((tokenValid) => {
                if (tokenValid) {
                    // Load or Do Something
                    getUser();
                }
                else {

                    // Bad Response
                    setAlert(null);
                }
            });
        }, 200);    //
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchAllFacilities();
    }, []);

    useEffect(() => {

        if (userID) {
            getUser();
            setPanelIndex(0);
        }

    }, [userID]);

    useEffect(() => {
        setUserEdit(userOriginal);
    }, [userOriginal]);



    // Render Section ===

    return (
        <>
            {userOriginal === null ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                </div>) :
                alert != null ? (

                    // Notice the shorthand React render Fragment <> & </> instead of <div> & </div>, both work the same
                    <div className={classes.root}>
                        <Grid container
                            className={classes.rootGrid}
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="stretch"
                            spacing={1}
                        >
                            <Grid item xs={5}>
                                <Box mx={1} my={1}>
                                    <Grid container direction="row" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                        {/* {appState._id !== userID? (
                                        <Grid item>
                                            <IconButton component={Link} to={backLink}>
                                                <ArrowBackIosIcon />
                                            </IconButton>
                                        </Grid>
                                    ) : (
                                        <>
                                        </>
                                    )} */}
                                        <Grid item xs>
                                            {appState._id === userID ? (
                                                <Grid container direction="row" justifyContent="flex-start" alignItems="flex-end" spacing={2}>
                                                    <Grid item>
                                                        <AccountBoxIcon color="primary" />
                                                    </Grid>
                                                    <Grid item xs>
                                                        <Typography variant="h5" color="secondary" align="left" gutterBottom={false}>
                                                            My Profile
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            ) : (
                                                <Typography variant="h5" color="inherit" align="left" gutterBottom>
                                                    Viewing User {userOriginal ? `"${userOriginal.info.name}"` : null}
                                                </Typography>
                                            )}

                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box mx={1} my={1}>
                                    <AlertMessage alert={alert} setParentAlert={setAlert} />
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Card raised={true}>
                                    <AppBar position="static" disabled={userEdit ? false : true}>
                                        {userOriginal && userOriginal.role === "Volunteer" ? (
                                            <Tabs value={panelIndex} onChange={(event, newValue) => { panelHandler(event, newValue); }} aria-label="Account Tabs">
                                                {/* <Tab label="Collections" id={`Tab-${0}`} aria-controls={`Tab-${0}`} /> */}

                                                <Tab label="Profile" id={`Tab-${0}`} aria-controls={`Tab-${0}`} />
                                                <Tab label="Assigned Member" id={`Tab-${2}`} aria-controls={`Tab-${2}`} />
                                                <Tab label="History" id={`Tab-${3}`} aria-controls={`Tab-${3}`} />
                                                <Tab label="Change password" id={`Tab-${4}`} aria-controls={`Tab-${4}`} />
                                                <Tab label="Notes" id={`Tab-${1}`} aria-controls={`Tab-${1}`} />
                                            </Tabs>
                                        ) : (
                                            <Tabs value={panelIndex} onChange={(event, newValue) => { panelHandler(event, newValue); }} aria-label="Account Tabs">
                                                <Tab label="Profile" id={`Tab-${0}`} aria-controls={`Tab-${0}`} />
                                                <Tab label="Assigned Volunteer" id={`Tab-${2}`} aria-controls={`Tab-${2}`} />
                                                <Tab label="History" id={`Tab-${3}`} aria-controls={`Tab-${3}`} />
                                                <Tab label="Change password" id={`Tab-${4}`} aria-controls={`Tab-${4}`} />
                                                <Tab label="Notes" id={`Tab-${1}`} aria-controls={`Tab-${1}`} />
                                        </Tabs>

                                        )}
                                    </AppBar>
                                    <Box mx={2} my={1} boxShadow={0}>
                                        {
                                            <>
                                                {/* <UserCollectionsTab
                                                appState={appState}
                                                userID={userID}
                                                setParentAlert={setAlert}
                                                panelId={0}
                                                panelIndex={panelIndex}
                                                userOriginal={userOriginal}
                                            /> */}
                                                {/* Intake */}
                                                
                                                <UserInformationTab
                                                    appState={appState}
                                                    userID={userID}
                                                    setParentAlert={setAlert}
                                                    getParentInfo={getUser}
                                                    panelId={0}
                                                    panelIndex={panelIndex}
                                                    userOriginal={userOriginal}
                                                    allFacilities={allFacilities}
                                                />
                                                <UserCommunityTab
                                                    appState={appState}
                                                    userID={userID}
                                                    setParentAlert={setAlert}
                                                    getParentInfo={getUser}
                                                    panelId={1}
                                                    panelIndex={panelIndex}
                                                    userOriginal={userOriginal}
                                                /> 
                                                
                                                
                                                {/* Assigned Volunteers */}

                                                {userOriginal && userOriginal.role === "Volunteer" ? (
                                                    <VolStatusTab
                                                        appState={appState}
                                                        userID={userID}
                                                        setParentAlert={setAlert}
                                                        getParentInfo={getUser}
                                                        panelId={2}
                                                        panelIndex={panelIndex}
                                                        userOriginal={userOriginal}
                                                    />
                                                ) : userOriginal ? (                                                <MemberStatusTab
                                                    appState={appState}
                                                    userID={userID}
                                                    setParentAlert={setAlert}
                                                    getParentInfo={getUser}
                                                    panelId={2}
                                                    panelIndex={panelIndex}
                                                    userOriginal={userOriginal}
                                                />):""}
                                                {/* Status */}

                                                <UserGeneralPropertiesTab
                                                    appState={appState}
                                                    userID={userID}
                                                    setParentAlert={setAlert}
                                                    getParentInfo={getUser}
                                                    panelId={3}
                                                    panelIndex={panelIndex}
                                                    userOriginal={userOriginal}
                                                />
                                                {/* Notes */}
                                                <UserNotesTab
                                                    appState={appState}
                                                    userID={userID}
                                                    setParentAlert={setAlert}
                                                    getParentInfo={getUser}
                                                    panelId={4}
                                                    panelIndex={panelIndex}
                                                    userOriginal={userOriginal}
                                                />
                                            </>
                                        }
                                    </Box>
                                </Card>
                            </Grid>
                        </Grid>
                        <ChangesUserDialog
                            changesUserDialog={changesUserDialog}
                            setChangesUserDialog={setChangesUserDialog}
                            changesUserDialogExecuting={changesUserDialogExecuting}
                            setChangesUserDialogExecuting={setChangesUserDialogExecuting}
                            toBePanelIndex={toBePanelIndex}
                            setPanelIndex={setPanelIndex}
                            user={userEdit}
                            setParentAlert={setAlert}
                            getParentData={getUser}
                            appState={appState}
                        />
                    </div>
                ) : (
                    <Typography variant="h6" color="inherit" align="center" gutterBottom>
                        Not Authorized. Please refresh and try again.
                    </Typography>
                )}
        </>
    );
}

// ======================== Component PropType Check ========================
ViewUser.propTypes =
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    userID: PropTypes.string.isRequired,
    ToggleDrawerClose: PropTypes.func.isRequired,
    CheckAuthenticationValidity: PropTypes.func.isRequired
}

ViewUser.defaultProps =
{
    appState: {},
    userID: {},
    ToggleDrawerClose: () => { },
    CheckAuthenticationValidity: () => { }
}

export default ViewUser;  // You can even shorthand this line by adding this at the function [Component] declaration stage