// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Components ==================
// import ChangesUserDialog from '../Dialog/ChangesUserDialog';

// ==================== Helpers =====================
import patch from '../../../../../helpers/common/patch';
import AlertType from '../../../../../helpers/models/AlertType';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

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
import RefreshIcon from '@material-ui/icons/Refresh';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import SaveIcon from '@material-ui/icons/Save';
import { use } from 'passport';
import { set } from 'joi/lib/types/lazy';
import StatusHistoryTable from "./StatusHistoryTable";
import CompletedSurveysTable from "./CompletedSurveysTable";
import get from "../../../../../helpers/common/get";


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


// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const VolStatusTab = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

    // Style variable declaration
    const classes = useStyles();

    // Declaration of Stateful Variables ===
    const { appState, userID, setParentAlert, getParentInfo, panelId, panelIndex, userOriginal } = props;

    const [userEdit, setUserEdit] = useState(null);

    // Unlock editable fields
    const [editable, setEditable] = useState(false);

    const [changedGeneralProperties, setChangedGeneralProperties] = useState(false);

    //  Editable Variables ==========
    const [selectedStatus, setSelectedStatus] = useState("");
    const [volInfo, setVolInfo] = useState({ volType: "", startDate: "", endDate: "", fieldOfStudy: "", school: "" });
    const [memberCollections, setMemberCollections] = useState([]);

    const [role, setRole] = useState("");

    const [enabled, setEnabled] = useState(false);
    // Alert variable
    const [alert, setAlert] = useState(new AlertType());

    // Functions ===

    const editablePropertiesHandler = useCallback((event) => {

        setEditable(!editable);

        if (userOriginal) {
            setUserEdit({
                ...userOriginal
            });


            setRole(userOriginal.role);
            setEnabled(userOriginal.enabled);
            setSelectedStatus(userOriginal.status);

            if (userOriginal.volInfo) {
                setVolInfo({
                    volType: userOriginal.volInfo.volType,
                    startDate: userOriginal.volInfo.startDate,
                    endDate: userOriginal.volInfo.endDate,
                    fieldOfStudy: userOriginal.volInfo.fieldOfStudy,
                    school: userOriginal.volInfo.school
                });
            }

        }

    }, [editable, setEditable, setVolInfo, userOriginal, setRole, setEnabled]);


    const statusHandler = useCallback((event) => {

        // setUserEdit({
        //     ...userEdit,
        //     role: event.target.value
        // });
        setUserEdit({
            ...userEdit,
            status: event.target.value
        });

        setSelectedStatus(event.target.value);

    }, [setSelectedStatus]);


    const volTypeHandler = useCallback((event, key) => {
        switch (key) {
            case "volType":
                setVolInfo({ ...volInfo, volType: event.target.value });
                break;

            case "startDate":
                const sDate = event.target.value || "";
                setVolInfo({ ...volInfo, startDate: sDate });
                break;

            case "endDate":
                const eDate = event.target.value || "";
                setVolInfo({ ...volInfo, endDate: eDate });
                break;

            case "fieldOfStudy":
                setVolInfo({ ...volInfo, fieldOfStudy: event.target.value });
                break;

            case "school":

                setVolInfo({ ...volInfo, school: event.target.value });
                break;
        }
    }, [userEdit, setUserEdit, volInfo, setVolInfo]);


    // Reset the editable fields to the original values
    const resetGeneralProperties = useCallback((event) => {
        if (userOriginal) {
            setUserEdit({
                ...userOriginal
            });


            setRole(userOriginal.role);
            setEnabled(userOriginal.enabled);

            setSelectedStatus(userOriginal.status);

            // setVolInfo({
            //     volType: userOriginal.volInfo.volType, 
            //     startDate: userOriginal.volInfo.startDate, 
            //     endDate: userOriginal.volInfo.endDate, 
            //     fieldOfStudy: userOriginal.volInfo.fieldOfStudy, 
            //     school: userOriginal.volInfo.school
            // });

            if (userOriginal.volInfo) {
                setVolInfo({
                    volType: userOriginal.volInfo.volType,
                    startDate: userOriginal.volInfo.startDate,
                    endDate: userOriginal.volInfo.endDate,
                    fieldOfStudy: userOriginal.volInfo.fieldOfStudy,
                    school: userOriginal.volInfo.school
                });
            }
        }

    }, [userOriginal, setUserEdit, setRole, setEnabled]);


    // Save the editable fields to the database
    const saveGeneralProperties = useCallback((event) => {

        volInfo.startDate = volInfo.startDate || "";
        volInfo.endDate = volInfo.endDate || "";

        let updateData = {
            status: selectedStatus,
            volInfo: volInfo,
        };

        if (userID != null) {
            patch("users/" + userID, appState.token, updateData, (error, response) => {
                if (error) {
                    setParentAlert(new AlertType('Unable to save changes to User. Please refresh and try again.', "error"));
                }
                else {
                    if (response.status === 200 || response.status === 304) {
                        getParentInfo();
                        resetGeneralProperties();
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


    }, [appState, userID, userEdit, role, enabled, volInfo, setParentAlert, getParentInfo]);


    const getMemberCollections = useCallback(() => {

        get("membercollections/client/"+ userID, appState.token, (err, res) => {
            if (err) {
                //Bad callback call
                //setAlert(new AlertType(err.message, "error"));
                setAlert(new AlertType('Unable to retrieve Member Series. Please refresh and try again.', "error"));
            }
            else {
                if (res.status === 200){
                        setMemberCollections(res.data.memberCollections);
                }
                else {
                    //Bad HTTP Response
                    setAlert(new AlertType('Unable to retrieve Member Series. Please refresh and try again.', "error"));
                }
            }

        });
    }, [memberCollections, appState.token]);
    // Hooks ===

    useEffect(() => {
        if (userOriginal) {

            setRole(userOriginal.role);
            setEnabled(userOriginal.enabled);
            setSelectedStatus(userOriginal.status);
            getMemberCollections();

            if (userOriginal.volInfo) {
                setVolInfo({
                    volType: userOriginal.volInfo.volType,
                    startDate: userOriginal.volInfo.startDate,
                    endDate: userOriginal.volInfo.endDate,
                    fieldOfStudy: userOriginal.volInfo.fieldOfStudy,
                    school: userOriginal.volInfo.school
                });
            } 
            setUserEdit(userOriginal);
        }
        

    }, [userOriginal]);

    useEffect(() => {
        if (userOriginal) {
            if (role !== userOriginal.role) {
                setChangedGeneralProperties(true);
            }
            else {
                setChangedGeneralProperties(false);
            }
        }

    }, [userOriginal, role]);

    useEffect(() => {
        if (userOriginal) {
            if (selectedStatus !== userOriginal.status) {
                setChangedGeneralProperties(true);
            }
            else {
                setChangedGeneralProperties(false);
            }
        }

    }, [userOriginal, selectedStatus]);

    useEffect(() => {
        if (userOriginal) {
            if (userOriginal.volInfo) {
                if (volInfo.volType !== userOriginal.volInfo.volType) {
                    setChangedGeneralProperties(true);
                }
                else {
                    setChangedGeneralProperties(false);
                }
            } else {
                setChangedGeneralProperties(true);
            }
        }

    }, [userOriginal, volInfo.volType, setVolInfo]);

    useEffect(() => {
        if (userOriginal) {
            if (userOriginal.volInfo) {
                if (volInfo.startDate !== userOriginal.volInfo.startDate) {
                    setChangedGeneralProperties(true);
                }
                else {
                    setChangedGeneralProperties(false);
                }
            } else {
                setChangedGeneralProperties(true);
            }
        }

    }, [userOriginal, volInfo.startDate, setVolInfo]);

    useEffect(() => {
        if (userOriginal) {
            if (userOriginal.volInfo) {
                if (volInfo.endDate !== userOriginal.volInfo.endDate) {
                    setChangedGeneralProperties(true);
                }
                else {
                    setChangedGeneralProperties(false);
                }
            } else {
                setChangedGeneralProperties(true);
            }
        }

    }, [userOriginal, volInfo.endDate, setVolInfo]);

    useEffect(() => {
        if (userOriginal) {
            if (userOriginal.volInfo) {
                if (volInfo.school !== userOriginal.volInfo.school) {
                    setChangedGeneralProperties(true);
                }
                else {
                    setChangedGeneralProperties(false);
                }
            } else {
                setChangedGeneralProperties(true);
            }
        }

    }, [userOriginal, volInfo.school, setVolInfo]);

    useEffect(() => {
        if (userOriginal) {
            if (userOriginal.volInfo) {
                if (volInfo.fieldOfStudy !== userOriginal.volInfo.fieldOfStudy) {
                    setChangedGeneralProperties(true);
                }
                else {
                    setChangedGeneralProperties(false);
                }
            } else {
                setChangedGeneralProperties(true);
            }
        }

    }, [userOriginal, volInfo.fieldOfStudy, setVolInfo]);

    useEffect(() => {
        if (userOriginal) {
            if (enabled !== userOriginal.enabled) {
                setChangedGeneralProperties(true);
            }
            else {
                setChangedGeneralProperties(false);
            }
        }

    }, [userOriginal, enabled]);

    useEffect(() => {
        if (panelIndex !== panelId) {
            resetGeneralProperties();
        }

    }, [panelIndex, panelId, resetGeneralProperties]);

    // useEffect(() => {
    //     if (JSON.stringify(userEdit) === JSON.stringify(userOriginal)) {
    //         setChangedGeneralProperties(false);
    //     }
    //     else {
    //         setChangedGeneralProperties(true);
    //     }

    // }, [userOriginal, userEdit, setChangedGeneralProperties]);

    const formatDate = (dateString) => {
        return dateString.substring(0, 10); // Extract the yyyy-mm-dd part
      };


    // Render Section ===

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
                                        Status
                                    </Typography>
                                    <Divider />
                                </Grid>
                                <Grid item xs>
                                    <Box mx={3} my={1} boxShadow={0}>
                                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                            {appState.role != 'Volunteer' && appState.role != 'Patient' && <Grid item>
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
                                            </Grid>}
                                            <Grid item
                                                hidden={!editable}
                                            >
                                                <Collapse in={editable}>
                                                    <ButtonGroup color="primary">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="default"
                                                            //  disabled={!changedGeneralProperties}
                                                            startIcon={<RefreshIcon />}
                                                            onClick={() => { resetGeneralProperties(); }}
                                                        >
                                                            Reset
                                                        </Button>
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="secondary"
                                                            disabled={!changedGeneralProperties}
                                                            startIcon={<SaveIcon />}
                                                            onClick={() => { saveGeneralProperties(); }}
                                                        >
                                                            Save
                                                        </Button>
                                                    </ButtonGroup>
                                                </Collapse>
                                            </Grid>
                                            <Grid item
                                            // hidden={!editable}
                                            >
                                                <Collapse in={changedGeneralProperties}>
                                                    <Typography variant="caption" color="textSecondary" align="left" gutterBottom>
                                                        {changedGeneralProperties ? "Changes have been made." : ""}
                                                    </Typography>
                                                </Collapse>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Tooltip
                                        placement="left"
                                        title="This page view status information for the selected user."
                                    >
                                        <IconButton>
                                            <HelpOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Typography variant="subtitle2" component="subtitle1" style={{fontStyle: 'italic'}}>
                                Member since {formatDate(userOriginal.createdAt)}
                            </Typography>
                            {/*<Grid item xs={12}>*/}
                            {/*    <Box mx={1} my={1} boxShadow={0}>*/}
                            {/*        <Grid container direction="row" justifyContent="flex-start" alignItems="stretch" spacing={3}>*/}

                            {/*            <Grid item xs={3}>*/}
                            {/*                <TextField*/}
                            {/*                    id="status"*/}
                            {/*                    select*/}
                            {/*                    //required*/}
                            {/*                    fullWidth*/}
                            {/*                    label="Status"*/}
                            {/*                    value={selectedStatus}*/}
                            {/*                    // value={(userEdit.status) ? userEdit.status : ""}*/}
                            {/*                    onChange={(event) => { statusHandler(event); }}*/}
                            {/*                    size="small"*/}
                            {/*                    variant="outlined"*/}
                            {/*                    readOnly={editable ? false : true}*/}
                            {/*                    disabled={editable ? false : true}*/}
                            {/*                    InputProps={{*/}
                            {/*                        style: (selectedStatus === "active") ? { color: "green" } : { color: "red" }*/}
                            {/*                    }}*/}

                            {/*                >*/}
                            {/*                    <MenuItem key={'active'} value={'active'} style={{ color: 'green' }}>Active</MenuItem>*/}
                            {/*                    <MenuItem key={'terminated'} value={'terminated'} style={{ color: 'red' }}>Terminated</MenuItem>*/}

                            {/*                </TextField>*/}
                            {/*            </Grid>*/}
                            {/*            <Grid item xs={8}></Grid>*/}

                            {/*            {(() => {*/}
                            {/*                if (selectedStatus === 'active') { // Active*/}
                            {/*                    return (<>*/}
                            {/*                        <Grid item xs={3}>*/}
                            {/*                            <TextField*/}
                            {/*                                id="vol-type"*/}
                            {/*                                select*/}
                            {/*                                //required*/}
                            {/*                                fullWidth*/}
                            {/*                                label="Volunteer Type"*/}
                            {/*                                // value={(userEdit.volInfo) ? userEdit.volInfo.volType : ""}*/}
                            {/*                                value={volInfo.volType ? volInfo.volType : ""}*/}
                            {/*                                onChange={(event) => { volTypeHandler(event, "volType"); }}*/}
                            {/*                                size="small"*/}
                            {/*                                variant="outlined"*/}
                            {/*                                readOnly={editable ? false : true}*/}
                            {/*                                disabled={editable ? false : true}*/}
                            {/*                            >*/}
                            {/*                                <MenuItem key={'student intern'} value={'student intern'}>Student Intern</MenuItem>*/}
                            {/*                                <MenuItem key={'community volunteer'} value={'community volunteer'}>Community Volunteer</MenuItem>*/}

                            {/*                            </TextField>*/}
                            {/*                        </Grid>*/}
                            {/*                        <Grid item xs={8}></Grid>*/}
                            {/*                        {volInfo.volType === 'student intern' ? (*/}
                            {/*                            <>*/}
                            {/*                                <Grid item xs={3}>*/}
                            {/*                                    <TextField*/}
                            {/*                                        id="start-date"*/}
                            {/*                                        fullWidth*/}
                            {/*                                        label="Placement Start Date"*/}
                            {/*                                        type="date"*/}
                            {/*                                        value={volInfo.startDate ? new Date(volInfo.startDate).toISOString().split('T')[0] : ''}*/}
                            {/*                                        // error={dateOfBirthError}*/}
                            {/*                                        onChange={(event) => { volTypeHandler(event, "startDate"); }}*/}
                            {/*                                        InputLabelProps={{*/}
                            {/*                                            shrink: true*/}
                            {/*                                        }}*/}
                            {/*                                        inputProps={*/}
                            {/*                                            {*/}
                            {/*                                                // required: true,*/}
                            {/*                                                max: new Date().toISOString().split('T')[0]*/}
                            {/*                                            }*/}
                            {/*                                        }*/}
                            {/*                                        size="small"*/}
                            {/*                                        variant="outlined"*/}
                            {/*                                        // required*/}
                            {/*                                        readOnly={editable ? false : true}*/}
                            {/*                                        disabled={editable ? false : true}*/}
                            {/*                                    />*/}
                            {/*                                </Grid>*/}
                            {/*                                <Grid item xs={8}></Grid>*/}

                            {/*                                /!* End date *!/*/}
                            {/*                                <Grid item xs={3}>*/}
                            {/*                                    <TextField*/}
                            {/*                                        id="end-date"*/}
                            {/*                                        fullWidth*/}
                            {/*                                        label="Placement End Date"*/}
                            {/*                                        type="date"*/}
                            {/*                                        value={volInfo.endDate ? new Date(volInfo.endDate).toISOString().split('T')[0] : ''}*/}
                            {/*                                        // error={dateOfBirthError}*/}
                            {/*                                        onChange={(event) => { volTypeHandler(event, "endDate"); }}*/}
                            {/*                                        InputLabelProps={{*/}
                            {/*                                            shrink: true*/}
                            {/*                                        }}*/}
                            {/*                                        inputProps={*/}
                            {/*                                            {*/}
                            {/*                                                // required: true,*/}
                            {/*                                                // max: new Date().toISOString().split('T')[0]*/}
                            {/*                                            }*/}
                            {/*                                        }*/}
                            {/*                                        size="small"*/}
                            {/*                                        variant="outlined"*/}
                            {/*                                        // required*/}
                            {/*                                        readOnly={editable ? false : true}*/}
                            {/*                                        disabled={editable ? false : true}*/}
                            {/*                                    />*/}
                            {/*                                </Grid>*/}
                            {/*                                <Grid item xs={8}></Grid>*/}

                            {/*                                /!* Field of Study *!/*/}
                            {/*                                <Grid item xs={3}>*/}
                            {/*                                    <TextField*/}
                            {/*                                        id="field-of-study"*/}
                            {/*                                        // required*/}
                            {/*                                        size="small"*/}
                            {/*                                        variant="outlined"*/}
                            {/*                                        fullWidth label="Field of Study"*/}
                            {/*                                        onChange={(event) => { volTypeHandler(event, "fieldOfStudy"); }}*/}
                            {/*                                        value={volInfo.fieldOfStudy}*/}
                            {/*                                        // error={nameError}*/}
                            {/*                                        readOnly={editable ? false : true}*/}
                            {/*                                        disabled={editable ? false : true}*/}
                            {/*                                    />*/}
                            {/*                                </Grid>*/}
                            {/*                                <Grid item xs={8}></Grid>*/}

                            {/*                                /!* School *!/*/}
                            {/*                                <Grid item xs={3}>*/}
                            {/*                                    <TextField*/}
                            {/*                                        id="school"*/}
                            {/*                                        // required*/}
                            {/*                                        size="small"*/}
                            {/*                                        variant="outlined"*/}
                            {/*                                        fullWidth label="School"*/}
                            {/*                                        onChange={(event) => { volTypeHandler(event, "school"); }}*/}
                            {/*                                        value={volInfo.school}*/}
                            {/*                                        // error={nameError}*/}
                            {/*                                        readOnly={editable ? false : true}*/}
                            {/*                                        disabled={editable ? false : true}*/}
                            {/*                                    />*/}
                            {/*                                </Grid>*/}
                            {/*                                <Grid item xs={8}></Grid>*/}
                            {/*                            </>*/}

                            {/*                        ) : (*/}
                            {/*                            volInfo.volType === "community volunteer" ? <Grid item xs={3}>*/}
                            {/*                                <TextField*/}
                            {/*                                    id="start-date"*/}
                            {/*                                    fullWidth*/}
                            {/*                                    label="Placement Start Date"*/}
                            {/*                                    type="date"*/}
                            {/*                                    value={volInfo.startDate ? new Date(volInfo.startDate).toISOString().split('T')[0] : ''}*/}
                            {/*                                    // error={dateOfBirthError}*/}
                            {/*                                    onChange={(event) => { volTypeHandler(event, "startDate"); }}*/}
                            {/*                                    InputLabelProps={{*/}
                            {/*                                        shrink: true*/}
                            {/*                                    }}*/}
                            {/*                                    inputProps={*/}
                            {/*                                        {*/}
                            {/*                                            // required: true,*/}
                            {/*                                            max: new Date().toISOString().split('T')[0]*/}
                            {/*                                        }*/}
                            {/*                                    }*/}
                            {/*                                    size="small"*/}
                            {/*                                    variant="outlined"*/}
                            {/*                                    // required*/}
                            {/*                                    readOnly={editable ? false : true}*/}
                            {/*                                    disabled={editable ? false : true}*/}
                            {/*                                />*/}
                            {/*                            </Grid> : ""*/}
                            {/*                        )}*/}

                            {/*                    </>);*/}

                            {/*                } else { // terminated*/}
                            {/*                    return (<Grid item xs={3}>*/}
                            {/*                        <TextField*/}
                            {/*                            id="end-date"*/}
                            {/*                            fullWidth*/}
                            {/*                            label="End Date"*/}
                            {/*                            type="date"*/}
                            {/*                            value={volInfo.endDate ? new Date(volInfo.endDate).toISOString().split('T')[0] : ''}*/}
                            {/*                            // error={dateOfBirthError}*/}
                            {/*                            onChange={(event) => { volTypeHandler(event, "endDate"); }}*/}
                            {/*                            InputLabelProps={{*/}
                            {/*                                shrink: true*/}
                            {/*                            }}*/}
                            {/*                            inputProps={*/}
                            {/*                                {*/}
                            {/*                                    // required: true,*/}
                            {/*                                    max: new Date().toISOString().split('T')[0]*/}
                            {/*                                }*/}
                            {/*                            }*/}
                            {/*                            size="small"*/}
                            {/*                            variant="outlined"*/}
                            {/*                            // required*/}
                            {/*                            readOnly={editable ? false : true}*/}
                            {/*                            disabled={editable ? false : true}*/}
                            {/*                        />*/}
                            {/*                    </Grid>);*/}
                            {/*                }*/}
                            {/*            })()}*/}



                            {/*        </Grid>*/}
                            {/*    </Box>*/}
                            {/*</Grid>*/}
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
                    <Grid item xs={12} container direction="column" spacing={1} style={{ marginTop: '32px' }}>
                        <Typography variant="subtitle1" component="h6">
                            Programs
                        </Typography>

                        <Divider />

                        {userOriginal.memberStatusInfo.statusHistory &&
                            <StatusHistoryTable
                                data={userOriginal.memberStatusInfo.statusHistory ? userOriginal.memberStatusInfo.statusHistory : []}
                            />
                        }
                    </Grid>

                    <Grid item xs={12} container direction="column" spacing={1} style={{ marginTop: '32px' }}>
                        <Typography variant="subtitle1" component="h6">
                            Completed Surveys
                        </Typography>

                        <Divider />

                        {memberCollections &&
                            <CompletedSurveysTable
                                data={memberCollections ? memberCollections : []}
                            />
                        }
                    </Grid>
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
VolStatusTab.propTypes =
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

VolStatusTab.defaultProps =
{
    appState: {},
    userID: null,
    setParentAlert: () => { },
    getParentInfo: () => { },
    panelId: null,
    panelIndex: null,
    userOriginal: {}
}

export default VolStatusTab;

