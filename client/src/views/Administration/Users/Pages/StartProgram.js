import React, { useState, useEffect, useCallback } from 'react';
import get from '../../../../helpers/common/get';
import patch from '../../../../helpers/common/patch';

import AlertType from '../../../../helpers/models/AlertType';
import AlertMessage from '../../../../components/AlertMessage';

// ==================== MUI =========================
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { CircularProgress } from '@material-ui/core';

const StartProgram = (props) => {
    const { appState, userID, ToggleDrawerClose, CheckAuthenticationValidity } = props;
    const [user, setUser] = useState({});

    const [currentStatus, setCurrentStatus] = useState('');
    const [currentProgram, setCurrentProgram] = useState("");
    const [currentProgramStartDate, setCurrentProgramStartDate] = useState("");
    const [activePrograms, setActivePrograms] = useState([]);

    const [editable, setEditable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(new AlertType());

    // original status and program values to reset if changes not saved
    const [originalStatus, setOriginalStatus] = useState('');
    const [originalProgram, setOriginalProgram] = useState('');
    const [originalProgramStartDate, setOriginalProgramStartDate] = useState('');


    const programs = [
        "Quality Life - in home",
        "Quality Life - phone",
        "Education/Group",
        "Check-in",
        "Independent User - Self Registered"
    ]


    // function to handle inconsistencies due to rename and addition/removal of programs
    // can be removed if all programs in db are consistent
    // if programs are changed again, this function can be updated to handle the changes
    const handleProgramValue = (program) => {
        const renamedPrograms = {
            "Check-in - Monitoring Program": "Check-in",
            "Quality Life at Home - in home program": "Quality Life - in home",
            "Quality Life at Home - phone program": "Quality Life - phone",
            "Education/Group Support Program": "Education/Group",
        };

        if (renamedPrograms.hasOwnProperty(program)) {
            return renamedPrograms[program];
        }

        if (programs.includes(program)) {
            return program;
        }

        return "";
    };

    // handler for editable lock icon button
    // Resets the dropdown value to original if changes not saved
    const handleEditable = () => {
        if (editable) {
            setCurrentStatus(originalStatus);
            setCurrentProgram(originalProgram);
        }

        setEditable(!editable);
    }

    // handler for save button
    const handleSave = async () => {
        setIsLoading(true);
        setEditable(false);

        if (currentStatus === originalStatus && currentProgram === originalProgram && currentProgramStartDate === originalProgramStartDate) {
            return;
        }

        let memberStatusInfo = {};

        if (user.memberStatusInfo && user.memberStatusInfo.statusHistory) {
            let statusHistory = user.memberStatusInfo.statusHistory;

            let newStatus = {
                status: currentStatus,
                activeType: currentProgram,
                startDate: currentProgramStartDate !== "" ? new Date(currentProgramStartDate).toISOString() : new Date().toISOString(),
                endDate: ""
            }

            statusHistory.push(newStatus);
            memberStatusInfo = {
                statusHistory: statusHistory
            }

        } else {
            let statusHistory = [];
            let newStatus = {
                status: currentStatus,
                activeType: currentProgram,
                startDate: currentProgramStartDate !== "" ? new Date(currentProgramStartDate).toISOString() : new Date().toISOString(),
                endDate: ""
            }

            statusHistory.push(newStatus);
            memberStatusInfo = {
                statusHistory: statusHistory
            }
        }

        let updatedData = {
            status: currentStatus,
            memberStatusInfo: memberStatusInfo
        }

        try {
            const response = await new Promise((resolve, reject) => {
                patch("users/" + userID, appState.token, updatedData, (error, response) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
            });

            if (response.status === 200) {
                setUser(response.data.user);
                setAlert(new AlertType('Changes saved successfully', "success"));

                if (user.memberStatusInfo && user.memberStatusInfo.statusHistory && user.memberStatusInfo.statusHistory.length > 0) {
                    let activePrograms = user.memberStatusInfo.statusHistory.filter(entry => entry.endDate === "");
                    setActivePrograms(activePrograms);
                }

            }


        } catch (error) {
            console.error(error);
            setAlert(new AlertType('Unable to save changes, please refresh and try again', "error"));
        }

        setIsLoading(false);
        setEditable(false);

    }

    const getUser = useCallback(async (userID) => {
        return new Promise((resolve, reject) => {
            get("users/" + userID, appState.token, (err, res) => {
                if (err) {
                    // Reject the promise with the error
                    reject(new Error('Unable to retrieve Member Series. Please refresh and try again.'));
                } else {
                    if (res.status === 200) {
                        // Resolve the promise with the data
                        resolve(res.data.user);
                    } else {
                        // Reject the promise with an error message
                        reject(new Error('Coud not retrieve user. Please refresh and try again.'));
                    }
                }
            });
        });
    }, [appState]);

    // Function to determine color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return { color: 'green', fontWeight: '500' };
            case 'waitlist':
                return { color: 'yellow', fontWeight: '500' };
            case 'terminated':
                return { color: 'red', fontWeight: '500' };
            default:
                return { fontWeight: '500' };
        }
    }

    useEffect(() => {
        getUser(userID)
            .then((user) => {
                setUser(user);
                setOriginalStatus(user.status);
                setCurrentStatus(user.status);

                if (user.memberStatusInfo && user.memberStatusInfo.statusHistory && user.memberStatusInfo.statusHistory.length > 0) {

                    let currentProgram = user.memberStatusInfo.statusHistory[user.memberStatusInfo.statusHistory.length - 1];
                    let activePrograms = user.memberStatusInfo.statusHistory.filter(entry => entry.endDate === "");

                    if (currentProgram.hasOwnProperty('activeType')) {

                        let handledActivePrograms = activePrograms.map(program => {
                            let handledProgramValue = handleProgramValue(program.activeType);
                            return handledProgramValue !== "" ? { ...program, activeType: handledProgramValue } : null;
                        }).filter(Boolean);
                    
                        setActivePrograms(handledActivePrograms);
                        setOriginalProgram(handleProgramValue(currentProgram.activeType));
                        setCurrentProgram(handleProgramValue(currentProgram.activeType));
                        setCurrentProgramStartDate(currentProgram.startDate.split('T')[0]);
                        setOriginalProgramStartDate(currentProgram.startDate.split('T')[0]);

                    } else {
                        setCurrentProgram("");
                        setOriginalProgram("");
                        setActivePrograms([]);

                    }
                } else {
                    setCurrentProgram("");
                    setOriginalProgram("");
                    setActivePrograms([]);
                }
            })
            .catch((err) => {
                console.log(err.message);
                setAlert(new AlertType('Unable to fetch user, please refresh and try again', "error"));
            });
    }, [getUser, userID]);

    return (
        <div>
            <Box mx={1} my={1} style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
                <Typography variant="h5" color="inherit" align="left" gutterBottom>
                    Start Program
                </Typography>
                <AlertMessage alert={alert} setParentAlert={setAlert} />
            </Box>


            <Card raised={true} style={{ padding: "16px", marginTop: "16px" }}>
                {user &&
                    <>
                        <Typography variant="body1" color="inherit" align="left" gutterBottom style={{ fontSize: "18px" }}>
                            <span style={{ fontWeight: "500" }}>Name:</span> {user.info ? user.info.name : ""}
                        </Typography>

                        <Typography variant="body1" color="inherit" align="left" gutterBottom style={{ fontSize: "18px" }}>
                            <span style={{ fontWeight: "500" }}>Current Status:</span> <span style={getStatusColor(user.status)}>{user.status ? user.status : ""}</span>
                        </Typography>

                        <Typography variant="body1" color="inherit" align="left" gutterBottom style={{ fontSize: "18px", marginTop: "16px" }}>
                            <span style={{ fontWeight: "500" }}>Current Active Programs:</span>
                        </Typography>

                        {activePrograms.length > 0 ?
                            <ul>
                                {activePrograms.map((program, index) => (
                                    <li key={index}>{program.activeType} (started on {program.startDate.split('T')[0]})</li>
                                ))}
                            </ul>
                            : <p>No active programs</p>
                        }

                    </>
                }

                <div style={{ marginTop: "24px" }}>
                    <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
                        <Typography variant="body1" color="inherit" align="left" gutterBottom style={{ fontSize: "18px", fontWeight: "500" }}>
                            Assign Status
                        </Typography>

                        <Tooltip
                            placement="bottom"
                            title="Unlock editable fields"
                        >
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={handleEditable}
                            >
                                {editable ? (
                                    <LockOpenIcon />
                                ) : (
                                    <LockIcon />
                                )}
                            </IconButton>
                        </Tooltip>

                        <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            disabled={!editable}
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                        >
                            {isLoading ? <CircularProgress size={24} /> : "Save"}
                        </Button>

                    </div>
                    <TextField
                        id="status"
                        select
                        required
                        label="Status"
                        size="medium"
                        variant="outlined"
                        disabled={!editable}
                        value={currentStatus}
                        onChange={(e) => setCurrentStatus(e.target.value)}
                        inputProps={{
                            style: (currentStatus === "active") ? { color: "green" } : (currentStatus === 'waitlist') ? { color: "orange" } : { color: "red" }
                        }}
                        SelectProps={{
                            renderValue: (value) => (
                                <div style={{ color: value === 'active' ? 'green' : value === 'waitlist' ? 'orange' : 'red' }}>
                                    {value}
                                </div>
                            ),
                        }}
                        style={{ width: "280px", marginTop: "12px" }}

                    >
                        <MenuItem key={'active'} value={'active'} style={{ color: 'green' }}>active</MenuItem>
                        <MenuItem key={'waitlist'} value={'waitlist'} style={{ color: 'orange' }}>waitlist</MenuItem>
                        {/* <MenuItem key={'terminated'} value={'terminated'} style={{ color: 'red' }}>terminated</MenuItem> */}

                    </TextField>
                </div>

                <div style={{ marginTop: "24px" }}>
                    <Typography variant="body1" color="inherit" align="left" gutterBottom style={{ fontSize: "18px", fontWeight: "500" }}>
                        Assign Program
                    </Typography>
                    <TextField
                        id="program"
                        select
                        required
                        label="Program"
                        size="medium"
                        variant="outlined"
                        disabled={!editable}
                        value={currentProgram}
                        onChange={(e) => setCurrentProgram(e.target.value)}
                        style={{ width: "280px", marginTop: "12px" }}

                    >
                        {programs.map((program) => (
                            <MenuItem key={program} value={program}>
                                {program}
                            </MenuItem>
                        ))}

                    </TextField>
                </div>
                <div style={{ marginTop: "24px" }}>
                    <Typography variant="body1" color="inherit" align="left" gutterBottom style={{ fontSize: "18px", fontWeight: "500" }}>
                        Start Program Date
                    </Typography>

                    <TextField
                        id="programStartDate"
                        type="date"
                        required
                        size="medium"
                        variant="outlined"
                        disabled={!editable}
                        value={currentProgramStartDate}
                        onChange={(e) => setCurrentProgramStartDate(e.target.value)}
                        style={{ width: "280px", marginTop: "12px" }}>

                    </TextField>
                </div>
            </Card >
        </div >
    )
}

export default StartProgram