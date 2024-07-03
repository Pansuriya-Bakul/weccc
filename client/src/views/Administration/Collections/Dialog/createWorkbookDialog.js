import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    IconButton,
    Grid,
    Typography,
    Box,
    Collapse
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const CreateWorkbookDialog = (props) => {
    // Variables
    const classes = useStyles(); // Assuming useStyles is defined elsewhere

    // Stateful Variables
    const {
        appState,
        setParentAlert,
        getCollections, // Replace with appropriate function
        getUsers, // Replace with appropriate function
        createWorkbookDialog,
        setCreateWorkbookDialog,
        createWorkbookDialogExecuting,
        setCreateWorkbookDialogExecuting
    } = props;

    const [workbookName, setWorkbookName] = useState("");
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [collectionList, setCollectionList] = useState(null);

    // Functions
    const populateCollections = useCallback((data) => {
        let tempArray = [];

        if (data && Array.isArray(data)) {
            data.forEach(item => {
                tempArray.push({
                    _id: item._id,
                    name: item.name,
                    // Add other necessary fields
                });
            });
        }

        setCollectionList([...tempArray]);
    }, []);

    const getWorkbookCollections = useCallback(() => {
        // Replace with appropriate API call
        getCollections((err, res) => {
            if (err) {
                setParentAlert(new AlertType('Unable to retrieve collections. Please refresh and try again.', "error"));
            } else {
                if (res.status === 200) {
                    populateCollections(res.data.collectionList);
                } else {
                    setParentAlert(new AlertType('Unable to retrieve collections. Please refresh and try again.', "error"));
                }
            }
        });
    }, [getCollections, populateCollections, setParentAlert]);

    const createWorkbook = useCallback(() => {
        if (workbookName && selectedCollections.length > 0) {
            let postBody = {
                name: workbookName,
                collectionIds: selectedCollections.map(collection => collection._id),
                createdBy: appState.userId, // Assuming userId is available in appState
                modifiedBy: appState.userId // Assuming userId is available in appState
            };

            setCreateWorkbookDialogExecuting(true);

            // Replace with appropriate API call
            post("/workbooks", appState.token, postBody, (error, response) => {
                setCreateWorkbookDialogExecuting(false);
                if (error) {
                    setParentAlert(new AlertType('Failed to create workbook. Please try again.', "error"));
                } else {
                    if (response.status === 200) {
                        setParentAlert(new AlertType('Workbook created successfully.', "success"));
                        setCreateWorkbookDialog(false);
                    } else {
                        setParentAlert(new AlertType('Failed to create workbook. Please try again.', "error"));
                    }
                }
            });
        } else {
            setParentAlert(new AlertType('Please enter a name and select at least one collection.', "error"));
        }
    }, [appState, workbookName, selectedCollections, setCreateWorkbookDialog, setCreateWorkbookDialogExecuting, setParentAlert]);

    const closeHandler = useCallback(() => {
        setCreateWorkbookDialog(false);
        setWorkbookName("");
        setSelectedCollections([]);
    }, [setCreateWorkbookDialog]);

    const selectCollectionHandler = useCallback((event) => {
        setSelectedCollections(event.target.value);
    }, [setSelectedCollections]);

    const addCollectionButtonHandler = useCallback(() => {
        if (selectedCollections.indexOf(currentCollection) === -1) {
            setSelectedCollections(prev => [...prev, currentCollection]);
        }
    }, [currentCollection, selectedCollections]);

    const removeCollectionButtonHandler = useCallback((collectionId) => {
        setSelectedCollections(prev => prev.filter(id => id !== collectionId));
    }, [selectedCollections]);

    // Effects
    useEffect(() => {
        if (createWorkbookDialog) {
            getWorkbookCollections();
        }
    }, [createWorkbookDialog, getWorkbookCollections]);

    return (
        <Dialog
            fullWidth
            maxWidth="md"
            open={createWorkbookDialog}
            onClose={closeHandler}
        >
            <DialogTitle>
                Create Workbook Dialog
            </DialogTitle>
            <DialogContent>
                {createWorkbookDialogExecuting ? (
                    <CircularProgress />
                ) : (
                    <>
                        <DialogContentText>
                            Please enter a name for the workbook and select collections to assign.
                        </DialogContentText>
                        <Box mx={1} my={1} boxShadow={0}>
                            <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={2}>
                                <Grid item xs>
                                    <TextField
                                        label="Workbook Name"
                                        variant="outlined"
                                        fullWidth
                                        value={workbookName}
                                        onChange={(e) => setWorkbookName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <FormControl variant="outlined" size="small" fullWidth>
                                        <InputLabel>
                                            Select Collections
                                        </InputLabel>
                                        <Select
                                            multiple
                                            fullWidth
                                            value={selectedCollections}
                                            onChange={selectCollectionHandler}
                                            renderValue={(selected) => (
                                                <div className={classes.chips}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={value} className={classes.chip} />
                                                    ))}
                                                </div>
                                            )}
                                        >
                                            {collectionList && collectionList.map((collection) => (
                                                <MenuItem key={collection._id} value={collection._id}>
                                                    {collection.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={closeHandler} disabled={createWorkbookDialogExecuting}>
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={createWorkbook}
                    disabled={createWorkbookDialogExecuting || !workbookName || selectedCollections.length === 0}
                >
                    Create Workbook
                </Button>
            </DialogActions>
        </Dialog>
    );
};

CreateWorkbookDialog.propTypes = {
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    getCollections: PropTypes.func.isRequired,
    getUsers: PropTypes.func.isRequired,
    createWorkbookDialog: PropTypes.bool.isRequired,
    setCreateWorkbookDialog: PropTypes.func.isRequired,
    createWorkbookDialogExecuting: PropTypes.bool.isRequired,
    setCreateWorkbookDialogExecuting: PropTypes.func.isRequired
};

CreateWorkbookDialog.defaultProps = {
    appState: {},
    setParentAlert: () => {},
    getCollections: () => {},
    getUsers: () => {},
    createWorkbookDialog: false,
    setCreateWorkbookDialog: () => {},
    createWorkbookDialogExecuting: false,
    setCreateWorkbookDialogExecuting: () => {}
};

export default CreateWorkbookDialog;
