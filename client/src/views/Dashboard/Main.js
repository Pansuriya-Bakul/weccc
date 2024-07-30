//=============================================================
// MAIN DASHBOARD PAGE WHEN USER LOGS IN
//=============================================================

import React, { Component, useEffect, useState, useCallback } from "react";
import get from "../../helpers/common/get";
import { Link } from "react-router-dom";
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import AlertType from '../../helpers/models/AlertType';

// ==================== MUI ====================
import Tooltip from "@material-ui/core/Tooltip";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Dashboard from "@material-ui/icons/Dashboard";
import { CircularProgress,  Divider, LinearProgress} from "@material-ui/core";
import "./main.css";
import GetAppOutlined from '@material-ui/icons/GetAppOutlined';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import { TableHead } from '@material-ui/core';
import TableRow from '@material-ui/core/TableRow';
import checkAlerts from "../Reports/ConcernAlerts/checkAlerts";
import ReportDashboard from "../Reports/ReportDashboard";

import { Apps } from "@material-ui/icons";
const styles = (theme) => ({

});

const Maintemp = (props) => {
  const { classes, appState, ToggleDrawerClose, userID, CheckAuthenticationValidity } = props;
  // Alert variable
  const [alert, setAlert] = useState(new AlertType());

  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [facilityName, setFacilityName] = useState("");
  const [userCollections, setUserCollections] = useState([]);
  const [patientCollections, setPatientCollections] = useState([]);
  const [openBoxes, setOpenBoxes] = useState({});
  const patientID = appState.patients;

  const [reportsData, setReportsData] = useState(null);
  const [currentPatient, setCurrentPatient] = useState(userID ? {} : appState);
  const [anyFlags, setAnyFlags] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const [latestReport, setLatestReport] = useState(null);

  const [name,setname]=useState(null)


  const getNeighbours = useCallback(
    (userId) => {
      get("reports/neighbours/user/" + userId, appState.token, (err, res) => {
        if (err) {
          //Bad callback
          setAlert(
            new AlertType(
              "Unable to retrieve Community Connection Series Report. Please refresh and try again."
            )
          );
        } else {
          if (res.status === 200) {
            if (Object.keys(res.data).length === 0) {
              setReportsData(null);
            } else {
              setReportsData(res.data);
            }
            setIsLoading(false);
          } else {
            //Bad HTTP Response
            setAlert(
              new AlertType(
                "Unable to retrieve Community Connection Series Report. Please refresh and try again.",
                "error"
              )
            );
          }
        }
        
      }
    );
    },
    [appState]
  );

  useEffect(() => {
    if (Object.keys(currentPatient).length !== 0) {
      getNeighbours(currentPatient._id);
      // getScreen(currentPatient);
    }
  }, [currentPatient]);

  useEffect(() => {
    if (reportsData !== null) {
      const flags = checkAlerts(reportsData, currentReportIndex);
      setAnyFlags(flags);
      setLastUpdated(reportsData.collection_last_updated);
    }
  }, [reportsData, currentReportIndex]);


  // Retrieve user's member collections
  const getMemberCollections = useCallback(async (userID) => {
    return new Promise((resolve, reject) => {
      get("membercollections/client/" + userID, appState.token, (err, res) => {
        if (err) {

          reject(new Error('Unable to retrieve Member Series. Please refresh and try again.'));
        } else {
          if (res.status === 200) {

            resolve(res.data.memberCollections);
            console.log(res.data.memberCollections)
            setLatestReport(res.data.recentSurvey.surveyTemplate.name)
            setname(res.data.recentSurvey)

          } else {

            reject(new Error('Bad HTTP Response'));
          }
        }
      });
    });
  }, [appState.token]);

  const getPatientCollections = useCallback(async (patientID) => {
    return new Promise((resolve, reject) => {
      get("membercollections/client/" + patientID, appState.token, (err, res) => {
        if (err) {
          reject(new Error('Unable to retrieve Patient Collections. Please refresh and try again.'));
        } else {
          if (res.status === 200) {
            resolve(res.data.memberCollections);
          } else {
            reject(new Error('Bad HTTP Response'));
          }
        }
      });
    });
  }, [appState.token]);

  // fetch daily quote
  const getQuote = async () => {
    return fetch("https://type.fit/api/quotes")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var today = new Date();
        var dd = parseInt(String(today.getDate()).padStart(2, "0"));
        var mm = parseInt(String(today.getMonth() + 1).padStart(2, "0")); //January is 0!
        var num = mm + dd;
        var count = Object.keys(data).length - 1;
        var randomnumber = Math.floor(count / num);
        return data[randomnumber];
      });
  };

  const getLatestReport = async () => {
    // Replace this with your actual API endpoint
    return get("membersurveys", appState.token, (err, res) => {
      if (err) {
        console.error('Error fetching latest report:', err);
        setAlert(new AlertType('Unable to retrieve the latest report. Please refresh and try again.', "error"));

      } else if (res.status === 200) {
        setLatestReport(res.data);
        console.log(latestReport);
      } else {
        console.error('Bad HTTP Response:', res);
        setAlert(new AlertType('Unable to retrieve the latest report. Please refresh and try again.', "error"));

      }

    });

  };

  // handles toggle of open/close collection boxes
  const toggleBox = (key) => {
    setOpenBoxes(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch quote of the day and update state
        const quoteResponse = await getQuote();
        setQuote({ text: quoteResponse.text, author: quoteResponse.author });

        // Fetch user's collections
        if (appState.role !== 'Admin') {
          try {
            const userCollections = await getMemberCollections(appState._id);
            setUserCollections(userCollections);
          } catch (error) {
            console.error('Error fetching client collections:', error);
            setAlert({ message: error.message, severity: "error" });
          }
        }

        // Fetch collections of assigned patients (clients) for Volunteer & Coordinator users
        if (appState.role !== 'Admin' && appState.role !== 'Patient') {
          try {
            const patientIds = appState.patients; // Assuming appState.patients is an array of patient IDs
            const patientCollectionPromises = patientIds.map(id => getPatientCollections(id));
            const patientCollections = await Promise.all(patientCollectionPromises);
            setPatientCollections(patientCollections.flat());
            console.log(patientCollections)
          } catch (error) {
            console.error('Error fetching patient collections:', error);
            setAlert({ message: error.message, severity: "error" });
          }
        }

        // Fetch the latest report
        await getLatestReport();
      } catch (error) {
        console.error('Error in fetchData:', error);
        setAlert({ message: 'An error occurred while fetching data. Please try again.', severity: 'error' });
      } finally {
        // Stop loading
        setIsLoading(false);
      }
    };

    ToggleDrawerClose();
    fetchData();
  }, [appState]);

  const collections = [...userCollections, ...patientCollections];
  const totalCollections = collections.length;
  const completedCollections = collections.filter(collection => collection.completeness === 100).length;
  const completionPercentage = (completedCollections / totalCollections) * 100;

  const [isDownloading, setIsDownloading] = useState(false);

const handleDownloadPDF = async () => {
  setIsDownloading(true);
  const reportElement = document.getElementById('report');

  const canvas = await html2canvas(reportElement);
  const opt = {
    margin: 5,
    filename: 'screener_report.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a2', orientation: 'portrait' }
  };

  await html2pdf().set(opt).from(reportElement).save();
  setIsDownloading(false);

};

  return (
    <Grid
      container
      className={classes.rootGrid}
      direction="row"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={2}
    >
      <Grid item xs={3}>
        <Box mx={1} my={1}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <Dashboard color="primary" />
            </Grid>
            <Grid item xs>
              <Typography
                variant="h5"
                color="secondary"
                align="left"
                gutterBottom={false}
              >
                Dashboard
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <Grid item xs={9}>
        <Box mx={1} my={1}>

        </Box>
      </Grid>
      <Grid item xs={12}>
        <Card raised={true}>
          <CardContent>
            <Box mx={1} my={1} boxShadow={0}>
              <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="stretch"
              >
                <Grid item xs={12}>
                  <Typography variant="h5" component="h1">
                    Welcome back, {appState.name}
                  </Typography>
                  <Typography
                    style={{
                      fontSize: "16px",
                      color: "grey",
                      marginLeft: "2px",
                      marginTop: "3px",
                    }}
                  >
                    Member of {appState.facilityName}
                  </Typography>
                </Grid>

              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {reportsData &&
                          Object.keys(reportsData).length !== 0 &&
                          Object.getPrototypeOf(reportsData) ===
                          Object.prototype ? (
                          <>
                            <Grid item xs={12}>
                              

                              {/* chart */}
                              <ReportDashboard
                                reports={reportsData}
                                collection={currentReportIndex}
                              ></ReportDashboard>
                            </Grid>
                            </>
                            ) : null }

{appState.role === 'Patient'?
<Grid item xs={12} id="report">
                <Card raised={true}>
                  <CardContent>
                    <Box mx={1} my={1} boxShadow={0}>
                      <div
                        container
                        style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between" }}
                      >
                        <Grid item xs={12}>
                          <Typography
                            style={{
                              fontSize: "16px",
                              color: "grey",
                            }}
                          >
                            Report:
                          </Typography>
                          <Typography variant="h5" component="h1" style={{
                            marginLeft: "2px",
                            marginTop: "3px",
                          }}>
                           {/* {currentPatient && currentPatient.name ? currentPatient.name : ""} */}
                           Social Health Screener Report
                          </Typography>
                          {/* Last Modified: {lastUpdated} */}
                        </Grid>
                        <div data-html2canvas-ignore="true">
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleDownloadPDF}
                            style={{ width: "150px", height: "40px" }}
                          >
                            {isDownloading ? <CircularProgress size={24} color="white" /> : "Download"}
                          </Button>
                        </div>
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid> 
              :null}
                
{appState.role === 'Patient'?
<Grid item xs={12}>
          <Card raised={true}>
            <CardContent className="dashboard-card">
              <Box mx={1} my={1} boxShadow={0}>
                <Grid
                  container
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="stretch"
                  spacing={1}
                >
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" component="h2" style={{fontSize:'18px'}}>
                        Latest Updated Survey
                      </Typography>
                  </Grid>
                {name? 
                <>

<Grid item xs={12}>
<Typography component="h2" style={{fontSize:'15.5px'}}>
    Updated on {name.updatedAt.slice(0,10)}
  </Typography>
</Grid>

                  <Grid item xs={12} >
                                          <Tooltip
                                            placement="bottom"
                                            title="Edit Module"
                                          >
                                            <Box m={1} pt={1} className="survey-box" style={{height:'20px'}}> 
                                              <Button
                                                className="survey-name"
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<EditIcon />}
                                                component={Link}
                                                to={`/administration/booklets/user/view/${name._id}`}
                                                style={{width:'90%', height:'35px'}}
                                              >
                                                {name.surveyTemplate.name}
                                              </Button>

                                              {name.completeness === 0 &&
                                                <div className="status-div not-started" style={{ height:'35px'}}>
                                                  <span>
                                                    Not
                                                    Started
                                                  </span>
                                                </div>
                                              }
                                              {name.completeness > 0 && name.completeness < 100 &&
                                                <div className="status-div in-progress" style={{ height:'35px'}}>
                                                  <span>
                                                    In Progress
                                                  </span>
                                                </div>
                                              }
                                              {name.completeness === 100 &&
                                                <div className="status-div completed" style={{ height:'35px'}}>
                                                  <span>
                                                    Completed
                                                  </span>
                                                </div>
                                              }
                                            </Box>

                                          </Tooltip>

                                        </Grid> 

                                        </>
                                        :
                                        
                                        <Grid item xs={12}>
                                        
                                           <Typography variant="subtitle2" component="h2" style={{fontSize:'18px'}}>
                                           There is NO any survey updated
                                          </Typography>
                                        
                                      </Grid>
                                        }


                                        </Grid>
                                        </Box>
                                        </CardContent>
                                        </Card>
                                        </Grid>
                                        :null}

      {appState.role == 'Coordinator' &&
      <Grid item xs={12}>
      <Card raised={true}>
        <CardContent className="dashboard-card">
          <Box mx={1} my={1} boxShadow={0}>
            <Grid
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="stretch"
              spacing={1}
            >
              <Grid item xs={12}>
                <Typography variant="subtitle2" component="h2">Series Assigned to User</Typography>
                <TableContainer>
                <Table>
      <TableHead>
        <TableRow className={classes.tableRow}>
          <TableCell>Serie Name</TableCell>
          <TableCell>To Assigned</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
      {patientCollections.length > 0 ? (
          patientCollections.flat().map((collection, index) => (
            <TableRow key={index}>
              <TableCell>{collection.collectionTemplate.name}</TableCell>
              <TableCell>{collection.member.info.name}</TableCell> {/* Assuming member.info.name holds the patient's name */}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={2} align="center">
              <Typography>No data available</Typography>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
    </TableContainer>
              </Grid>
            </Grid>
          </Box>
         </CardContent>
      </Card>
      </Grid>
            }

      {appState.role !== "Admin" && appState.role !== "Coordinator" &&
        <Grid item xs={12}>
          <Card raised={true}>
            <CardContent className="dashboard-card">
              <Box mx={1} my={1} boxShadow={0}>
                <Grid
                  container
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="stretch"
                  spacing={1}
                >
                  <Grid item xs={12}>
                    {appState.role === 'Patient'
                       ? <div style={{ display: 'flex', flexDirection: 'column' }}>
                       <Typography variant="subtitle2" component="h2" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span>What would you like to do today?</span>
                         <span>Completed Modules ({completedCollections}/{totalCollections})</span>
                       </Typography>
                       <Divider />
                     </div>
                      : <Typography variant="subtitle2" component="h2">
                        Current Assigned Tasks
                      </Typography>
                    }
                  </Grid>

                  {isLoading ? <CircularProgress />
                    : (
                      <Grid item xs={12}>
                        <Grid item xs={12}>
                          {/* Display list of user collections with completeness score != 100 */}
                          {userCollections.length > 0 &&
                            userCollections.map((collection, index) => (
                              collection.completeness < 100 &&
                              <div key={`user-${index}`}>
                                <Box
                                  mt={1.5}
                                  p={1.5}
                                  className="box-container"
                                  onClick={() => toggleBox(`user-${index}`)}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <h3 style={{ flex: 1, marginRight: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {collection.collectionTemplate.name} - {collection.member.info.name}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', width: '40%', minWidth: '150px', background: "white" , borderRadius:'5px',height:"25px" }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={collection.completeness} 
                            style={{ flex: 1, marginRight: '10px', marginLeft:"10px", borderRadius:"5px" , height:"8px"}}
                          />
                          <span style={{ whiteSpace: 'nowrap', color: "#e91e63", marginRight:"10px" }}>{collection.completeness}%</span>
                        </div>
                      </div>
                                </Box>
                                {openBoxes[`user-${index}`] &&
                                  <Box
                                    m={0}
                                    p={1.5}
                                    className="bottom-container"
                                  >
                                    <div className="survey-div">
                                      {collection.memberSurveyList.map((survey, index) => (
                                        <Grid item xs={12} key={index}>
                                          <Tooltip
                                            placement="bottom"
                                            title="Edit Module"
                                          >
                                            <Box m={1} pt={1} className="survey-box">
                                              <Button
                                                className="survey-name"
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<EditIcon />}
                                                component={Link}
                                                to={`/administration/booklets/user/view/${survey._id}`}

                                              >
                                                {survey.surveyTemplate.name}
                                              </Button>

                                              {/* Survey Progress indicator */}
                                              {survey.completeness === 0 &&
                                                <div className="status-div not-started">
                                                  <span>
                                                    Not
                                                    Started
                                                  </span>
                                                </div>
                                              }
                                              {survey.completeness > 0 && survey.completeness < 100 &&
                                                <div className="status-div in-progress">
                                                  <span>
                                                    In Progress
                                                  </span>
                                                </div>
                                              }
                                              {survey.completeness === 100 &&
                                                <div className="status-div completed">
                                                  <span>
                                                    Completed
                                                  </span>
                                                </div>
                                              }
                                            </Box>

                                          </Tooltip>

                                        </Grid>
                                      ))}

                                    </div>

                                  </Box>
                                }
                              </div>

                            ))
                          }
                          {patientCollections.length > 0 &&
                            patientCollections.map((collection, index) => (
                              collection.completeness < 100 &&
                              <div key={`patient-${index}`}>
                                <Box
                                  mt={1.5}
                                  p={1.5}
                                  className="box-container"
                                  onClick={() => toggleBox(`patient-${index}`)}
                                >
                                  <div
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                  >
                                    <h3>
                                      {collection.collectionTemplate.name} - {collection.member.info.name}
                                    </h3>
                                  </div>

                                </Box>

                                {openBoxes[`patient-${index}`] &&
                                  <Box
                                    m={0}
                                    p={1.5}
                                    className="bottom-container"
                                  >
                                    <div className="survey-div">
                                      {collection.memberSurveyList.map((survey, index) => (
                                        <Grid item xs={12} key={index}>
                                          <Tooltip
                                            placement="bottom"
                                            title="Edit Module"
                                          >
                                            <Box m={1} pt={1} className="survey-box">
                                              <Button
                                                className="survey-name"
                                                size="small"
                                                variant="contained"
                                                color="primary"
                                                startIcon={<EditIcon />}
                                                component={Link}
                                                to={`/administration/booklets/user/view/${survey._id}`}

                                              >
                                                {survey.surveyTemplate.name}
                                              </Button>

                                              {/* Survey Progress indicator */}
                                              {survey.completeness === 0 &&
                                                <div className="status-div not-started">
                                                  <span>
                                                    Not
                                                    Started
                                                  </span>
                                                </div>
                                              }
                                              {survey.completeness > 0 && survey.completeness < 100 &&
                                                <div className="status-div in-progress">
                                                  <span>
                                                    In Progress
                                                  </span>
                                                </div>
                                              }
                                              {survey.completeness === 100 &&
                                                <div className="status-div completed">
                                                  <span>
                                                    Completed
                                                  </span>
                                                </div>
                                              }
                                            </Box>

                                          </Tooltip>

                                        </Grid>
                                      ))}

                                    </div>

                                  </Box>
                                }
                              </div>

                            ))
                          }

                          {(!userCollections.length || userCollections.every(collection => collection.completeness === 100)) &&
                            (!patientCollections.length || patientCollections.every(collection => collection.completeness === 100)) &&
                            <div>No series assigned</div>
                          }
                        </Grid>
                      </Grid>
                    )
                  }


                </Grid>
              </Box>

            </CardContent>
          </Card>
        </Grid>
      }

      {/* Quote of the Day Box  */}
      <Grid
        item
        xs={12}
        container
        direction="row"
        justifyContent="space-evenly"
        alignItems="stretch"
        spacing={4}
        style={{ marginTop: "5px" }}
      >
        <Grid item xs={4}>
          <Card variant="outlined" style={{ backgroundColor: "aliceblue" }}>
            <CardContent>
              <Typography variant="h6" component="h2">
                Thought for the Day
              </Typography>
              <br />
              <Typography variant="body2" component="p" style={{ fontWeight: "500" }}>
                {quote.text}
              </Typography>
              <br />
              <Typography variant="body2" color="textSecondary">
                {quote.author}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Grid>
  );
}

export default withStyles(styles)(Maintemp);
