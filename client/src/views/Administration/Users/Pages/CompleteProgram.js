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
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';

const CompleteProgram = (props) => {
    const { appState, userID, ToggleDrawerClose, CheckAuthenticationValidity } = props;
    const [user, setUser] = useState({});

    const [currentStatus, setCurrentStatus] = useState('');
    const [selectedProgram, setSelectedProgram] = useState({});
    const [programEndDate, setProgramEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [activePrograms, setActivePrograms] = useState([]);
    const [terminationDate, setTerminationDate] = useState(new Date().toISOString().split('T')[0]);
    const [terminationReason, setTerminationReason] = useState("");

    const [editable, setEditable] = useState(false);
    const [editable2, setEditable2] = useState(false); // for terminated status
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(new AlertType());

    const [originalStatus, setOriginalStatus] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false); // confirmation dialog for termination






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
    const handleEditable = (currentEditable, editableSetter) => {
        if (currentEditable) {
            setCurrentStatus(originalStatus);
        }

        editableSetter(!currentEditable);
    }





    // handler for save button
    const handleSave = async () => {
        setIsLoading(true);
        setEditable(false);


        if (!selectedProgram) {
            setAlert(new AlertType('Please select a program', "error"));
            setIsLoading(false);
            return;
        }

        let memberStatusInfo = {};

        if (user.memberStatusInfo && user.memberStatusInfo.statusHistory) {
            let statusHistory = user.memberStatusInfo.statusHistory;

            statusHistory[selectedProgram.index].endDate = programEndDate;

            memberStatusInfo = {
                statusHistory: statusHistory
            }

        }

        let updatedData = {
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

            }


        } catch (error) {
            console.error(error);
            setAlert(new AlertType('Unable to save changes, please refresh and try again', "error"));
        }

        setIsLoading(false);
        setEditable(false);

    }

    // handler for terminated status save button
    const handleTerminatedSave = async () => {
        handleClickOpen();
        setIsLoading(true);
        setEditable2(false);

        if (!terminationDate || !terminationReason) {
            setAlert(new AlertType('Please fill all fields', "error"));
            setIsLoading(false);
            return;
        }

        let memberStatusInfo = {};

        if (user.memberStatusInfo && user.memberStatusInfo.statusHistory) {
            let statusHistory = user.memberStatusInfo.statusHistory;

            // set terminationDate as the endDate for items without an endDate
            statusHistory = statusHistory.map(item => {
                if (!item.endDate) {
                    return { ...item, endDate: terminationDate };
                } else {
                    return item;
                }
            });

            statusHistory.push({
                status: "terminated",
                activeType:"",
                startDate: terminationDate,
                endDate: terminationDate,
            })

            memberStatusInfo = {
                statusHistory: statusHistory
            }

        }

        let updatedData = {
            status: "terminated",
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

            }


        } catch (error) {
            console.error(error);
            setAlert(new AlertType('Unable to save changes, please refresh and try again', "error"));
        }

        handleClose();
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

    const handleClickOpen = () => {
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
    };

    // rerenders the active programs list
    useEffect(() => {
        if (user.memberStatusInfo && user.memberStatusInfo.statusHistory && user.memberStatusInfo.statusHistory.length > 0) {
            let activePrograms = user.memberStatusInfo.statusHistory.map((entry, index) => ({ ...entry, index })).filter(entry => entry.endDate === "");

            let handledActivePrograms = activePrograms.map(program => {
                let handledProgramValue = handleProgramValue(program.activeType);
                return handledProgramValue !== "" ? { ...program, activeType: handledProgramValue } : null;
            }).filter(Boolean);

            setActivePrograms(handledActivePrograms);
        }
    }, [user]);

    useEffect(() => {
        getUser(userID)
            .then((user) => {
                setUser(user);
                setOriginalStatus(user.status);
                setCurrentStatus(user.status);

                if (user.memberStatusInfo && user.memberStatusInfo.statusHistory && user.memberStatusInfo.statusHistory.length > 0) {

                    let currentProgram = user.memberStatusInfo.statusHistory[user.memberStatusInfo.statusHistory.length - 1]
                    let activePrograms = user.memberStatusInfo.statusHistory.map((entry, index) => ({ ...entry, index })).filter(entry => entry.endDate === "");

                    if (currentProgram.hasOwnProperty('activeType')) {

                        let handledActivePrograms = activePrograms.map(program => {
                            let handledProgramValue = handleProgramValue(program.activeType);
                            return handledProgramValue !== "" ? { ...program, activeType: handledProgramValue } : null;
                        }).filter(Boolean);

                        setActivePrograms(handledActivePrograms);



                    } else {
                        setActivePrograms([]);


                    }
                } else {
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
                    Complete Program
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
                                    <li key={index} style={{ fontWeight: "400" }}>{program.activeType} (started on {program.startDate.split('T')[0]})</li>
                                ))}
                            </ul>
                            : <p>No active programs</p>
                        }
                    </>
                }

                <div style={{ marginTop: "32px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
                            <Typography variant="body1" color="inherit" align="left" gutterBottom style={{ fontSize: "18px", fontWeight: "500" }}>
                                Complete a Program
                            </Typography>
                            <Tooltip
                                placement="bottom"
                                title="Unlock editable fields"
                            >
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditable(editable, setEditable)}
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
                        <Typography variant="subtitle" color="inherit" align="left" gutterBottom style={{ fontSize: "14px" }}>
                            Select the active program you want to mark complete
                        </Typography>

                    </div>
                    <TextField
                        id="activePrograms"
                        select
                        required
                        label="Program"
                        size="medium"
                        variant="outlined"
                        disabled={!editable}
                        value={selectedProgram}
                        onChange={(e) => setSelectedProgram(e.target.value)}
                        style={{ width: "280px", marginTop: "12px" }}

                    >
                        {activePrograms.map((program) => (
                            <MenuItem key={program} value={program}>
                                {program.activeType}
                            </MenuItem>
                        ))}

                    </TextField>
                </div>

                <div style={{ marginTop: "24px" }}>
                    <Typography variant="body1" color="inherit" align="left" gutterBottom style={{ fontSize: "18px", fontWeight: "500" }}>
                        Date Program Completed
                    </Typography>

                    <TextField
                        id="programEndDate"
                        type="date"
                        required
                        size="medium"
                        variant="outlined"
                        disabled={!editable}
                        value={programEndDate}
                        onChange={(e) => setProgramEndDate(e.target.value)}
                        style={{ width: "280px", marginTop: "12px" }}>

                    </TextField>
                </div>

                <br />
                <hr style={{ opacity: "40%" }} />

                <Dialog
                    open={isDialogOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle style={{color:"red"}} id="alert-dialog-title">{"Terminate User"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText style={{fontWeight:"500"}} id="alert-dialog-description">
                            Are you sure you wish to terminate this user?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={async () => {
                            handleClose();
                            await handleTerminatedSave();
                        }} color="primary" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>


                <div style={{ marginTop: "24px" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
                            <Typography variant="body1" color="inherit" align="left" gutterBottom style={{ fontSize: "18px", fontWeight: "500", color: "red" }}>
                                Termination
                            </Typography>
                            <Tooltip
                                placement="bottom"
                                title="Unlock editable fields"
                            >
                                <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleEditable(editable2, setEditable2)}
                                >
                                    {editable2 ? (
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
                                disabled={!editable2}
                                startIcon={<SaveIcon />}
                                onClick={handleClickOpen}
                            >
                                {isLoading ? <CircularProgress size={24} /> : "Save"}
                            </Button>
                        </div>


                    </div>

                </div>

                <div style={{ marginTop: "24px" }}>
                    <Typography variant="body1" color="inherit" align="left" gutterBottom style={{ fontSize: "18px", fontWeight: "500" }}>
                        Date of Termination
                    </Typography>

                    <TextField
                        id="terminationDate"
                        type="date"
                        required
                        size="medium"
                        variant="outlined"
                        disabled={!editable2}
                        value={terminationDate}
                        onChange={(e) => setTerminationDate(e.target.value)}
                        style={{ width: "280px", marginTop: "12px" }}>

                    </TextField>
                </div>
                <div style={{ marginTop: "24px" }}>
                    <TextField
                        id="terminationReason"
                        select
                        required
                        label="Termination Reason"
                        size="medium"
                        variant="outlined"
                        disabled={!editable2}
                        value={terminationReason}
                        onChange={(e) => setTerminationReason(e.target.value)}
                        style={{ width: "280px", marginTop: "12px" }}

                    >
                        <MenuItem key={0} value={"Request record removal"}>
                            Request record removal
                        </MenuItem>

                        <MenuItem key={1} value={"Deceased"}>
                            Deceased
                        </MenuItem>

                    </TextField>

                </div>
            </Card >
        </div >
    )
}

export default CompleteProgram