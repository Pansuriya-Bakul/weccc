// ================================================
// Code associated with 
// ================================================
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';                     //Development Package to validate prop types [Type Checking] passed down

// ==================== Modules =====================

// ==================== Components ==================
// import ChangesUserDialog from '../Dialog/ChangesUserDialog';

// ==================== Helpers =====================
import post from '../../../../../helpers/common/post';
import get from '../../../../../helpers/common/get';
import put from '../../../../../helpers/common/put';
import AlertType from '../../../../../helpers/models/AlertType';
import axios from 'axios';


// ==================== MUI =========================
import { makeStyles } from '@material-ui/core/styles';  // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks
import { Refresh as RefreshIcon, Save as SaveIcon, HelpOutline as HelpOutlineIcon} from '@material-ui/icons';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';  // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from '@material-ui/core/Box';    // Padding and margins
import Card from '@material-ui/core/Card';  //Like the paper module, a visual sheet to place things
import CardContent from '@material-ui/core/CardContent';
import CardHeader from "@material-ui/core/CardHeader";
import MarkunreadIcon from '@material-ui/icons/Markunread';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import Divider from '@material-ui/core/Divider';

import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { ListSubheader, TextField } from '@material-ui/core';

// ==================== MUI Icons ====================



const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      height: '100%'
    },
    rootGrid: {
      height: '100%'
    }
  }));
  
  const UserNotesTab = (props) => {
    const classes = useStyles();
    const { appState, userID, setParentAlert, getParentInfo, panelId, panelIndex, userOriginal } = props;
  
    const [userData, setUserData] = useState([]);
    const [value, setValue] = useState([]);
    const [note, setNote] = useState("");
    const [userEdit, setUserEdit] = useState(null);
    const [notesList, setNoteList] = useState([]);
    const [pdfFile, setPdfFile] = useState(null); // New state for file upload
  
    const saveNote = useCallback(() => {
      if (userID != null) {
          const formData = new FormData();
          formData.append('senderId', userID);
          formData.append('receiverId', value);
          formData.append('message', note);
          if (pdfFile) {
              formData.append('pdf', pdfFile);
          }


          axios.post('http://localhost:3001/api/notes/', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
                  'Authorization': `Bearer ${appState.token}`
              }
          })
          .then(res => {
              if (res.status === 200 || res.status === 304) {
                  setParentAlert(new AlertType('Successfully saved note.', "success"));
                  setNote("");
                  setValue("");
                  setPdfFile(null); // Reset file input
              } else {
                  setParentAlert(new AlertType('Unable to save note. Please refresh and try again.', "error"));
              }
          })
          .catch(error => {
              setParentAlert(new AlertType('Unable to save note. Please refresh and try again.', "error"));
          });
      }
  }, [note, pdfFile, value, userID, appState.token, setParentAlert]);
  

  
    const resetNote = useCallback((event) => {
      setNote("");
      setValue([]);
      setPdfFile(null); // Reset file input
    }, []);
  
    const handleFileChange = (event) => {
      setPdfFile(event.target.files[0]); // Handle file selection
    };
  
    const getUsers = useCallback((event) => {
      if (userID != null) {
        get("users/getAllUsers/" + userID, appState.token, (err, res) => {
          const arr = [];
          try {
            if (res.data) {
              if (res.data.user.patients) {
                res.data.user.patients.forEach(patient => {
                  arr.push({ "name": patient.info.name, "id": patient._id });
                });
              }
              if (res.data.user.admins) {
                res.data.user.admins.forEach(admin => {
                  arr.push({ "name": admin.info.name, "id": admin._id });
                });
              }
              if (res.data.user.coordinators) {
                res.data.user.coordinators.forEach(coordinator => {
                  arr.push({ "name": coordinator.info.name, "id": coordinator._id });
                });
              }
              if (res.data.user.volunteers) {
                res.data.user.volunteers.forEach(volunteer => {
                  arr.push({ "name": volunteer.info.name, "id": volunteer._id });
                });
              }
            }
          } catch (error) {
            setParentAlert(new AlertType('Unable to fetch users. Please refresh and try again.', "error"));
          }
  
          setUserData(arr);
        });
      }
    }, [appState.token, setParentAlert, userID]);
  
    const userSelectHandler = useCallback((event) => {
      setValue(event.target.value);
    }, []);
  
    const handleNoteStatus = useCallback((noteId) => {
      const updatedNotesList = notesList.map(note => {
        if (noteId === note.id) {
          note.status = "read";
        }
        return note;
      });
      setNoteList(updatedNotesList);
      setParentAlert(new AlertType('Note read.', "success"));
      put("notes/", appState.token, { 'noteID': noteId }, (err, res) => {});
    }, [notesList, setParentAlert, appState.token]);
  
    const getFormattedDate = (d) => {
      const date = new Date(d);
      const dateTime = getMonthName(date.getMonth()) + ' ' + date.getDate() + ' , ' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getUTCMinutes();
      return dateTime;
    };
  
    const getMonthName = (m) => {
      const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      return monthNames[m];
    };
  
    const getNotes = useCallback((event) => {
      if (userID != null) {
        get("notes/" + userID, appState.token, (err, res) => {
          if (err == null) {
            const formattedNotes = res.data.foundNotes.map(note => ({
              ...note,
              createdAt: getFormattedDate(note.createdAt)
            }));
            setNoteList(formattedNotes);
          }
        });
      }
    }, [appState.token, userID]);
  
    const renderRow = notesList.map((note) => {
      const id = note._id;
      const pdfPath = note.pdf ? note.pdf.url : null;
    
      // Construct the URL based on the environment
      const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      const baseUrl = isDevelopment ? 'http://localhost:3001' : 'https://weccc-ims-app.herokuapp.com/';
      const pdfUrl = pdfPath ? `${baseUrl}/${pdfPath}` : null;
    
      return (
        <div key={id}>
          <Card variant="outlined" style={{ marginTop: 15 }}>
            <List subheader={<ListSubheader component="div">{note.senderId.info.name}</ListSubheader>}>
              <ListItem>
                <ListItemText
                  primary={note.message}
                  secondary={note.createdAt}
                />
                {pdfUrl && (
                  <Link href={pdfUrl} target="_blank" rel="noopener" style={{ marginLeft: '1rem' }}>
                    View PDF
                  </Link>
                )}
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" size="small" onClick={() => handleNoteStatus(id)}>
                    {note.status === "unread" ? (<MarkunreadIcon />) : (<MailOutlineIcon />)}
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Card>
        </div>
      );
    });
    
    
  
    useEffect(() => {
      setUserEdit(userOriginal);
    }, [userOriginal]);
  
    useEffect(() => {
      getUsers();
      if (notesList.length === 0) getNotes();
    }, [value, getNotes, getUsers, notesList.length]);
  
    return (
      userOriginal ? (
        <div role="tabpanel" hidden={panelIndex !== panelId} id={`Panel-${panelId}`}>
          <Collapse in={panelIndex === panelId}>
            {userEdit ? (
              <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
                <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                  <Grid item>
                    <Typography variant="h6">Add Note</Typography>
                    <Divider />
                  </Grid>
                  <Grid item>
                    <Box boxShadow={0}>
                      <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                        <Grid item>
                          <Button onClick={saveNote} color="primary" variant="contained" size="small" startIcon={<SaveIcon />}>
                            Save
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button onClick={resetNote} color="secondary" variant="contained" size="small">
                            Reset
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <Box mx={3} my={1} boxShadow={0}>
                      <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                        <Grid item lg={8}>
                          <FormControl fullWidth variant="filled" size="small" className={classes.formControl}>
                            <InputLabel id="select-label-Member">Member</InputLabel>
                            <Select
                              className={classes.selectEmpty}
                              labelId="select-label-Member"
                              id="select-user"
                              fullWidth
                              defaultValue=""
                              disabled={!userData.length}
                              onChange={userSelectHandler}
                            >
                              {userData.map((item) => (
                                <MenuItem key={item.id} value={item.id}>
                                  <em>{item.name}</em>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box mx={3} my={1} boxShadow={0}>
                      <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                        <Grid item lg={8}>
                          <TextField
                            id="Note"
                            multiline
                            rows={5}
                            variant="outlined"
                            placeholder="Write your notes here..."
                            fullWidth
                            label="Note"
                            onChange={(event) => setNote(event.target.value)}
                            value={note}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box mx={3} my={1} boxShadow={0}>
                      <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={1}>
                        <Grid item lg={8}>
                        <Typography variant="h7">Add PDF</Typography><br/>
                          <input type="file" accept="application/pdf" onChange={handleFileChange} />
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={12} container direction="row" justifyContent="space-between" alignItems="stretch" spacing={1}>
                  <Grid item>
                    <Typography variant="h6">My Notes</Typography>
                    <Divider />
                  </Grid>
                  <Grid item>
                    <Tooltip placement="left" title="This allows all notes received for current user">
                      <IconButton><HelpOutlineIcon /></IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
                <Grid item>
                  {notesList.length !== 0 ? renderRow : "There are no notes available for you!"}
                </Grid>
              </Grid>
            ) : (
              <Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
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
        <></>
      )
    );
  };
  
  UserNotesTab.propTypes = {
    appState: PropTypes.object.isRequired,
    userID: PropTypes.string.isRequired,
    setParentAlert: PropTypes.func.isRequired,
    getParentInfo: PropTypes.func.isRequired,
    panelId: PropTypes.number.isRequired,
    panelIndex: PropTypes.number.isRequired,
    userOriginal: PropTypes.object
  };
  
  UserNotesTab.defaultProps = {
    appState: {},
    userID: null,
    setParentAlert: () => {},
    getParentInfo: () => {},
    panelId: null,
    panelIndex: null,
    userOriginal: {}
  };
  
  export default UserNotesTab;