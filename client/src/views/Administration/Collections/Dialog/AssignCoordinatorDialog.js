// ================================================
// Code associated with assignCoordinatorDialog
// ================================================
import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../helpers/models/AlertType';
import get from '../../../../helpers/common/get';
import post from '../../../../helpers/common/post';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Collapse, Typography } from '@material-ui/core';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import { IconButton } from '@material-ui/core';

import CircularProgress from '@material-ui/core/CircularProgress';

// ==================== MUI Icons ====================
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';

// ==================== MUI Styles ===================

    const useStyles = makeStyles( (theme) =>    //Notice the hook useStyles
    ({
        root: {
            flexGrow: 1,     // CSS determined this way, flexbox properties
            height: '100%'
        },
        rootGrid: {
            height: '100%'
        },
        margin: {
            margin: theme.spacing(1),
        }
    }));


// ================= Static Variables ================

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const AssignCoordinatorDialog = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

        // Style variable declaration
        const classes = useStyles();

        // Declaration of Stateful Variables ===
        const { appState, setParentAlert, getParentData, selectedDataItemsList,
            assignCoordinatorDialog, setAssignCoordinatorDialog,
            assignCoordinatorDialogExecuting, setAssignCoordinatorDialogExecuting } = props;

        const [ currentCollection, setCurrentCollection ] = useState("");
        const [ selectedCollectionList, setSelectedCollectionList ] = useState([]);
        const [ collectionList, setCollectionList ] = useState(null);

        const [ currentMember, setCurrentMember ] = useState("");
        const [ selectedMemberList, setSelectedMemberList ] = useState([]);
        const [ MemberList, setMemberList ] = useState(null);

        // const [ userList, setUserList ] = useState(null);

    // Functions ===

        const populateCollections = useCallback((data) =>
        {
            let tempArray = new Array();

            if(data && Array.isArray(data))
            {
                data.forEach(item => {

                    tempArray.push(
                        {
                            _id: item._id,
                            name: item.name,
                            projectList: item.projectList,
                            memberCollectionList: item.memberCollectionList,
                            surveyList: item.surveyList,
                            createdBy: item.createdBy,
                            createdAt: item.updatedAt,
                            modifiedBy: item.modifiedBy,
                            updatedAt: item.updatedAt
                        });
                });
            }

            setCollectionList([...tempArray]);

        }, [ appState, setCollectionList]);

        const populateUsers = useCallback((data) =>
        {
            let tempArray = new Array();
            if(data && Array.isArray(data))
            {
                data.forEach(item => {

                    tempArray.push(
                        {
                            _id: item._id,
                            name: item.info.name,
                            role: item.role,
                            createdAt: item.createdAt
                        });
                });
            }

            setMemberList([...tempArray]);

        }, [ appState, setMemberList]);

        // Retrieve the list of Users
        const getCollections = useCallback(() => {

            get("collections/", appState.token, (err, res) => 
            {
                if(err)
                {   
                    //Bad callback call
                    //setParentAlert(new AlertType(err.message, "error"));
                    setParentAlert(new AlertType('Unable to retrieve Services. Please refresh and try again.', "error"));
                }
                else
                {
                    if(res.status === 200)
                    {
                        populateCollections(res.data.collectionList);
                    }
                    else
                    {
                        //Bad HTTP Response
                        setParentAlert(new AlertType('Unable to retrieve Services. Please refresh and try again.', "error"));
                    }
                }

            });
        }, [ appState, populateUsers, setParentAlert ] );

        // Retrieve the list of Collections
        const getUsers = useCallback(() => {

            get("users/", appState.token, (err, res) => 
            {
                if(err)
                {   
                    //Bad callback call
                    //setParentAlert(new AlertType(err.message, "error"));
                    setParentAlert(new AlertType('Unable to retrieve Users. Please refresh and try again.', "error"));
                }
                else
                {
                    if(res.status === 200)
                    {

                        if (appState.role === 'Admin') {
                            populateUsers(res.data.response.users);
                        }
                        else {
                            var tempusers = [];

                            res.data.response.users.forEach(k => {
                                if (k.facid == appState.facilityId)
                                    tempusers.push(k);
                            });
                            populateUsers(tempusers); // Edited by P, filter users by facility ID
                        }
                        //populateUsers(res.data.response.users);
                    }
                    else
                    {
                        //Bad HTTP Response
                        setParentAlert(new AlertType('Unable to retrieve Users. Please refresh and try again.', "error"));
                    }
                }

            });
        }, [ appState, populateUsers, setParentAlert ] );

        // Insert the new booklet into the database upon creation
        const assignMembers = useCallback(() =>
        {
            if(selectedCollectionList.length > 0 && selectedMemberList.length > 0)
            {
                selectedCollectionList.forEach(collection => 
                {
                        const selectedMemberIdList = selectedMemberList.map(item => { return item._id; });

                        let postBody = {
                            collectionId: collection._id,
                            memberList: selectedMemberIdList
                        };
    
                        post("collections/assign/member", appState.token, postBody, (error, response) => 
                        {
                            if(error)
                            {
                                setParentAlert(new AlertType('Unable to update series. Please refresh and try again.', "error"));
                            }
                            else
                            {
                                if(response.status === 200)
                                {
                                    //console.log(response);
                                    // getParentData();
                                    //  const _id = response.data.survey._id; The id to redirect to if you wish
                                    getParentData();
                                    setParentAlert(new AlertType('Successfully updated series.', "success"));
                                }
                                else
                                {
                                    setParentAlert(new AlertType('Unable to update series. Please refresh and try again.', "error"));
                                }
                            }
                        });
                });
            }
            else
            {
                setParentAlert(new AlertType('Unable to assign Coordinator to series. Please refresh and try again.', "error"));
            }

        }, [ appState, getParentData, setParentAlert, selectedCollectionList, selectedMemberList]);

        
        const closeHandler = useCallback(() => {

            setAssignCoordinatorDialog(false);
            setCurrentCollection("");
            setCurrentMember("");
            setSelectedCollectionList(new Array());
            setSelectedMemberList(new Array());

        }, [ setAssignCoordinatorDialog, setCurrentCollection, setCurrentMember, setSelectedCollectionList, setSelectedMemberList ]);


        const createHandler = useCallback(() => {

            setAssignCoordinatorDialogExecuting(true);
            assignMembers();
            setAssignCoordinatorDialogExecuting(false);
            setAssignCoordinatorDialog(false);

        }, [ assignMembers, setAssignCoordinatorDialogExecuting, setAssignCoordinatorDialog]);

        const selectCollectionHandler = useCallback((event) =>
        {
            setCurrentCollection(event.target.value);

        }, [ setCurrentCollection ]);

        const selectMemberHandler = useCallback((event) =>
        {
            setCurrentMember(event.target.value);

        }, [ setCurrentMember ]);

        const addCollectionButtonHandler = useCallback(() =>
        {
            if(currentCollection && currentCollection != "")
            {
                let tempUserObject = collectionList.find(item => item._id == currentCollection);

                if(tempUserObject != undefined)
                {
                    setSelectedCollectionList([...selectedCollectionList, tempUserObject]);
                    setCurrentCollection("");
                }
            }

        }, [ currentCollection, collectionList, setSelectedCollectionList, selectedCollectionList, setCurrentCollection ]);

        const addMemberButtonHandler = useCallback(() =>
        {
            if(currentMember && currentMember != "")
            {
                let tempUserObject = MemberList.find(item => item._id == currentMember);

                if(tempUserObject != undefined)
                {
                    setSelectedMemberList([...selectedMemberList, tempUserObject]);
                    setCurrentMember("");
                }

            }

        }, [ currentMember, MemberList, setSelectedMemberList, selectedMemberList, setCurrentMember ]);

        const removeCollectionButtonHandler = useCallback((item) =>
        {
            let tempList = selectedCollectionList;

            tempList.splice(selectedCollectionList.findIndex(oldItem => oldItem._id == item._id), 1);

            setSelectedCollectionList([...tempList]);

        }, [ selectedCollectionList, setSelectedCollectionList ]);

        const removeMemberButtonHandler = useCallback((item) =>
        {
            let tempList = selectedMemberList;

            tempList.splice(selectedMemberList.findIndex(oldItem => oldItem._id == item._id), 1);

            setSelectedMemberList([...tempList]);

        }, [selectedMemberList, setSelectedMemberList ]);

    // Hooks ===

        useEffect( () =>
        {
            if(assignCoordinatorDialog)
            {
                getCollections();
                getUsers();
            }
            
        }, [ assignCoordinatorDialog, getUsers, getCollections]);



        return (
            <>
                {assignCoordinatorDialog? (
                    <Dialog id="assign-member-dialog"
                        fullWidth
                        maxWidth="md"
                        open={assignCoordinatorDialog}
                        onClose={() => { closeHandler(); }}
                    >
                        <DialogTitle>
                            Assign Coordinator(s) to Series
                        </DialogTitle>
                        <DialogContent>
                            {assignCoordinatorDialogExecuting? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <DialogContentText>
                                        Please select <em><u>Coordinators</u></em> to be assigned to each the following <em><u>Series</u></em>.
                                    </DialogContentText>
                                    <Box mx={1} my={1} boxShadow={0}>
                                        <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                                        <Grid item xs container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                                {collectionList? (
                                                    <>
                                                        <Grid item xs={11}>
                                                            <FormControl id="Collection-options-label" variant="filled" size="small" fullWidth disabled={!collectionList}>
                                                                <InputLabel>
                                                                    Series
                                                                </InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    labelId="Collection-options-label"
                                                                    value={currentCollection}
                                                                    onChange={(event) => { selectCollectionHandler(event); } }
                                                                    //disabled={selectedCollectionList.length >= 1? true: false}
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    {collectionList.map( (item, index) => 
                                                                    {
                                                                        return(
                                                                            <MenuItem key={`SelectOption${item._id}`} value={item._id}
                                                                                disabled={(selectedCollectionList.findIndex(oldItem => oldItem._id == item._id) == -1)? false : true}
                                                                            >
                                                                                <em>{item.name}</em>
                                                                            </MenuItem>  
                                                                        )
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton variant="outlined" size="medium" color="inherit" onClick={ () => { addCollectionButtonHandler(); } }
                                                                disabled={currentCollection == ""? true : false}>
                                                                <AddCircleIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <CircularProgress />
                                                )}
                                            </Grid>
                                            <Grid item xs>
                                                {(selectedCollectionList)? (
                                                     <Collapse in={(selectedCollectionList.length > 0)? true : false}>
                                                        <Typography component="div" variant="body2" color="textSecondary" gutterBottom={true}>
                                                            <em>{"The following selected series"}</em> <u>{'to be assigned:'}</u>
                                                        </Typography>
                                                        <Typography component="div" variant="body2" color="primary" gutterBottom={true}>
                                                            <ol>
                                                                {selectedCollectionList.map((item, index) => {
                                                                    return (
                                                                        <li key={`${item._id}${index}`}>
                                                                            {item.name}
                                                                            <IconButton aria-label="delete" className={classes.margin} size="small"
                                                                                onClick={ (item) => { removeCollectionButtonHandler(item); } }
                                                                            >
                                                                                <CancelIcon fontSize="inherit" />
                                                                            </IconButton>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ol>
                                                        </Typography>
                                                    </Collapse>
                                                ) : (
                                                    <>
                                                    </>
                                                )}
                                            </Grid>
                                            <Grid item xs container direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
                                                {MemberList? (
                                                    <>
                                                        <Grid item xs={11}>
                                                            <FormControl id="Member-options-label" variant="filled" size="small" fullWidth disabled={!MemberList}>
                                                                <InputLabel>
                                                                    Coordinator
                                                                </InputLabel>
                                                                <Select
                                                                    fullWidth
                                                                    labelId="Member-options-label"
                                                                    value={currentMember}
                                                                    onChange={(event) => { selectMemberHandler(event); } }
                                                                >
                                                                    <MenuItem value="">
                                                                        <em>None</em>
                                                                    </MenuItem>
                                                                    {MemberList.map( (item, index) => 
                                                                    { if(item.role === "Coordinator"){
                                                                        return(
                                                                            <MenuItem key={`SelectOption${item._id}`} value={item._id}
                                                                                disabled={(selectedMemberList.findIndex(oldItem => oldItem._id == item._id) == -1)? false : true}
                                                                            >
                                                                                <em>{item.name}</em>
                                                                            </MenuItem>  
                                                                        )
                                                                    }
                                                                    else {
                                                                        return null;
                                                                    }}
                                                                    )}
                                                                </Select>
                                                            </FormControl>
                                                        </Grid>
                                                        <Grid item xs={1}>
                                                            <IconButton variant="outlined" size="medium" color="inherit" onClick={ () => { addMemberButtonHandler(); } }
                                                                disabled={currentMember == ""? true : false}>
                                                                <AddCircleIcon />
                                                            </IconButton>
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <CircularProgress />
                                                )}
                                            </Grid>
                                            <Grid item xs>
                                                {selectedMemberList? (
                                                    <Collapse in={(selectedMemberList.length > 0)? true : false}>
                                                        <Typography component="div" variant="body2" color="textSecondary" gutterBottom={true}>
                                                            <em>{"The following selected members"}</em> <u>{'to be assigned by:'}</u>
                                                        </Typography>
                                                        <Typography component="div" variant="body2" color="secondary" gutterBottom={true}>
                                                            <ol>
                                                                {selectedMemberList.map((item, index) => {
                                                                    return (
                                                                        <li key={`${item._id}${index}`}>
                                                                            {item.name}
                                                                            <IconButton aria-label="delete" className={classes.margin} size="small"
                                                                                onClick={ (item) => { removeMemberButtonHandler(item); } }
                                                                            >
                                                                                <CancelIcon fontSize="inherit" />
                                                                            </IconButton>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ol>
                                                        </Typography>
                                                    </Collapse>
                                                ) : (
                                                    <>
                                                    </>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" variant="contained" onClick={() => { closeHandler(); }} disabled={assignCoordinatorDialogExecuting}>
                                Cancel
                            </Button>
                            <Button color="primary" variant="contained" startIcon={<SupervisorAccountIcon />} onClick={() => { createHandler(); }} disabled={assignCoordinatorDialogExecuting}
                                disabled={(selectedCollectionList.length > 0 && selectedMemberList.length > 0)? false : true}
                            >
                                Assign
                            </Button>
                        </DialogActions>
                    </Dialog>
                ) : (
                    null
                )}
            </>
            
        );
}

// ======================== Component PropType Check ========================
AssignCoordinatorDialog.propTypes =
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    getParentData: PropTypes.func.isRequired,
    selectedDataItemsList: PropTypes.arrayOf(PropTypes.object),
    assignCoordinatorDialog: PropTypes.bool.isRequired,
    setAssignCoordinatorDialog: PropTypes.func.isRequired,
    assignCoordinatorDialogExecuting: PropTypes.bool.isRequired,
    setAssignCoordinatorDialogExecuting: PropTypes.func.isRequired

}

AssignCoordinatorDialog.defaultProps =
{
    appState: {},
    setParentAlert: () => {},
    getParentData:  () => {},
    selectedDataItemsList: {},
    assignCoordinatorDialog: {},
    setAssignCoordinatorDialog: () => {},
    assignCoordinatorDialogExecuting: {},
    setAssignCoordinatorDialogExecuting: () => {}
}

export default AssignCoordinatorDialog;  // You can even shorthand this line by adding this at the function [Component] declaration stage