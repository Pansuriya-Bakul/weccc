// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================
// import ChangesUserDialog from '../Dialog/ChangesUserDialog';
import UnassignUserDialog from '../../Dialog/UnassignUserDialog';
import AlertMessage from '../../../../../components/AlertMessage';
// ==================== Helpers =====================
import get from '../../../../../helpers/common/get';
import AlertType from '../../../../../helpers/models/AlertType';
import patch from '../../../../../helpers/common/patch';
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
//import Switch from ' @material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';

import { Checkbox, TextField } from '@material-ui/core';

// ==================== MUI Icons ====================
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/Refresh';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SaveIcon from '@material-ui/icons/Save';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import Ballot from '@material-ui/icons/Ballot';
import RemoveIcon from '@material-ui/icons/Remove';
import PersonIcon from '@material-ui/icons/Person';
import VisibilityIcon from '@material-ui/icons/Visibility';

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
const nameRegex = /^[a-zA-Z]+$/;
const phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
const wordsRegex = /^.+$/
const streetRegex = /^(\d{1,})[a-zA-Z0-9\s]+(\.)?$/;    //WIP currently accepts number only
const postalCodeRegex = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i;

const viewUserLinkAdministration = "/administration";
const viewUserLinkStaff = "/staff";

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const UserCommunityTab = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

    // Style variable declaration
    const classes = useStyles();

    // Declaration of Stateful Variables ===
    const { appState, userID, setParentAlert, getParentInfo, panelId, panelIndex, userOriginal } = props;

    const [userEdit, setUserEdit] = useState(null);
    const [selectedDataItemsList, setSelectedDataItemsList] = useState([]);
    const [unassignUserDialog, setUnassignUserDialog] = useState(false);
    const [unassignUserDialogExecuting, setUnassignUserDialogExecuting] = useState(false);
    const [alert, setAlert] = useState(new AlertType());
    const [isManagement, setIsManagement] = useState(false);

    // Functions ===

    const resetInformationProperties = useCallback((event) => {
        if (userOriginal) {
            setUserEdit(
                {
                    ...userOriginal,
                }
            );
        }

    }, [userOriginal]);

    const handleClick = useCallback((event, item) => {

        let previousSelectedIds = selectedDataItemsList.map(elem => elem._id);
        let selectedIndex = previousSelectedIds.indexOf(item._id);
        console.log(previousSelectedIds[selectedIndex]);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedDataItemsList, item);
        }
        else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedDataItemsList.slice(1));
        }
        else if (selectedIndex === selectedDataItemsList.length - 1) {
            newSelected = newSelected.concat(selectedDataItemsList.slice(0, -1));
        }
        else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedDataItemsList.slice(0, selectedIndex),
                selectedDataItemsList.slice(selectedIndex + 1),
            );
        }

        setSelectedDataItemsList(newSelected);
        console.log(selectedDataItemsList);
    }, [selectedDataItemsList, setSelectedDataItemsList]);

    const isSelected = useCallback((item) => {

        let previousSelectedIds = selectedDataItemsList.map(elem => elem._id);
        return previousSelectedIds.indexOf(item._id) !== -1;

    }, [selectedDataItemsList]);

    const dialogHandler = useCallback(() => {
        //  setUnassignUserDialogExecuting(true)
        setUnassignUserDialog(true)


    }, [setUnassignUserDialog, appState, setParentAlert, selectedDataItemsList]);

    // Hooks ===

    useEffect(() => {
        if (appState.role === "Admin" || appState.role === "Coordinator") {
            setIsManagement(true)
        }
    }, []);

    useEffect(() => {
        setUserEdit(userOriginal);
    }, [userOriginal]);



    useEffect(() => {
        if (panelIndex !== panelId) {
            resetInformationProperties();
        }

    }, [panelIndex, panelId, resetInformationProperties]);

    // Render Section ===
    // const isItemSelected = isSelected(item);
    // const labelId = `enhanced-table-checkbox-${index}`;

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

                                {/* <Grid item>
                                    <Typography variant="h6" component="h6">
                                        My Community
                                    </Typography>
                                    <Divider />
                                </Grid> */}
                                <Grid item xs>
                                    <Box mx={3} my={1} boxShadow={0}>
                                        {/* <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}> */}
                                        {/* <Grid item>
                                                    <Tooltip
                                                        placement="bottom"
                                                        title="Unlock editable fields"
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => { editablePropertiesHandler(); }}
                                                        >
                                                            {editable? (
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
                                                            { changedInformationProperties? "Changes have been made." : "" }
                                                        </Typography>
                                                    </Collapse>
                                                </Grid> */}
                                        {/* </Grid> */}
                                    </Box>
                                </Grid>
                                {/* <Grid item>
                                    <Tooltip
                                        placement="left"
                                        title="This page views user information."
                                    >
                                        <IconButton>
                                            <HelpOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid> */}
                            </Grid>
                            <Grid item xs={12}>
                                <UnassignUserDialog
                                    userEdit={userEdit}
                                    unassignUserDialog={unassignUserDialog}
                                    setUnassignUserDialog={setUnassignUserDialog}
                                    unassignUserDialogExecuting={unassignUserDialogExecuting}
                                    setUnassignUserDialogExecuting={setUnassignUserDialogExecuting}
                                    selectedDataItemsList={selectedDataItemsList}
                                    setSelectedDataItemsList={setSelectedDataItemsList}
                                    setParentAlert={setAlert}
                                    appState={appState}
                                />
                                <Box mx={1} my={1} boxShadow={0}>
                                    <Grid container direction="row" justifyContent="flex-start" alignItems="stretch" spacing={3}>
                                        {userEdit.role === "Patient" ? (
                                            <>

                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" component="h6" color="textPrimary">
                                                        Assigned Helpers
                                                    </Typography>
                                                    <Divider light />
                                                </Grid>
                                                {isManagement && <Grid item>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        startIcon={<PersonIcon />}
                                                        disabled={selectedDataItemsList.length > 0 ? false : true}
                                                        onClick={() => { dialogHandler(); }}
                                                    // onClick={() => { resetInformationProperties(); }}
                                                    >
                                                        remove
                                                    </Button>
                                                </Grid>}
                                                {isManagement && <Grid item>
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        color="secondary"
                                                        startIcon={<PersonIcon />}
                                                        disabled
                                                    // onClick={() => { resetInformationProperties(); }}
                                                    >
                                                        assign
                                                    </Button>
                                                </Grid>}

                                                <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                                                    <Grid item xs>
                                                        {userEdit.workers ? (
                                                            <List dense={false}>
                                                                {userEdit.workers.map((item, index) => {

                                                                    let link = appState.role === "Admin" ? viewUserLinkAdministration : "";
                                                                    link = appState.role === "Coordinator" ? viewUserLinkStaff : link;
                                                                    link = appState.role === "Volunteer" ? viewUserLinkStaff : link;
                                                                    const isItemSelected = isSelected(item);
                                                                    const labelId = `enhanced-table-checkbox-${index}`;


                                                                    return (


                                                                        <ListItem key={`helper${index}-${item._id}`} dense={false} divider={true}>
                                                                            {isManagement && <Checkbox
                                                                                checked={isItemSelected}
                                                                                onClick={(event) => handleClick(event, item)}
                                                                                inputProps={{ 'aria-labelledby': labelId }}
                                                                            />}
                                                                            <ListItemAvatar>
                                                                                <Avatar>
                                                                                    <AccountCircleIcon />
                                                                                </Avatar>
                                                                            </ListItemAvatar>
                                                                            <ListItemText id={labelId}
                                                                                primary={item.info ? item.info.name : ""}
                                                                                secondary={item.role ? item.role : ""}
                                                                            />
                                                                            <ListItemSecondaryAction>

                                                                                <IconButton edge="end" aria-label="edit" size="small"
                                                                                    disabled
                                                                                    component={Link} to={link + "/users/view/" + item._id}
                                                                                >
                                                                                    <VisibilityIcon />
                                                                                </IconButton>

                                                                            </ListItemSecondaryAction>
                                                                        </ListItem>

                                                                    );
                                                                })}
                                                            </List>
                                                        ) : (
                                                            <Typography variant="body2" component="h6" color="textPrimary">
                                                                None available
                                                            </Typography>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ) : (
                                            <>
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" component="h6" color="textPrimary">
                                                        {/* Assigned Clients */}
                                                        Assigned Members
                                                    </Typography>
                                                    <Divider light />
                                                </Grid>
                                                {isManagement && <>
                                                    <Grid item>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                            startIcon={<PersonIcon />}
                                                            disabled={selectedDataItemsList.length > 0 ? false : true}
                                                            // onClick={() => { resetInformationProperties(); }}
                                                            onClick={() => { dialogHandler(); }}
                                                        >
                                                            remove
                                                        </Button>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="secondary"
                                                            startIcon={<PersonIcon />}
                                                            disabled
                                                        // onClick={() => { resetInformationProperties(); }}
                                                        >
                                                            assign
                                                        </Button>
                                                    </Grid>
                                                </>}
                                                <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                                                    <Grid item xs>
                                                        {userEdit.patients ? (
                                                            <List dense={false}>
                                                                {userEdit.patients.map((item, index) => {

                                                                    let link = appState.role === "Admin" ? viewUserLinkAdministration : "";
                                                                    link = appState.role === "Coordinator" ? viewUserLinkStaff : link;
                                                                    link = appState.role === "Volunteer" ? viewUserLinkStaff : link;
                                                                    const isItemSelected = isSelected(item);
                                                                    const labelId = `enhanced-table-checkbox-${index}`;

                                                                    return (
                                                                        <ListItem key={`client${index}-${item._id}`} dense={false} divider={true}>
                                                                            {isManagement && <Checkbox
                                                                                checked={isItemSelected}
                                                                                onClick={(event) => handleClick(event, item)}
                                                                                inputProps={{ 'aria-labelledby': labelId }}
                                                                            />}
                                                                            <ListItemAvatar>
                                                                                <Avatar>
                                                                                    <AccountCircleIcon />
                                                                                </Avatar>
                                                                            </ListItemAvatar>
                                                                            <ListItemText id={labelId}
                                                                                primary={item.info ? item.info.name : ""}
                                                                                // secondary={item.role ? item.role : ""}
                                                                                secondary={item.role ? (item.role === 'Patient' ? 'Member' : "") : ""}
                                                                            />
                                                                            <ListItemSecondaryAction>

                                                                                <IconButton edge="end" aria-label="edit" size="small"
                                                                                    disabled={item._id === appState._id ? true : false}
                                                                                    component={Link} to={link + "/users/view/" + item._id}
                                                                                >
                                                                                    <VisibilityIcon />
                                                                                </IconButton>

                                                                            </ListItemSecondaryAction>
                                                                        </ListItem>
                                                                    );
                                                                })}
                                                            </List>
                                                        ) : (
                                                            <Typography variant="body2" component="h6" color="textPrimary">
                                                                None available
                                                            </Typography>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            </>
                                        )}

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
UserCommunityTab.propTypes =
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

UserCommunityTab.defaultProps =
{
    appState: {},
    userID: null,
    setParentAlert: () => { },
    getParentInfo: () => { },
    panelId: null,
    panelIndex: null,
    userOriginal: {}
}

export default UserCommunityTab;  // You can even shorthand this line by adding this at the function [Component] declaration stage