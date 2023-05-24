// ================================================
// Code associated with UnassignUserDialog used when removing assigned clients/volunteers
// ================================================
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';
import patch from '../../../../helpers/common/patch';
import del from '../../../../helpers/common/delete';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Button from '@material-ui/core/Button';

import CircularProgress from '@material-ui/core/CircularProgress';


// ==================== MUI Styles ===================

const useStyles = makeStyles((theme) =>    //Notice the hook useStyles
({
    root: {
        flexGrow: 1,     // CSS determined this way, flexbox properties
        height: '100%'
    },
}));


// ================= Static Variables ================

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const UnassignUserDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

    // Style variable declaration
    const classes = useStyles();

    // Declaration of Stateful Variables ===
    const { appState, setParentAlert,
        unassignUserDialog, setUnassignUserDialog,
        unassignUserDialogExecuting, setUnassignUserDialogExecuting,
        selectedDataItemsList, setSelectedDataItemsList, userEdit } = props;


    // Functions ===



    const closeHandler = useCallback(() => {
        setUnassignUserDialog(false);
    }, [setUnassignUserDialog]);

    const removeSelectedUsers = useCallback(() => {
        if (selectedDataItemsList.length > 0) {
            let workerList = new Array();

            if (userEdit.role === "Patient") {
                selectedDataItemsList.map(item => {
                    const pIndex = item.patients.findIndex(patient => {
                        return patient === userEdit._id;
                    });


                    item.patients.splice(pIndex, 1);

                    const userIndex = userEdit.workers.findIndex(worker => {
                        return worker._id === item._id;
                    });
                    userEdit.workers.splice(userIndex, 1);
                });

                selectedDataItemsList.map(item => {
                    let patchData = {
                        p: item.patients
                    };

                    patch("users/" + item._id, appState.token, patchData, (error, response) => {
                        if (error) {
                            setParentAlert(new AlertType('Unable to unassign Patient from Volunteer. Please refresh and try again.', "error"));
                        }
                        else {
                            if (response.status === 200) {
                                // getParentData();
                                //  const _id = response.data.survey._id; The id to redirect to if you wish
                                setParentAlert(new AlertType('Successfully unassigned Patient from Volunteer.', "success"));
                            }
                            else {
                                setParentAlert(new AlertType('Unable to unassign user. Please refresh and try again.', "error"));
                            }
                        }
                    });
                });

                let patchData = {
                    w: userEdit.workers
                };

                patch("users/" + userEdit._id, appState.token, patchData, (error, response) => {
                    if (error) {
                        setParentAlert(new AlertType('Unable to unassign Volunteer from Patient. Please refresh and try again.', "error"));
                    }
                    else {
                        if (response.status === 200) {
                            // getParentData();
                            //  const _id = response.data.survey._id; The id to redirect to if you wish
                            setParentAlert(new AlertType('Successfully unassigned Volunteer from Patient.', "success"));
                        }
                        else {
                            setParentAlert(new AlertType('Unable to unassign user. Please refresh and try again.', "error"));
                        }
                    }
                });

            }
            else {
                selectedDataItemsList.map(item => {
                    const wIndex = item.workers.findIndex(worker => {
                        return worker === userEdit._id;
                    });
                    item.workers.splice(wIndex, 1);

                    const userIndex = userEdit.patients.findIndex(patient => {
                        return patient._id === item._id;
                    });
                    userEdit.patients.splice(userIndex, 1);
                });

                selectedDataItemsList.map(item => {
                    let patchData1 = {
                        w: item.workers
                    };

                    patch("users/" + item._id, appState.token, patchData1, (error, response) => {
                        if (error) {
                            setParentAlert(new AlertType('Unable to unassign Patient from Volunteer. Please refresh and try again.', "error"));
                        }
                        else {
                            if (response.status === 200) {
                                // getParentData();
                                //  const _id = response.data.survey._id; The id to redirect to if you wish
                                setParentAlert(new AlertType('Successfully unassigned Patient from Volunteer.', "success"));
                            }
                            else {
                                setParentAlert(new AlertType('Unable to unassign user. Please refresh and try again.', "error"));
                            }
                        }
                    });
                });

                let patchData2 = {
                    p: userEdit.patients
                };

                patch("users/" + userEdit._id, appState.token, patchData2, (error, response) => {
                    if (error) {
                        setParentAlert(new AlertType('Unable to unassign Volunteer from Patient. Please refresh and try again.', "error"));
                    }
                    else {
                        if (response.status === 200) {
                            // getParentData();
                            //  const _id = response.data.survey._id; The id to redirect to if you wish
                            setParentAlert(new AlertType('Successfully unassigned Volunteer from Patient.', "success"));
                        }
                        else {
                            setParentAlert(new AlertType('Unable to unassign user. Please refresh and try again.', "error"));
                        }
                    }
                });
            }

        }

    }, [appState, setParentAlert, selectedDataItemsList]);

    const removeHandler = useCallback(() => {
        try {
            setUnassignUserDialogExecuting(true);
            removeSelectedUsers();
            setUnassignUserDialogExecuting(false);
            setUnassignUserDialog(false);
            setSelectedDataItemsList([]);
        }
        catch {

        }
    }, [setUnassignUserDialogExecuting, unassignUserDialog, selectedDataItemsList, setSelectedDataItemsList, setUnassignUserDialog]);


    // Hooks ===


    // Render Section ===

    return (
        <>

            <Dialog id="remove-user-dialog"
                fullWidth
                maxWidth="md"
                open={unassignUserDialog}
                onClose={() => { closeHandler(); }}
            >
                <DialogTitle>
                    Remove User{selectedDataItemsList.length === 1 ? null : "s"}
                </DialogTitle>
                <DialogContent>
                    {unassignUserDialogExecuting ? (
                        <CircularProgress />
                    ) : (
                        <DialogContentText>
                            {selectedDataItemsList.length === 1 ? (
                                <>
                                    Are you sure you would like to remove the selected user?
                                </>

                            ) : (
                                <>
                                    {`Are you sure you would like to remove the ${selectedDataItemsList.length} users?`}
                                </>
                            )}
                        </DialogContentText>
                    )}

                </DialogContent>
                <DialogActions>
                    <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={unassignUserDialogExecuting}>
                        Cancel
                    </Button>
                    <Button color="primary" variant="contained" onClick={() => { removeHandler(); }} disabled={unassignUserDialogExecuting}>
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </>

    );
}

// ======================== Component PropType Check ========================
UnassignUserDialog.propTypes =
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    userEdit: PropTypes.object.isRequired,
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    unassignUserDialog: PropTypes.bool.isRequired,
    setUnassignUserDialog: PropTypes.func.isRequired,
    unassignUserDialogExecuting: PropTypes.bool.isRequired,
    setUnassignUserDialogExecuting: PropTypes.func.isRequired,
    selectedDataItemsList: PropTypes.arrayOf(PropTypes.object),
    setSelectedDataItemsList: PropTypes.func.isRequired
}

UnassignUserDialog.defaultProps =
{
    appState: {},
    setParentAlert: () => { },
    unassignUserDialog: {},
    setUnassignUserDialog: () => { },
    unassignUserDialogExecuting: {},
    setUnassignUserDialogExecuting: () => { },
    selectedDataItemsList: {},
    setSelectedDataItemsList: () => { }
}

export default UnassignUserDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage