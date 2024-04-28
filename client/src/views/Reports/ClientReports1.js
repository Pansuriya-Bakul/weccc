// ================================================
// CLIENT SCREENER REPORT
// ================================================
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types"; //Development Package to validate prop types [Type Checking] passed down
import html2canvas from 'html2canvas';
import html2pdf from 'html2pdf.js';

// ==================== Modules =====================
import Pagination from "@material-ui/lab/Pagination";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

// ==================== Components ==================
import AlertMessage from "../../components/AlertMessage";

import Summary1 from "./Summary1";
import PossibleConcerns from "./PossibleConcerns1";
import Suggestions from "./Suggestions1";
import ContactInfo from "./ContactInfo";

// ==================== Helpers =====================
import AlertType from "../../helpers/models/AlertType";

import get from "../../helpers/common/get";
import post from "../../helpers/common/post";
// ==================== MUI =========================
import { makeStyles } from "@material-ui/core/styles"; // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from "@material-ui/core/Grid"; // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from "@material-ui/core/Box"; // Padding and margins
import Card from "@material-ui/core/Card"; //Like the paper module, a visual sheet to place things
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { CircularProgress } from '@material-ui/core';
import Typography from "@material-ui/core/Typography"; //h1, p replacement Tag
// import ReportDashboard from "./ReportDashboard";
import AssessmentIcon from "@material-ui/icons/Assessment";
import CardContent from "@material-ui/core/CardContent";

import risk1 from "../Reports/risk1.png";
import risk2 from "../Reports/risk2.png"
import risk3 from "../Reports/risk3.png";
import risk4 from "../Reports/risk4.png";
import risk5 from "../Reports/risk5.png";
import ScreenerResults from "./ScreenerResults";

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

const ClientReports = (props) => {
  // Notice the arrow function... regular function()  works too

  // Variables ===

  // Style variable declaration
  const classes = useStyles();

  // Declaration of Stateful Variables ===
  const { appState, ToggleDrawerClose, CheckAuthenticationValidity } = props;

  // console.log("PROPPPPPPPPPPPPPPS" , props);

  // Alert variable
  const [alert, setAlert] = useState(new AlertType());

  // // Hard-Coded Person item
  // // This is John Cena's
  // const [personId, setPersonId] = useState("60e879aac417375c838307b9");

  const [reportsData, setReportsData] = useState(null);
  // const [reports1Data, setReports1Data] = useState(null);
  const [patientData, setPatientData] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(
    localStorage.getItem("_id")
  );
  const [currentReportIndex, setCurrentReportIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [riskScore, setRiskScore] = useState(0);

  const [isDownloading, setIsDownloading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  // Functions ===

  const getPatients = useCallback(() => {
    if (appState.role == "Patient") {
      // console.log(reportsData);
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

  const getScreen = useCallback(
    (userId) => {
      get("reports/Screen/user/" + userId, appState.token, (err, res) => {
        if (err) {
          //Bad callback
          setAlert(
            new AlertType(
              "Unable to retrieve Social Screen Series Report. Please refresh and try again."
            )
          );
        } else {
          if (res.status === 200) {
            if (Object.keys(res.data).length === 0) {
              setReportsData(null);
            } else {
              setReportsData(res.data);
              // console.log(res.data);
            }
            setIsLoading(false);
          } else {
            //Bad HTTP Response
            setAlert(
              new AlertType(
                "Unable to retrieve Social Screen Series Report. Please refresh and try again.",
                // "error"
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

  const checkRisk = () => {

    if (reportsData) {
      let score = 0;
      if (reportsData['household2_size'] == 'Lives alone') {
        score = score + 1;
      }
      if (reportsData['community_activity_participate'] == 'No') {
        score = score + 1;
      }
      if (reportsData['life_satisfaction2'] <= 6) {
        score = score + 1;

      }
      if (reportsData['local_community_belonging'] == 'Somewhat weak' || reportsData['local_community_belonging'] == 'Very weak') {
        score = score + 1;
      }
      if ((reportsData['lack_companionship'] == 'Often' || reportsData['feel_isolated'] == 'Often' || reportsData['feel_leftout'] == 'Often') || (reportsData['lack_companionship'] == 'Sometimes' && reportsData['feel_isolated'] == 'Sometimes') || (reportsData['feel_leftout'] == 'Sometimes' && reportsData['feel_isolated'] == 'Sometimes') || (reportsData['lack_companionship'] == 'Sometimes' && reportsData['feel_leftout'] == 'Sometimes')) {
        score = score + 1;
      }
      setRiskScore(score);
    }
  }

  const getRiskText = () => {
    let riskText = ''
    switch (riskScore) {
      case 0:
        riskText = "Social health is vital to your overall well-being, as well as your physical and mental health. You're doing great - no risks are flagged currently. See recommendations to learn more about risk factors and the steps you can take to maintain good health."
        break;
      case 1:
        riskText = "Did you know that good social health is vital to your overall well-being, as well as your physical and mental health? At least one risk factor affecting your social health is currently flagged. See recommendations to learn more about your current risk, and the steps you can take now."
        break;
      case 2:
        riskText = "Did you know that good social health is vital to your overall well-being, as well as your physical and mental health? Some risk factors affecting your social health are currently flagged. See recommendations to learn more about your current risks, and the steps you can take now"
        break;
      case 3:
        riskText = "You are at risk of experiencing negative emotional and physical effects of poor social health –some risk factors are currently flagged. See recommendations to learn more about your current risks, and the steps you can take now to reduce future harm"
        break;
      case 4:
        riskText = "You are at high risk of experiencing negative emotional and physical effects of poor social health – several risk factors are currently flagged. See recommendations to learn more about your current risks, and the steps you can take now to reduce future harm."
        break;
      case 5:
        riskText = "You are at high risk of experiencing negative emotional and physical effects of poor social health – several risk factors are currently flagged. See recommendations to learn more about your current risks, and the steps you can take now to reduce future harm."
        break;
    }
    return riskText;
  }

  // generate report pdf and iniate download
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

  // Hooks ===

  // First Render only because of the [ ] empty array tracking with the useEffect
  useEffect(() => {
    ToggleDrawerClose();
    setTimeout(() => {
      CheckAuthenticationValidity((tokenValid) => {
        getPatients(currentPatient);
      });
    }, 200); //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentPatient != "") {
      // getNeighbours(currentPatient);
      getScreen(currentPatient);
      // console.log("RES",reportsData);
    }
  }, [currentPatient]);

  useEffect(() => {
    if (reportsData) {
      checkRisk();
      setLastUpdated(reportsData.collection_last_updated);
    }
  }, [reportsData]);



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
                        <Grid item xs={12}>
                          <Typography
                            style={{
                              fontSize: "16px",
                              color: "grey",
                            }}
                          >
                            Member's name:
                          </Typography>
                          <Typography variant="h5" component="h1" style={{
                            marginLeft: "2px",
                            marginTop: "3px",
                          }}>
                            {appState.name}
                          </Typography>
                          Last Modified: {lastUpdated}
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
                <Card raised={true} style={{ padding: '30px' }}>
                  <Box mx={1} my={1} boxShadow={0}>
                    {isLoading ? (<CircularProgress />)
                      : <Grid
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        spacing={1}
                        style={{ padding: '20px 30px 20px 30px' }}
                      >
                        {reportsData &&
                          Object.keys(reportsData).length != 0 &&
                          Object.getPrototypeOf(reportsData) === Object.prototype ? (
                          <>
                            <Grid item xs={12}>
                              <Typography variant="h4" color="textPrimary">
                                Social Risk Screener Report
                              </Typography>
                              <Divider light />
                            </Grid>

                            <Grid item xs={12} id="overall-risk" style={{ marginTop: '24px' }}>
                              <Typography
                                variant="h5"
                                color="textSecondary"
                                align="left"
                                gutterBottom
                              >
                                Your Social Isolation Risk
                              </Typography>
                              <Grid container spacing={2} style={{ alignItems: 'center' }}>
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                  <img
                                    src={riskScore == 0 ? risk1 : riskScore == 1 ? risk2 : riskScore == 2 ? risk3 : riskScore == 3 ? risk4 : risk5}
                                    alt="risk meter"
                                    width="360px"
                                    height="238px"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6} md={8} lg={9} style={{ paddingTop: '40px', paddingLeft: '40px' }}>
                                  <Typography variant="h5" color="textSecondary" gutterBottom style={{ fontWeight: "500", color: riskScore == 0 ? "#42b74a" : riskScore == 1 ? "#cfdf28" : riskScore == 2 ? "#ffbb10" : riskScore == 3 ? "#f76420" : "#cf2020" }}>
                                    {riskScore == 0 ? "Lowest Risk" : riskScore == 1 ? "Some Risk" : riskScore == 2 ? "Some Risk" : riskScore == 3 ? "Moderate Risk" : "High Risk"}
                                  </Typography>
                                  <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>
                                    {getRiskText()}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={12} id="results">
                              <Typography
                                variant="h5"
                                color="textSecondary"
                                align="left"
                                gutterBottom
                                style={{ paddingBottom: '12px' }}
                              >
                                Results
                              </Typography>

                              <ScreenerResults
                                reports={reportsData}
                                collection={currentReportIndex}
                              />
                            </Grid>


                            <Grid item xs={12} id="suggestions1" style={{ paddingTop: '30px' }}>
                              <Typography
                                variant="h5"
                                color="textSecondary"
                                align="left"
                                gutterBottom

                              >
                                What Now?
                              </Typography>
                              {/* <Suggestions
                              reports={reportsData}
                              collection={currentReportIndex}
                            /> */}
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
                      </Grid>}
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
            Person's Data Not Available
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

/*

                                    <Card raised={true}>
                                        <Box mx={1} my={1} boxShadow={0}>
                                            <Grid
                                                container
                                                direction="column"
                                                justifyContent="flex-start"
                                                alignItems="stretch"
                                                spacing={1}
                                            >
                                                <Grid item xs={12}>
                                                    <FormControl fullWidth variant="filled" size="small" className={classes.formControl}>
                                                        <InputLabel id="select-label-Member">Member</InputLabel>
                                                        <Select
        
                                                            className={classes.selectEmpty}
                                                            labelId="select-label-Member"
                                                            id="select-Member"
                                                            defaultValue = ""
                                                            disabled={patientData? false : true}
                                                            onChange={(event) => { patientSelectHandler(event); } }
                                                        >
                                                            {patientData.map( (item, index) => 
                                                            {
                                                                return(
                                                                    <MenuItem key={item._id} value={item._id}>
                                                                        <em>{item.info.name}</em>
                                                                    </MenuItem>  
                                                                )
                                                            })}
                                                        </Select>
                                                    </FormControl>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    {reportsData? (
                                                        <Pagination count={reportsData.SRVNum_PRF_SD.length} showFirstButton showLastButton
                                                            disabled={!reportsData}
                                                            onChange={(event, page) => { reportsPaginationHandler(event, page); }}
                                                        />
                                                    ) : (
                                                        <> </>
                                                    )}
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </Card>

*/