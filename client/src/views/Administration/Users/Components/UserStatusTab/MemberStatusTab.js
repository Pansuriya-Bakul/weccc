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

import StatusHistoryTable from './StatusHistoryTable';
import CompletedSurveysTable from './CompletedSurveysTable';
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

const MemberStatusTab = (props) => { // Notice the arrow function... regular function()  works too

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
    const [memberStatusInfo, setMemberStatusInfo] = useState({ activeType: "", statusHistory: [], referralDate: "", terminationReason: '', deceasedDate: "" });
    const [statusHistory, setStatusHistory] = useState({ status: "", activeType: "", startDate: "", endDate: "" });
    const [memberCollections, setMemberCollections] = useState([]);

    // Alert variable
    const [alert, setAlert] = useState(new AlertType());

    const [role, setRole] = useState("");

    const [enabled, setEnabled] = useState(false);

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

            if (userOriginal.memberStatusInfo) {
                setMemberStatusInfo({
                    activeType: userOriginal.memberStatusInfo.activeType,
                    startDate: userOriginal.memberStatusInfo.startDate,
                    endDate: userOriginal.memberStatusInfo.endDate,
                    referralDate: userOriginal.memberStatusInfo.referralDate,
                    terminationReason: userOriginal.memberStatusInfo.terminationReason,
                    deceasedDate: userOriginal.memberStatusInfo.deceasedDate,
                    statusHistory: userOriginal.memberStatusInfo.statusHistory || [],
                });
            }

        }

    }, [editable, setEditable, setMemberStatusInfo, userOriginal, setRole, setEnabled]);


    // const statusHandler = useCallback((event) => {


    //     setUserEdit({
    //         ...userEdit,
    //         status: event.target.value
    //     });

    //     setSelectedStatus(event.target.value);
    //     setStatusHistory({ ...statusHistory, status: event.target.value, startDate: new Date().toISOString() });

    // }, [setSelectedStatus]);


    // const activeTypeHandler = useCallback((event, key) => {
    //     switch (key) {
    //         case "activeType":
    //             setMemberStatusInfo({ ...memberStatusInfo, activeType: event.target.value });
    //             setStatusHistory({ ...statusHistory, status: selectedStatus, activeType: event.target.value, startDate: new Date().toISOString() });
    //             break;
    //         case "referralDate":
    //             setMemberStatusInfo({ ...memberStatusInfo, referralDate: event.target.value });
    //             break;
    //         case "terminationReason":
    //             setMemberStatusInfo({ ...memberStatusInfo, terminationReason: event.target.value });
    //             break;
    //         case "deceasedDate":
    //             setMemberStatusInfo({ ...memberStatusInfo, deceasedDate: event.target.value });
    //             break;
    //     }
    // }, [userEdit, setUserEdit, memberStatusInfo, setMemberStatusInfo]);


    // set the intial status history if not already set
    const setInitHistory = () => {
        if (userOriginal.memberStatusInfo) {
            if (!userOriginal.memberStatusInfo.statusHistory || userOriginal.memberStatusInfo.statusHistory.length === 0) {
                let history = {
                    status: userOriginal.status,
                    activeType: userOriginal.memberStatusInfo.activeType || "",
                    startDate: userOriginal.createdAt,
                    endDate: userOriginal.memberStatusInfo.endDate || ""
                }

                let updateData = {
                    memberStatusInfo: {
                        statusHistory: [history]
                    }
                }

                patch("users/" + userID, appState.token, updateData, (error, response) => {
                    if (error) {
                        setParentAlert(new AlertType('Unable to set status history', "error"));
                    }
                    else {
                        if (response.status === 200 || response.status === 304) {

                            getParentInfo();
                            resetGeneralProperties();
                        }
                        else {
                            setParentAlert(new AlertType('Unable to set status history', "error"));
                        }
                    }
                });

            }
        } else {
            let updateData = {
                memberStatusInfo: {
                    activeType: "",
                    statusHistory: [
                        {
                            status: userOriginal.status,
                            activeType: "",
                            startDate: userOriginal.createdAt,
                            endDate: ""
                        }
                    ],
                    referralDate: "",
                    terminationReason: "",
                    deceasedDate: ""
                }
            }

            patch("users/" + userID, appState.token, updateData, (error, response) => {
                if (error) {
                    setParentAlert(new AlertType('Unable to set status history', "error"));
                }
                else {
                    if (response.status === 200 || response.status === 304) {

                        getParentInfo();
                        resetGeneralProperties();
                    }
                    else {
                        setParentAlert(new AlertType('Unable to set status history', "error"));
                    }
                }
            });
        }
    };


    // Reset the editable fields to the original values
    const resetGeneralProperties = useCallback((event) => {

        setStatusHistory({ status: "", activeType: "", startDate: "", endDate: "" });

        if (userOriginal) {
            setUserEdit({
                ...userOriginal
            });


            setRole(userOriginal.role);
            setEnabled(userOriginal.enabled);

            setSelectedStatus(userOriginal.status);
            setStatusHistory({ status: userOriginal.status, activeType: "", startDate: "", endDate: "", referralDate: "", terminationReason: "", deceasedDate: "" });


            // setMemberStatusInfo({
            //     activeType: userOriginal.memberStatusInfo.activeType, 
            //     startDate: userOriginal.memberStatusInfo.startDate, 
            //     endDate: userOriginal.memberStatusInfo.endDate, 
            //     fieldOfStudy: userOriginal.memberStatusInfo.fieldOfStudy, 
            //     school: userOriginal.memberStatusInfo.school
            // });

            if (userOriginal.memberStatusInfo) {
                setMemberStatusInfo({
                    activeType: userOriginal.memberStatusInfo.activeType,
                    startDate: userOriginal.memberStatusInfo.startDate,
                    endDate: userOriginal.memberStatusInfo.endDate,
                    referralDate: userOriginal.memberStatusInfo.referralDate,
                    terminationReason: userOriginal.memberStatusInfo.terminationReason,
                    deceasedDate: userOriginal.memberStatusInfo.deceasedDate,
                    statusHistory: userOriginal.memberStatusInfo.statusHistory || [],
                });
            }
        }

    }, [userOriginal, setUserEdit, setRole, setEnabled]);


    // update the last status history end date
    const updateLastStatusEndDate = () => {

            let history = memberStatusInfo.statusHistory;

            let lastStatus = history[history.length - 1];
    
            if (lastStatus) {
                lastStatus.endDate = new Date().toISOString();
                history[history.length - 1] = lastStatus;
                setMemberStatusInfo({ ...memberStatusInfo, statusHistory: history });
            }
    };


    // Save the editable fields to the database
    const saveGeneralProperties = useCallback((event) => {

        if (statusHistory) {
            updateLastStatusEndDate();
            let history = memberStatusInfo.statusHistory;
            history.push(statusHistory);
            setMemberStatusInfo({ ...memberStatusInfo, statusHistory: history });
        }

        let updateData = {
            status: selectedStatus,
            memberStatusInfo: memberStatusInfo,
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


    }, [appState, userID, userEdit, role, enabled, memberStatusInfo, setParentAlert, getParentInfo, statusHistory]);


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
        setMemberStatusInfo({ activeType: "", statusHistory: [], referralDate: "", terminationReason: '', deceasedDate: "" });
    }, []);

    useEffect(() => {
        if (userOriginal) {
            setInitHistory();
            getMemberCollections();
        }
    }, [userOriginal]);

    useEffect(() => {
        if (userOriginal) {

            setRole(userOriginal.role);
            setEnabled(userOriginal.enabled);
            setSelectedStatus(userOriginal.status);



            if (userOriginal.memberStatusInfo) {
                setMemberStatusInfo({
                    activeType: userOriginal.memberStatusInfo.activeType,
                    // statusHistory: userOriginal.memberStatusInfo.statusHistory,
                    referralDate: userOriginal.memberStatusInfo.referralDate,
                    terminationReason: userOriginal.memberStatusInfo.terminationReason,
                    deceasedDate: userOriginal.memberStatusInfo.deceasedDate,
                    statusHistory: userOriginal.memberStatusInfo.statusHistory ? userOriginal.memberStatusInfo.statusHistory : []
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
            if (userOriginal.memberStatusInfo) {
                if (memberStatusInfo.activeType !== userOriginal.memberStatusInfo.activeType) {
                    setChangedGeneralProperties(true);
                }
                else {
                    setChangedGeneralProperties(false);
                }
            } else {
                setChangedGeneralProperties(true);
            }
        }

    }, [userOriginal, memberStatusInfo.activeType, setMemberStatusInfo]);

    useEffect(() => {
        if (userOriginal) {
            if (userOriginal.memberStatusInfo) {
                if (memberStatusInfo.startDate !== userOriginal.memberStatusInfo.startDate) {
                    setChangedGeneralProperties(true);
                }
                else {
                    setChangedGeneralProperties(false);
                }
            } else {
                setChangedGeneralProperties(true);
            }
        }

    }, [userOriginal, memberStatusInfo.startDate, setMemberStatusInfo]);

    useEffect(() => {
        if (userOriginal) {
            if (userOriginal.memberStatusInfo) {
                if (memberStatusInfo.endDate !== userOriginal.memberStatusInfo.endDate) {
                    setChangedGeneralProperties(true);
                }
                else {
                    setChangedGeneralProperties(false);
                }
            } else {
                setChangedGeneralProperties(true);
            }
        }

    }, [userOriginal, memberStatusInfo.endDate, setMemberStatusInfo]);

    useEffect(() => {
        if (userOriginal) {
            if (userOriginal.memberStatusInfo) {
                if (memberStatusInfo.school !== userOriginal.memberStatusInfo.school) {
                    setChangedGeneralProperties(true);
                }
                else {
                    setChangedGeneralProperties(false);
                }
            } else {
                setChangedGeneralProperties(true);
            }
        }

    }, [userOriginal, memberStatusInfo.school, setMemberStatusInfo]);

    useEffect(() => {
        if (userOriginal) {
            if (userOriginal.memberStatusInfo) {
                if (memberStatusInfo.fieldOfStudy !== userOriginal.memberStatusInfo.fieldOfStudy) {
                    setChangedGeneralProperties(true);
                }
                else {
                    setChangedGeneralProperties(false);
                }
            } else {
                setChangedGeneralProperties(true);
            }
        }

    }, [userOriginal, memberStatusInfo.fieldOfStudy, setMemberStatusInfo]);

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

    const formatDate = (dateString) => {
        return dateString.substring(0, 10); // Extract the yyyy-mm-dd part
      };

    // useEffect(() => {
    //     if (JSON.stringify(userEdit) === JSON.stringify(userOriginal)) {
    //         setChangedGeneralProperties(false);
    //     }
    //     else {
    //         setChangedGeneralProperties(true);
    //     }

    // }, [userOriginal, userEdit, setChangedGeneralProperties]);



    // Render Section ===

    return (
        userOriginal != null ? (
            <div
                role="tabpanel"
                hidden={panelIndex !== panelId}
                id={`Panel-${panelId}`}
            >
                <Collapse in={panelIndex === panelId ? true : false}>
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
                                        History
                                    </Typography>
                                    <Divider />
                                </Grid>
                                <Grid item xs>
                                    <Box mx={3} my={1} boxShadow={0}>
                                        <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                            {appState.role !== 'Volunteer' && appState.role !== 'Patient' && <Grid item>
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
MemberStatusTab.propTypes =
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

MemberStatusTab.defaultProps =
{
    appState: {},
    userID: null,
    setParentAlert: () => { },
    getParentInfo: () => { },
    panelId: null,
    panelIndex: null,
    userOriginal: {}
}

export default MemberStatusTab;

