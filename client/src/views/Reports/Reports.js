// ================================================
// COMMUNITY CONNECTIONS REPORT WHEN VIEWED THROUGH ADMIN/VOL/COORDINATOR
// ================================================
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types"; //Development Package to validate prop types [Type Checking] passed down
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';
import './reports.css';

// ==================== Modules =====================
import Pagination from "@material-ui/lab/Pagination";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// ==================== Components ==================
import AlertMessage from "../../components/AlertMessage";

import Summary from "./Summary";
import PossibleConcerns from "./PossibleConcerns";
import Suggestions from "./Suggestions";
import ContactInfo from "./ContactInfo";
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
import { CircularProgress } from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography"; //h1, p replacement Tag
import ReportDashboard from "./ReportDashboard";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { set } from "joi/lib/types/lazy";

// ==================== MUI Icons ====================

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

const Reports = (props) => {
  // Notice the arrow function... regular function()  works too

  // Variables ===

  // Style variable declaration
  const classes = useStyles();

  const { userID, appState, ToggleDrawerClose, CheckAuthenticationValidity } =
    props;

  // Alert variable
  const [alert, setAlert] = useState(new AlertType());

  // // Hard-Coded Person item
  // // This is John Cena's
  // const [personId, setPersonId] = useState("60e879aac417375c838307b9");

  const [reportsData, setReportsData] = useState(null);
  const [patientData, setPatientData] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(userID);
  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const [memberName, setMemberName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [anyFlags, setAnyFlags] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  // Functions ===

  const getNeighbours = useCallback(
    (userId) => {
      get("reports/neighbours/user/" + userId, appState.token, (err, res) => {
        if (err) {
          //Bad callback
          setAlert(
            new AlertType(
              "Unable to retrieve Community Connection Series Report. Please refresh and try again.",
              "error"
            )
          );
        } else {
          if (res.status === 200) {
            const { memberName, ...otherData } = res.data;

            if (Object.keys(otherData).length === 0) {
              setReportsData(null);
            } else {
              // console.log(n);
              setMemberName(memberName);
              setReportsData(otherData);
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

  const patientSelectHandler = useCallback((event) => {
    setCurrentPatient(event.target.value);
  }, []);

  const reportsPaginationHandler = useCallback((event, page) => {
    setCurrentReportIndex(page - 1);
  }, []);

  // generate report pdf and initiate download
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    const reportElement = document.getElementById('report');

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
    // setTimeout(() => {
    //   CheckAuthenticationValidity((tokenValid) => {
    //     getPatients(currentPatient);
    //   });
    // }, 200); //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentPatient != "") {
      getNeighbours(currentPatient);
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

  // useEffect( () =>
  // {
  //     console.log(currentReportIndex);

  // }, [ currentReportIndex ]);

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
                      Reports
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
                        <Grid item xs={12}>

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
                            {memberName}
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
                          Object.keys(reportsData).length != 0 &&
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

                              <ReportDashboard
                                reports={reportsData}
                                collection={currentReportIndex}
                              ></ReportDashboard>
                            </Grid>

                            <Grid item xs={12} id="summary" style={{ marginTop: '10px' }}>
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

                            <Grid item xs={12}>
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
                              <Grid item xs={12} id="possible concerns" className="avoid-break">
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
                                >
                                  Suggestions
                                </Typography>
                                <Suggestions
                                  reports={reportsData}
                                  collection={currentReportIndex}
                                />
                              </Grid>
                            )}

                            <Grid item xs={12} style={{ paddingTop: '30px' }}>
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
                              No available data
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
            Data Not Available
          </Typography>
        )}
      </Grid>
    </div>
  ) : (
    <Typography variant="h6" color="inherit" align="center" gutterBottom>
      Not Authorized. Please refresh and try again.
    </Typography>
  );
};

// ======================== Component PropType Check ========================
Reports.propTypes = {
  // You can specify the props types in object style with ___.PropTypes.string.isRequired etc...
  appState: PropTypes.object.isRequired,
  ToggleDrawerClose: PropTypes.func.isRequired,
  CheckAuthenticationValidity: PropTypes.func.isRequired,
};

Reports.defaultProps = {
  appState: {},
  ToggleDrawerClose: () => { },
  CheckAuthenticationValidity: () => { },
};

export default Reports; // You can even shorthand this line by adding this at the function [Component] declaration stage
