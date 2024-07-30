// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================

// ==================== Helpers =====================
import AlertType from '../../../../../helpers/models/AlertType';

// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins
import Card from '@material-ui/core/Card';  //Like the paper module, a visual sheet to place things
import Divider from '@material-ui/core/Divider';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import Select, { SelectChangeEvent } from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag

// ==================== MUI Icons ====================
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import RefreshIcon from '@material-ui/icons/Refresh';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import BookIcon from '@material-ui/icons/Book';
import AssignmentIcon from '@material-ui/icons/Assignment';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import ListItemText from '@material-ui/core/ListItemText';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Checkbox from '@material-ui/core/Checkbox';
import { height } from '@fortawesome/free-solid-svg-icons/fa0';
import axios from 'axios';
import get from '../../../../../helpers/common/get';
import post from '../../../../../helpers/common/post';
import CircularProgress from '@material-ui/core/CircularProgress';

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
const selectFilterOptions = [{ key: "Name", value: "name", display: "Name" }, { key: "Email", value: "email", display: "Email" }, { key: "Role", value: "role", display: "Role" }, { key: "Enabled", value: "enabled", display: "Status" }]

// ================= Static Functions ================


// ======================== React Modern | Functional Component ========================

const UsersManagementControlPanel = (props) => { // Notice the arrow function... regular function()  works too

    // Variables ===

    // Style variable declaration
    const classes = useStyles();

    // Declaration of Stateful Variables ===
    const { appState, setParentAlert,
        isDense, setIsDense,
        dataList, getParentData,
        setSearchFilteredDataList,
        setCreateUserDialog, 
        setAssignUserDialog, 
        setCreateWorkbookDialog } = props;
        

    const [selectSearchFilterOption, setSelectSearchFilterOption] = useState(selectFilterOptions[0].value);
    const [searchFilter, setSearchFilter] = useState("");
    const [collectionList, setCollectionList] = useState(null);

    const populateCollections = useCallback((data) => {
        let tempArray = new Array();

        if (data && Array.isArray(data)) {
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
        
    }, [appState, setCollectionList]);
    // Functions ===

    const pullHandler = useCallback(() => {
        try {
            getParentData();
            setParentAlert(new AlertType('Refreshed initiated...', "info"));
        }
        catch {

        }

    }, [getParentData, setParentAlert]);

    const createUserHandler = useCallback(() => {
        setCreateUserDialog(true);
    }, [setCreateUserDialog]);

    const assignUserHandler = useCallback(() => {
        setAssignUserDialog(true);
    }, [setAssignUserDialog]);

    const selectSearchHandler = useCallback((event) => {
        setSearchFilter("");
        setSelectSearchFilterOption(event.target.value);

    }, [setSelectSearchFilterOption]);

    const searchHandler = useCallback((event) => {
        let tempFilter = event.target.value.toUpperCase();
        let allen;
        if (tempFilter.indexOf("ACTIVE")) {
            allen = "TRUE"
        } else if (tempFilter.indexOf("INACTIVE")) {
            allen = "FALSE"
        }
        let tempArray = [];
        dataList.forEach(item => {
            switch (selectSearchFilterOption) {
                case "name":

                    if (item.info.name.toUpperCase().indexOf(tempFilter) > -1) {
                        tempArray.push(item);
                    }

                    break;

                case "sequenceId":

                    if (String(item.sequenceId).indexOf(tempFilter) > -1) {
                        tempArray.push(item);
                    }

                    break;

                case "email":

                    if (item.email.toUpperCase().indexOf(tempFilter) > -1) {
                        tempArray.push(item);
                    }

                    break;

                case "role":

                    if (item.role.toUpperCase().indexOf(tempFilter) > -1) {
                        tempArray.push(item);
                    }

                    break;
                case "enabled":
                    let status = item.enabled ? "true" : "false";
                    if (status.toUpperCase().indexOf(allen) > -1) {
                        tempArray.push(item);
                    }

                    break;

                default:
            }

        });

        setSearchFilter(event.target.value);
        setSearchFilteredDataList(tempArray);
    }, [dataList, setSearchFilteredDataList, selectSearchFilterOption]);

    // Hooks ===

    // First Render only because of the [ ] empty array tracking with the useEffect
    useEffect(() => {
        setSearchFilter("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataList]);

    useEffect(() => {
        if (searchFilter === "") {
            setSearchFilteredDataList(dataList);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setSelectSearchFilterOption, searchFilter]);





    const [open, setOpen] = React.useState(false);
    const [opend, setOpend] = React.useState(false);
    const [openwc, setOpenwc] = React.useState(false);
    const [openww, setOpenww] = React.useState(false);
    const [successModalOpen, setSuccessModalOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    
    const [age, setAge] = React.useState('');
    const [loading, setLoading] = useState(false);


    const handleChange = (event) => {
      setAge(event.target.value);
    };
    const style = {
        position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '60vw', // Increased width
  height: '50vh', // Increased height
  backgroundColor: 'white',
  boxShadow: 24,
  padding: '20px',
  overflow: 'auto', 
      };

      const stylew = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
         width: '60vw', // Increased width
  height: '50vh',
        backgroundColor: 'white',
        boxShadow: 24,
        padding: 4,
        padding: '20px',
  overflow: 'auto', 
      };

      const [workbookName, setWorkbookName] = useState('');
      const [selectedSeries, setSelectedSeries] = useState([]);
      const [selectedSeriesname, setSelectedSeriesname] = useState([]);
      const clients = ['Client 1', 'Client 2', 'Client 3'];
// const workbooks = ['Workbook 1', 'Workbook 2', 'Workbook 3'];
const [workbooks,setworkbooks]=useState([]);

      const [openw, setOpenw] = useState(false);
      const [selectedClients, setSelectedClients] = useState([]);
      const [selectedClientsname, setSelectedClientsname] = useState([]);
      const [selectedWorkbooks, setSelectedWorkbooks] = useState([]);
      const [selectedWorkbooksname, setSelectedWorkbooksname] = useState([]);
      const [successMessage, setSuccessMessage] = useState('');

      const handleOpenw = () => setOpenw(true);
    const handleClosew = () => setOpenw(false);

    const handleClientsChange = (event) => {
      const selectedValues = event.target.value;
      setSelectedClients(selectedValues);
  
      // Update selectedClientsname based on selectedValues
      const selectedNames = clientUserList
        .filter(client => selectedValues.includes(client._id))
        .map(client => client.name);
  
      setSelectedClientsname(selectedNames);
      setOpenwc(false);
    };
    
    const handleSeriesChange = (event) => {
        const { value } = event.target;
        setSelectedSeries(typeof value === 'string' ? value.split(',') : value);
      };

      const handleWorkbooksChange = (event) => {
        const selectedValues = event.target.value;
        setSelectedWorkbooks(selectedValues);
      
        // Map workbook IDs to names
        const selectedNames = workbooks
          .filter(workbook => selectedValues.includes(workbook._id))
          .map(workbook => workbook.name);
      
        setSelectedWorkbooksname(selectedNames);
        setOpenww(false);
      };
      



    const handleCreateWorkbook = async () => {
        try {
          const response = await axios.post('http://localhost:3001/api/workbooks', {
            name: workbookName,
            // collectionIds: selectedCollection
            collectionIds: selectedSeries

          },{
            headers: {
              Authorization: `Bearer ${appState.token}`, // Assuming your JWT token is stored in localStorage
            },
          });
          // Handle success as needed, e.g., close modal, update state, etc.
          console.log('Workbook created:', response.data);
          // handleClose();
          setworkbooks(prevWorkbooks => [...prevWorkbooks, response.data]); // Add the new workbook to the list

          setSuccessMessage('Workbook has been successfully created!');
    setSuccessModalOpen(true); 
        } catch (error) {
          console.error('Failed to create workbook:', error);
        }finally{
          handleClose();
          setSelectedSeriesname([])
          setWorkbookName('')
          setSelectedSeries([])
        }
        // window.location.reload(true);
      };

      const handleAssignWorkbook = async () => {
        setLoading(true)
        try {
          const response = await axios.post('http://localhost:3001/api/workbooks/assign-collections', {
            userIds: selectedClients,
            workbookId: selectedWorkbooks

          },{
            headers: {
              Authorization: `Bearer ${appState.token}`, // Assuming your JWT token is stored in localStorage
            },
          });
          // Handle success as needed, e.g., close modal, update state, etc.
          console.log('Workbook Assigned:', response.data);
          // handleClosew();
          setSuccessMessage('Workbook has been successfully assigned!');
          setSuccessModalOpen(true);
        } catch (error) {
          console.error('Failed to Assign workbook:', error);
        }finally {
          setLoading(false); // Hide spinner
          // Clear data
          setSelectedClients([]);
          setSelectedClientsname([]);
          setSelectedWorkbooks([]);
          setSelectedWorkbooksname([]);
          // Close the modal
          handleClosew();
        }
      };


      const getCollections = useCallback(() => {

        get("collections/", appState.token, (err, res) => {
            if (err) {
                //Bad callback call
                //setParentAlert(new AlertType(err.message, "error"));
                setParentAlert(new AlertType('Unable to retrieve Series. Please refresh and try again.', "error"));
            }
            else {
                if (res.status === 200) {
                  // console.log(res.data.collectionList)
                    //  setCollectionList(res.data.collectionList)
                    populateCollections(res.data.collectionList);
                }
                else {
                    //Bad HTTP Response
                    setParentAlert(new AlertType('Unable to retrieve Seriess. Please refresh and try again.', "error"));
                }
            }

        });
    }, [appState, setParentAlert]);

   

    const [ userList, setUserList ] = useState(null);
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

          setUserList([...tempArray]);
      }, [ appState, setUserList]);

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
                  if (appState.role == 'Admin') {
                      populateUsers(res.data.response.users)
                  }
                  else {
                      var tempusers = [];
                  
                      res.data.response.users.forEach(k => {
                          if (k.facid == appState.facilityId)
                              tempusers.push(k);
                      });
                      // console.log("**********************************")
                      // console.log(tempusers)
                      populateUsers(tempusers); //Edit by P, filter users by facility ID
                      //populateUsers(res.data.response.users);
                  }
              }
              else
              {
                  //Bad HTTP Response
                  setParentAlert(new AlertType('Unable to retrieve Users. Please refresh and try again.', "error"));
              }
              
          }

      });
  }, [ appState, populateUsers, setParentAlert ] );


    useEffect(() => {
            getCollections();
          getUsers();

    }, [getCollections,getUsers]);

    
    const [selectedCollection, setSelectedCollection] = useState([]);
    

    const handleCollectionChange = (event) => {
      const selectedValues = event.target.value;
  
      // Update selectedSeries state
      setSelectedSeries(selectedValues);
  
      // Update selectedSeriesname based on selectedValues
      const selectedNames = collectionList
        .filter(collection => selectedValues.includes(collection._id))
        .map(collection => collection.name);
  
      setSelectedSeriesname(selectedNames);
      setOpend(false);
    };

    const handleClosemodel =()=>{
      handleClose();
      setSelectedSeriesname([])
          setWorkbookName('')
          setSelectedSeries([])
      handleClosew();
      setLoading(false); 
          setSelectedClients([]);
          setSelectedClientsname([]);
          setSelectedWorkbooks([]);
          setSelectedWorkbooksname([]);

    }

  useEffect(() => {
    fetchWorkbooks();
    
  }, [fetchWorkbooks]);


    const [ managementUserList, setManagementUserList ] = useState(null);
    const [ clientUserList, setClientUserList ] = useState(null);
    useEffect( () => 
    {
        if(userList)
        {
            //  Set Management User List
            let tempManagementUserList = new Array();
            
            //  Set Client User List
            let tempClientUserList = new Array();

            userList.forEach(item => {
                
                if(item.role == 'Admin' || item.role == 'Coordinator' || item.role == 'Volunteer')
                {
                    tempManagementUserList.push(item);
                }
                else if(item.role == 'Patient')
                {
                    tempClientUserList.push(item);
                }

            });

            setManagementUserList([...tempManagementUserList]);
            setClientUserList([...tempClientUserList]);
        }

    }, [ userList, setManagementUserList, setClientUserList ]);

  

  const fetchWorkbooks = async () => {
    
    get("workbooks", appState.token, (err, res) => {
      if(err)
      {
        console.log(err)
      }
      else{
setworkbooks(res.data)
      }
    })
  };
    // })
    // Render Section ===


    return (
        <>
        <Modal
  aria-labelledby="success-modal-title"
  aria-describedby="success-modal-description"
  open={successModalOpen}
  onClose={() => setSuccessModalOpen(false)}
  closeAfterTransition
  BackdropComponent={Backdrop}
  BackdropProps={{
    timeout: 500,
  }}
>
  <Fade in={successModalOpen}>
    <Box style={{ ...stylew, padding: '20px' }}>
      <Typography id="success-modal-title" variant="h6" component="h2">
        Success
      </Typography>
      <Typography id="success-modal-description" variant="body1" style={{ marginTop: '10px' }}>
      {successMessage}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setSuccessModalOpen(false)}
        style={{ marginTop: '20px' }}
      >
        OK
      </Button>
    </Box>
  </Fade>
</Modal>

<Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2" gutterBottom>
              Create Workbook
            </Typography>
            <Typography id="transition-modal-description" variant="body1" gutterBottom>
              Please enter the workbook name and select a series to create a new workbook.
            </Typography>
            <TextField
              required
              id="outlined-required"
              label="Workbook Name"
              value={workbookName}
              onChange={(e) => setWorkbookName(e.target.value)}
              fullWidth
              margin="normal"
            />
          
            






<FormControl variant="outlined" fullWidth style={{ marginBottom: '20px', marginTop:'10px' }}>
<InputLabel id="select-clients-label">Select Serieses</InputLabel>
             

<Select
        labelId="select-clients-label"
        id="select-clients"
        multiple
        open={opend}
        onOpen={() => setOpend(true)}
        onClose={() => setOpend(false)}
        value={selectedSeries}
        onChange={handleCollectionChange}
        input={<OutlinedInput label="Select Clients" />}
        renderValue={(selected) => selected.map(id => {
          const collection = collectionList.find(c => c._id === id);
          return collection ? collection.name : '';
        }).join(', ')}
      >
        {collectionList ? collectionList.map((client) => (
          <MenuItem key={client._id} value={client._id}>
            <Checkbox checked={selectedSeries.indexOf(client._id) > -1} />
            <ListItemText primary={client.name} />
          </MenuItem>
        )) : <MenuItem>No option</MenuItem>}
      </Select>
              </FormControl>

              {selectedSeriesname.length > 0 && (
        <div>
          <h3>Selected Collections:</h3>
          <ul>
            {/* {console.log(selectedSeriesname)} */}
            {selectedSeriesname ? selectedSeriesname.map(collectionId => (
              <li key={collectionId}>{collectionId}</li>
            )):null}
          </ul>
        </div>
      )}
      
      

            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateWorkbook}
              style={{ marginTop: '20px' }}
            >
              Create Workbook
            </Button>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleClosemodel}
                style={{  marginLeft: '20px' ,marginTop: '20px' }}
              >
                Cancel
              </Button>
          </Box>
        </Fade>
      </Modal>


      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openw}
        onClose={handleClosew}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openw}>
          <Box style={stylew}>
          <Typography id="transition-modal-title" variant="h6" component="h2" gutterBottom>
              Assign Workbooks
            </Typography>
            <Typography id="transition-modal-description" variant="body1" gutterBottom>
              Please select workbooks to be assigned to the selected clients. This allows clients to access and work on the assigned workbooks.
            </Typography>
            <FormControl variant="outlined" fullWidth style={{ marginBottom: '20px', marginTop:'10px' }}>
              <InputLabel id="select-clients-label">Select Clients</InputLabel>
             
               <Select
              labelId="select-clients-label"
              id="select-clients"
              multiple
              open={openwc}
              onOpen={() => setOpenwc(true)}
        onClose={() => setOpenwc(false)}
              value={selectedClients}
              onChange={handleClientsChange}
              input={<OutlinedInput label="Select Clients" />}
              renderValue={(selected) => selected.map(id => {
                const client = clientUserList.find(c => c._id === id);
                return client ? client.name : '';
              }).join(', ')}
            >
              {clientUserList ? clientUserList.map(client => (
                <MenuItem key={client._id} value={client._id}>
                  <Checkbox checked={selectedClients.indexOf(client._id) > -1} />
                  <ListItemText primary={client.name} />
                </MenuItem>
              )) : <MenuItem>No option</MenuItem>}
            </Select>
            </FormControl>
            {selectedClientsname.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <Typography variant="body1">Selected Clients:</Typography>
                {selectedClientsname.map((client) => (
                  <Typography key={client} variant="body2">
                    {client}
                  </Typography>
                ))}
              </div>
            )}
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="select-workbooks-label">Select Workbooks</InputLabel>
             
              <Select
              labelId="select-workbooks-label"
              id="select-workbooks"
              multiple
              open={openww}
              onOpen={() => setOpenww(true)}
        onClose={() => setOpenww(false)}
              value={selectedWorkbooks}
              onChange={handleWorkbooksChange}
              input={<OutlinedInput label="Select Workbooks" />}
              renderValue={(selected) => selected.map(id => {
                const workbook = workbooks.find(wb => wb._id === id);
                return workbook ? workbook.name : '';
              }).join(', ')}
            >
              {workbooks ? workbooks.map(workbook => (
                <MenuItem key={workbook._id} value={workbook._id}>
                  <Checkbox checked={selectedWorkbooks.indexOf(workbook._id) > -1} />
                  <ListItemText primary={workbook.name} />
                </MenuItem>
              )) : <MenuItem>No option</MenuItem>}
            </Select>
            </FormControl>
            {selectedWorkbooksname.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <Typography variant="body1">Selected Workbooks:</Typography>
                {selectedWorkbooksname.map((workbook) => (
                  <Typography key={workbook} variant="body2">
                    {workbook}
                  </Typography>
                ))}
              </div>
            )}
             {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress />
        </div>
      ) : (<>
             <Button
              variant="contained"
              color="primary"
              onClick={handleAssignWorkbook}
              style={{ marginTop: '20px' }}
            >
              Assign
            </Button>
             <Button
             variant="contained"
             color="secondary"
             onClick={handleClosemodel}
             style={{ marginLeft: '20px' , marginTop: '20px' }}
           >
             Cancel
           </Button>
          </>
          )}
          </Box>
        </Fade>
      </Modal>


            <Box mx={2} my={1} boxShadow={0}>
                <Grid
                    container
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="stretch"
                    spacing={1}
                    appState={appState}
                >
                    <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                        
                        <Grid item xs>
                            <Box mx={3} my={1} boxShadow={0}>
                                <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                                    <Grid item>
                                        <Tooltip
                                            placement="bottom"
                                            title="Refresh Online Users"
                                        >
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<RefreshIcon />}
                                                onClick={() => { pullHandler(); }}
                                            >
                                                Refresh
                                            </Button>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        {appState.role === "Volunteer" ? (
                                            <>
                                            </>
                                        ) : (
                                            <Tooltip
                                                placement="bottom"
                                                title="Create User"
                                            >
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<AddBoxOutlinedIcon />}
                                                    onClick={() => { createUserHandler(); }}
                                                >
                                                    Create a User
                                                </Button>
                                            </Tooltip>
                                        )}
                                    </Grid>

                                    {appState.role !== "Volunteer" ? (
                                        <Grid item>
                                            <Tooltip
                                                placement="bottom"
                                                title="Assign User"
                                            >
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="secondary"
                                                    startIcon={<SupervisorAccountIcon />}
                                                    onClick={() => { assignUserHandler(); }}
                                                >
                                                    Assign User
                                                </Button>
                                            </Tooltip>
                                        </Grid>
                                    ) : (
                                        <>
                                        </>
                                    )}


                                    {appState.role !== "Volunteer" ? (
                                        <Grid item>
                                            <Tooltip
                                                placement="bottom"
                                                title="Assign User"
                                            >
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="primary"
                                                    // startIcon={<SupervisorAccountIcon />}
                                                    startIcon={ < BookIcon /> }
                                                    // onClick={() => { createworkbookHandler(); }}
                                                    // onClick={AssignMemberHandler}
                                                    onClick={handleOpen}
                                                >
                                                    create workbook
                                                </Button>
                                            </Tooltip>
                                        </Grid>
                                    ) : (
                                        <>
                                        </>
                                    )}

                                      {appState.role !== "Volunteer" ? (
                                        <Grid item>
                                            <Tooltip
                                                placement="bottom"
                                                title="Assign User"
                                            >
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="secondary"
                                                    startIcon={<AssignmentIcon />}
                                                    // onClick={() => { createworkbookHandler(); }}
                                                    onClick={handleOpenw}
                                                >
                                                   Assign Workbook
                                                </Button>
                                            </Tooltip>
                                        </Grid>
                                    ) : (
                                        <>
                                        </>
                                    )}


                                </Grid>
                            </Box>
                        </Grid>
                        <Grid item>
                            <Tooltip
                                placement="left"
                                title="Use this page to manage users in the system."
                            >
                                <IconButton>
                                    <HelpOutlineIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                        <Box mx={1} my={1} boxShadow={0}>
                            <Card>
                                <Box mx={1} my={1} boxShadow={0}>
                                    <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={3}>
                                        {/* <Grid item>
                                                <Typography color="textPrimary" variant="subtitle2">
                                                    Table Options
                                                </Typography>
                                            </Grid>
                                            {appState.role != "Volunteer"? (
                                                <Grid item>
                                                    <FormControlLabel
                                                        control={<Switch checked={isDense} onChange={ (event) => { compactHandler(event); }} />}
                                                        label="Compact"
                                                        labelPlacement="end"
                                                    />
                                                </Grid>
                                            ) :(<></>)} */}
                                        <Grid item>
                                            <FormControl id="search-filter-select-label" variant="filled" size="small" style={{ minWidth: 140 }} disabled={dataList ? false : true}>
                                                <InputLabel>
                                                    Search Filter
                                                </InputLabel>
                                                <Select
                                                    autoWidth={true}
                                                    labelId="search-filter-select-label"
                                                    value={selectSearchFilterOption}
                                                    onChange={(event) => { selectSearchHandler(event); }}
                                                >
                                                    {selectFilterOptions.map(item => {
                                                        return (
                                                            <MenuItem key={item.key} value={item.value}>
                                                                <em>{item.display}</em>
                                                            </MenuItem>
                                                        )
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs>
                                            <TextField label="Search"
                                                type="search"
                                                size="small"
                                                variant="filled"
                                                fullWidth
                                                value={searchFilter}
                                                onChange={(event) => { searchHandler(event); }}
                                                disabled={dataList ? false : true}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Card>
                        </Box>
                    </Grid>
                    {/* <Grid item xs={12} container direction="row" justifyContent="flex-start" alignItems="flex-start" spacing={1}>
                        <Grid item>
                            <Typography variant="h6" component="h6">
                                Table
                            </Typography>
                            <Divider />
                        </Grid>
                    </Grid> */}
                </Grid>
            </Box>
        </>
    );
}

// ======================== Component PropType Check ========================
UsersManagementControlPanel.propTypes =
{
    // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
    appState: PropTypes.object.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    isDense: PropTypes.bool.isRequired,
    setIsDense: PropTypes.func.isRequired,
    dataList: PropTypes.arrayOf(PropTypes.object).isRequired,
    getParentData: PropTypes.func.isRequired,
    setSearchFilteredDataList: PropTypes.func.isRequired,
    setCreateUserDialog: PropTypes.func.isRequired,
    setAssignUserDialog: PropTypes.func.isRequired,
    setCreateWorkbookDialog: PropTypes.func.isRequired,

}

UsersManagementControlPanel.defaultProps =
{
    appState: {},
    setParentAlert: () => { },
    setIsDense: () => { },
    dataList: {},
    getParentData: () => { },
    setSearchFilteredDataList: () => { },
    setCreateUserDialog: () => { },
    setAssignUserDialog: () => { },
    setCreateWorkbookDialog: () => { }

}

export default UsersManagementControlPanel;  // You can even shorthand this line by adding this at the function [Component] declaration stage