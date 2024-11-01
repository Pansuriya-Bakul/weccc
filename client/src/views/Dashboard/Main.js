//=============================================================
// MAIN DASHBOARD PAGE WHEN USER LOGS IN
//=============================================================

import React, { Component, useEffect, useState, useCallback } from "react";
import get from "../../helpers/common/get";
import { Link } from "react-router-dom";

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
import { CircularProgress } from "@material-ui/core";
import "./main.css";

const styles = (theme) => ({

});

const Maintemp = (props) => {
  const { classes, appState, ToggleDrawerClose, CheckAuthenticationValidity } = props;
  // Alert variable
  const [alert, setAlert] = useState(new AlertType());

  const [isLoading, setIsLoading] = useState(true);
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [facilityName, setFacilityName] = useState("");
  const [userCollections, setUserCollections] = useState([]);
  const [patientCollections, setPatientCollections] = useState([]);
  const [openBoxes, setOpenBoxes] = useState({});

  // Retrieve user's member collections
  const getMemberCollections = useCallback(async (userID) => {
    return new Promise((resolve, reject) => {
      get("membercollections/client/" + userID, appState.token, (err, res) => {
        if (err) {

          reject(new Error('Unable to retrieve Member Series. Please refresh and try again.'));
        } else {
          if (res.status === 200) {

            resolve(res.data.memberCollections);
          } else {

            reject(new Error('Bad HTTP Response'));
          }
        }
      });
    });
  }, [userCollections, appState.token]);

  const getPatientCollections = useCallback(async () => {
    if (appState && appState.patients.length > 0) {
      try {
        const collectionsPromises = appState.patients.map(patientID => getMemberCollections(patientID));
        const collections = await Promise.all(collectionsPromises);

        // Flatten the array of arrays into a single array
        const flattenedCollections = collections.reduce((acc, val) => acc.concat(val), []);
        // Update the state with the patient collections
        setPatientCollections(flattenedCollections);
      } catch (error) {
        console.error('Error fetching patient collections:', error);
      }
    }
  }, [appState, getMemberCollections, setPatientCollections]);

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

  // handles toggle of open/close collection boxes
  const toggleBox = (key) => {
    setOpenBoxes(prevState => ({
      ...prevState,
      [key]: !prevState[key]
    }));
  };


  useEffect(() => {
    const fetchData = async () => {
      // fetch quote of the day and update state
      let quoteResponse = await getQuote();
      setQuote({ text: quoteResponse["text"], author: quoteResponse["author"] });

      // fetch user's collections
      if (appState.role !== "Admin") {
        try {
          const userCollections = await getMemberCollections(appState._id);
          setUserCollections(userCollections);
        
        } catch (error) {
          console.error('Error fetching client collections:', error);
          setAlert(new AlertType(error.message, "error"));
        }
      }

      // fetch collections of assigned patients (clients) for Volunteer & Coordinator users
      if (appState.role !== 'Admin' && appState.role !== 'Patient') {
        try {
          // Call the getPatientCollections function
          await getPatientCollections();

        } catch (error) {
          console.error('Error fetching patient collections:', error);
          setAlert(new AlertType(error.message, "error"));
        }
      }

      // stop loading
      setIsLoading(false);

    };

    ToggleDrawerClose();
    fetchData();
  }, []);

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
                <br />

              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {appState.role !== "Admin" &&
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
                      ? <Typography variant="subtitle2" component="h2">
                        What would you like to do today?
                      </Typography>
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
