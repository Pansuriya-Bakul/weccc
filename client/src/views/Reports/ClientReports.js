// ================================================
// CLIENT COMMUNITY CONNECTIONS REPORT
// ================================================
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types"; //Development Package to validate prop types [Type Checking] passed down
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';

import './reports.css'; // needed to specify page breaks for pdf download

// ==================== Modules =====================

// ==================== Components ================== 
import AlertMessage from "../../components/AlertMessage";

import Summary from "./Summary";
import PossibleConcerns from "./PossibleConcerns";
import Suggestions from "./Suggestions";
import CommunityCircle from "./CommunityCircle/CommunityCircle";
import SocialAndCommunityConnections from "./SocialAndCommunityConnections";

// ==================== Helpers =====================
import AlertType from "../../helpers/models/AlertType";
import checkAlerts from "./ConcernAlerts/checkAlerts";
import get from "../../helpers/common/get";
import post from "../../helpers/common/post";
// ==================== MUI =========================
import { makeStyles } from "@material-ui/core/styles"; // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from "@material-ui/core/Grid"; // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from "@material-ui/core/Box"; // Padding and margins
import Card from "@material-ui/core/Card"; //Like the paper module, a visual sheet to place things
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import Typography from "@material-ui/core/Typography"; //h1, p replacement Tag
import ReportDashboard from "./ReportDashboard";
import AssessmentIcon from "@material-ui/icons/Assessment";

import { CircularProgress } from '@material-ui/core';
import CardContent from "@material-ui/core/CardContent";
import "../../css/gauge-chart.css";


// ==================== MUI Styles ===================

const useStyles = makeStyles(
  (
    theme //Notice the hook useStyles
  ) => ({
    root: {
      flexGrow: 1, // CSS determined this way, flexbox properties
      height: "100%",
    },
    rootGrid: {
      height: "100%",
    },
  })
);

// ================= Static Variables ================

// ================= Static Functions ================

// ======================== React Modern | Functional Component ========================

const ClientReports = (props) => {
  // Notice the arrow function... regular function()  works too

  // Variables ===

  // Style variable declaration
  const classes = useStyles();

  // Declaration of Stateful Variables ===
  const { appState, ToggleDrawerClose, userID, CheckAuthenticationValidity } = props;

  // Alert variable
  const [alert, setAlert] = useState(new AlertType());

  // // Hard-Coded Person item
  // // This is John Cena's
  // const [personId, setPersonId] = useState("60e879aac417375c838307b9");

  const [reportsData, setReportsData] = useState(null);
  const [patientData, setPatientData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentPatient, setCurrentPatient] = useState(userID ? {} : appState);
  // eslint-disable-next-line no-unused-vars
  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [anyFlags, setAnyFlags] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  // Functions ===


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

  const getPatients = useCallback(() => {
    if (appState.role === "Patient") {
      // setAlert(
      //   new AlertType("You do not have Permission to recieve Patients", "error")
      // );
      return;
    } else {
      if (appState.patients.length <= 0) {
        // setAlert(
        //   new AlertType(
        //     "You do not have any patients assigned. In order to start a series, you must first be assigned a member by an Administrator.",
        //     "error"
        //   )
        // );
        return;
      }

      let http_query = {
        _id: {
          $in: appState.patients,
        },
      };

      post("users/query", appState.token, http_query, (err, res) => {
        if (err) {
          //Bad callback
          setAlert(
            new AlertType(
              "Unable to retrieve Patients. Please refresh and try again.",
              "error"
            )
          );
        } else {
          if (res.status === 200) {
            setPatientData(res.data.response.users);
          } else {
            //Bad HTTP Response
            setAlert(
              new AlertType(
                "Unable to retrieve Patients. Please refresh and try again.",
                "error"
              )
            );
          }
        }
      });
    }
  }, [appState]);

  // create a facility until we have a facility creation page

  //   const postF = async () => {
  //     let data = {
  //         name: "North York",
  //         prefix: "NOY"
  //     };

  //     post("facilities", appState.token, data, (err, res) => {
  //         if (err) {
  //             console.log(err);
  //         } else {
  //             console.log(res);
  //         }
  //     });
  // }

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
      });
    },
    [appState]
  );


  // const patientSelectHandler = useCallback((event) => {
  //   setCurrentPatient(event.target.value);
  // }, []);

  // const reportsPaginationHandler = useCallback((event, page) => {
  //   setCurrentReportIndex(page - 1);
  // }, []);

  // generate report pdf and initiate download
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    const reportElement = document.getElementById('report');

    // eslint-disable-next-line no-unused-vars
    const canvas = await html2canvas(reportElement);
    const opt = {
      margin: 5,
      filename: 'cc_report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a2', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(reportElement).save();
    setIsDownloading(false);
  };


  // Hooks ===

  // First Render only because of the [ ] empty array tracking with the useEffect
  useEffect(() => {
    ToggleDrawerClose();
    setTimeout(() => {
      CheckAuthenticationValidity(async (tokenValid) => {
        if (userID) {
          let currPatient = {};
          await getUser(userID).then((user) => {

            currPatient = {
              _id: user._id,
              name: user.info.name,
            }

            setCurrentPatient(currPatient);

          });
        }
        getPatients(currentPatient._id);
      });
    }, 200); //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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


  // Render Section ===

  return alert != null ? (
    <div className={classes.root}>
      <Grid
        container
        className={classes.rootGrid}
        direction="row"
        justifyContent="flex-start"
        alignItems="stretch"
        spacing={1}
      >
        {patientData ? (
          <>
            <Grid item xs={8}>
              <Box mx={1} my={1}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="flex-end"
                  spacing={2}
                >
                  <Grid item>
                    <AssessmentIcon color="primary" />
                  </Grid>
                  <Grid item xs>
                    <Typography
                      variant="h5"
                      color="secondary"
                      align="left"
                      gutterBottom={false}
                    >
                      My Reports
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid id="report">
              <Grid item xs={12}>
                <Card raised={true}>
                  <CardContent>
                    <Box mx={1} my={1} boxShadow={0}>
                      <div
                        container
                        style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between" }}
                      >
                        <Grid item xs={12} >
                          <Typography
                            style={{
                              fontSize: "16px",
                              color: "grey",
                              marginLeft: "2px",

                            }}
                          >
                            Member's name:
                          </Typography>
                          <Typography variant="h5" component="h1">
                            {currentPatient && currentPatient.name ? currentPatient.name : ""}
                          </Typography>

                          <p>Last Modified: {lastUpdated}</p>
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

              <Grid item xs={4}>
                <Box mx={1} my={1}>
                  <AlertMessage alert={alert} setParentAlert={setAlert} />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Card raised={true} style={{ padding: "10px" }}>
                  <Box mx={1} my={1} boxShadow={0}>
                    {isLoading ? (
                      <CircularProgress />
                    ) : (
                      <Grid
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={1}
                      >
                        {reportsData &&
                          Object.keys(reportsData).length !== 0 &&
                          Object.getPrototypeOf(reportsData) ===
                          Object.prototype ? (
                          <>
                            <Grid item xs={12}>
                              <Typography variant="h4" color="textPrimary">
                                Compassion Care Community Connections Report
                              </Typography>
                              <Divider light />
                            </Grid>

                            <Grid item xs={12} id="dashboard">
                              <Typography
                                variant="h5"
                                color="textSecondary"
                                align="left"
                                gutterBottom
                              >
                                Highlights
                              </Typography>

                              {/* chart */}
                              <ReportDashboard
                                reports={reportsData}
                                collection={currentReportIndex}
                              ></ReportDashboard>
                            </Grid>

                            <Grid item xs={12} id="summary" style={{ marginTop: '24px' }}>
                              <Typography
                                variant="h5"
                                color="textSecondary"
                                align="left"
                                gutterBottom
                              >
                                Summary
                              </Typography>
                              <Summary
                                reports={reportsData}
                                collection={currentReportIndex}
                              />
                            </Grid>

                            <Grid item xs={12} className="avoid-break" >
                              <CommunityCircle
                                reports={reportsData}
                                collection={currentReportIndex}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Typography
                                variant="h5"
                                color="textSecondary"
                                align="left"
                                gutterBottom
                              >
                                Social and Community Connections
                              </Typography>
                              <SocialAndCommunityConnections
                                reports={reportsData}
                                collection={currentReportIndex}
                              />
                            </Grid>

                            {anyFlags && (
                              <Grid item xs={12} id="possible concerns" className="avoid-break" style={{ marginTop: '20px' }}>
                                <Typography
                                  variant="h5"
                                  color="textSecondary"
                                  align="left"
                                  gutterBottom
                                >
                                  Possible Concerns
                                </Typography>
                                <PossibleConcerns
                                  reports={reportsData}
                                  collection={currentReportIndex}
                                />
                              </Grid>
                            )}

                            {anyFlags && (
                              <Grid item xs={12} id="suggestions">
                                <Typography
                                  variant="h5"
                                  color="textSecondary"
                                  align="left"
                                  gutterBottom
                                  className="avoid-break"
                                >
                                  Suggestions
                                </Typography>
                                <Suggestions
                                  reports={reportsData}
                                  collection={currentReportIndex}
                                />
                              </Grid>
                            )}

                            <Grid item xs={12} style={{ paddingTop: '30px' }} className="avoid-break">
                              <Typography
                                variant="h5"
                                color="textSecondary"
                                align="left"
                                gutterBottom

                              >
                                What Now?
                              </Typography>
                              <Typography
                                variant="body1"
                                align="left"
                                gutterBottom
                              >
                                Maintaining good social health and addressing social health concerns will improve your well-being along with your physical and mental health. Having trouble figuring out next steps?<br></br> CONTACT US at <a href="mailto:hwfc.lab@gmail.com" target="_blank" rel="noopener noreferrer">hwfc.lab@gmail.com</a> to talk to a trained Community Connector - we can help you set goals and find activities and resources to promote your health and address social risks.

                              </Typography>
                            </Grid>

                          </>
                        ) : (
                          <>
                            <Typography
                              variant="subtitle2"
                              color="textSecondary"
                              align="left"
                              gutterBottom
                            >
                              No available reports.
                            </Typography>
                          </>
                        )}
                      </Grid>
                    )}
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </>
        ) : (
          <Typography
            variant="subtitle2"
            color="textSecondary"
            align="left"
            gutterBottom
          >
            Persons Data Not Available
          </Typography>
        )}
      </Grid>
    </div >
  ) : (
    <Typography variant="h6" color="inherit" align="center" gutterBottom>
      Not Authorized. Please refresh and try again.
    </Typography>
  );
};

// ======================== Component PropType Check ========================
ClientReports.propTypes = {
  // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
  appState: PropTypes.object.isRequired,
  ToggleDrawerClose: PropTypes.func.isRequired,
  CheckAuthenticationValidity: PropTypes.func.isRequired,
};

ClientReports.defaultProps = {
  appState: {},
  ToggleDrawerClose: () => { },
  CheckAuthenticationValidity: () => { },
};

export default ClientReports; // You can even shorthand this line by adding this at the function [Component] declaration stage
