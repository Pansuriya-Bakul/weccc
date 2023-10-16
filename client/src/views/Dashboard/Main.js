import React, { Component, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import get from "../../helpers/common/get";
import post from "../../helpers/common/post";
import { Link } from "react-router-dom";
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
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
});

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      render: false,
      isLoading: true,
      clientData: [],
      clientSurvey: "",
      quote: "",
      author: "",
      toggle: {},
      pToggle: {},
      collectionCompleteness: [],
      patientCollectionCompleteness: [],
      patientsList: [],
      pMapping: {},
      facilityName: "",
    };
  }

  checkAuth = () => {
    // setTimeout(() => {
    this.props.ToggleDrawerClose();
    // this.setState({
    // 	render: true
    // });
    this.props.CheckAuthenticationValidity((tokenValid) => {
      if (tokenValid) {
        this.setState({
          render: true,
        });
      }
    });
    // }, 200);
  };

  setToggle = (key) => {
    const temp = this.state.toggle;
    temp[key] = !temp[key];
    this.setState({
      toggle: temp,
    });
  };

  setPToggle = (pkey, key) => {
    const temp = this.state.pToggle;
    // temp[key] = !(temp[key])
    temp[`${pkey}-${key}`] = !temp[`${pkey}-${key}`];
    this.setState({
      pToggle: temp,
    });
  };

  // getPatients = async () => {
  // 	let { appState } = this.props;

  // 	if (appState.role == "Patient") {
  // 	  // setAlert(
  // 	  //   new AlertType("You do not have Permission to recieve Patients", "error")
  // 	  // );
  // 	  return;
  // 	} else {
  // 	  if (appState.patients.length <= 0) {
  // 		// setAlert(
  // 		//   new AlertType(
  // 		// 	"You do not have any patients assigned. In order to start a collection, you must first be assigned a member by an Administrator.",
  // 		// 	"error"
  // 		//   )
  // 		// );
  // 		return;
  // 	  }

  // 	//   let http_query = {
  // 	// 	_id: {
  // 	// 	  $in: appState.patients,
  // 	// 	},
  // 	//   };
  // 	get("users/" + appState._id, appState.token, (err, res) =>
  //                 {
  //                     if(err)
  //                     {
  //                         //Bad callback call
  //                         //setAlert(new AlertType(err.message, "error"));
  //                         // setAlert(new AlertType('Unable to retrieve Users. Please refresh and try again.', "error"));
  //                     }
  //                     else
  //                     {
  //                         if(res.status === 200)
  //                         {
  //                             // this.setState({patientsList: res.data.user.patients});
  // 							console.log(res.data.user.patients);
  // 							return res.data.user.patients
  //                         }
  //                         else
  //                         {
  //                             //Bad HTTP Response
  //                             // setAlert(new AlertType('Unable to retrieve Users. Please refresh and try again.', "error"));
  //                         }
  //                     }

  //                 });

  // 	//   post("users/query", appState.token, http_query, (err, res) => {
  // 	// 	if (err) {
  // 	// 	  //Bad callback
  // 	// 	//   setAlert(
  // 	// 	// 	new AlertType(
  // 	// 	// 	  "Unable to retrieve Patients. Please refresh and try again.",
  // 	// 	// 	  "error"
  // 	// 	// 	)
  // 	// 	//   );
  // 	// 	} else {
  // 	// 	  if (res.status === 200) {
  // 	// 		this.setState({patientsList : res.data.users});
  // 	// 		console.log(res.data.users);
  // 	// 	  } else {
  // 	// 		//Bad HTTP Response
  // 	// 		// setAlert(
  // 	// 		//   new AlertType(
  // 	// 		// 	"Unable to retrieve Patients. Please refresh and try again.",
  // 	// 		// 	"error"
  // 	// 		//   )
  // 	// 		// );
  // 	// 	  }
  // 	// 	}
  // 	//   });
  // 	}
  // };

  getPatients = async () => {
    let { appState } = this.props;

    if (appState.patients.length <= 0) {
      // setAlert(
      //   new AlertType(
      //     "You do not have any patients assigned. In order to start a collection, you must first be assigned a member by an Administrator.",
      //     "error"
      //   )
      // );
      return;
    }

    return new Promise((resolve, reject) => {
      get("users/" + appState._id, appState.token, (err, res) => {
        if (err) {
          //Bad callback call
          //setAlert(new AlertType(err.message, "error"));
          // setAlert(new AlertType('Unable to retrieve Users. Please refresh and try again.', "error"));
          reject(err);
        } else {
          if (res.status === 200) {
            // this.setState({patientsList: res.data.user.patients});
            //   console.log(res.data.user.patients);
            resolve(res.data.user.patients);
          } else {
            //Bad HTTP Response
            // setAlert(new AlertType('Unable to retrieve Users. Please refresh and try again.', "error"));
            reject(
              new Error(
                "Unable to retrieve Users. Please refresh and try again."
              )
            );
          }
        }
      });
    });
  };

  checkClientSurveys = (callback) => {
    let { appState } = this.props;
    let url = `users/client/${appState._id}`;

    const token = appState.token;
    get(url, token, (error, response) => {
      if (error) return;

      if (response.status === 200) {
        // this.setState({ clientData: response.data });
        // this.setState({ clientSurvey: response.data.surveys });
        // this.setState({ clientCompletedSurvey: response.data.completedSurveys });
        // this.setState({ clientNotCompletedSurvey: response.data.notCompletedSurveys });
        this.setState({ facilityName: response.data.facilityName });
        this.setState({ collectionNames: response.data.collectionNames });
        this.setState({ collections: response.data.collections });
        if (
          this.state.collectionNames != undefined &&
          this.state.collections != undefined
        ) {
          const toggle = {};
          this.state.collectionNames.map((key) => {
            toggle[key] = false;
          });
          this.setState({ toggle: toggle });
        }
        this.setState({ isLoading: false });
        callback();
      }
    }); // call the get request.
  };

  getPatientSurveys = async (patientId) => {
    let { appState } = this.props;
    let url = "users/client/" + patientId;
    const token = appState.token;

    try {
      // define the Promise outside of the get callback function
      const promise = new Promise((resolve, reject) => {
        // define the resolve and reject functions here
        const handleResponse = (error, response) => {
          if (error) {
            reject(error);
          } else {
            // update the state with the survey data
            this.setState(
              {
                patientCollectionNames: response.data.collectionNames,
                patientCollections: response.data.collections,
              },
              () => {
                // the state has been updated, now resolve the Promise with the response
                resolve(response);
              }
            );
          }
        };

        // make the get request with the callback function
        get(url, token, handleResponse);
      });

      // return the Promise
      return promise;
    } catch (error) {
      console.log(error);
    }
  };

  getQuote = () => {
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

  // First Render only because of the [ ] empty array tracking with the useEffect

  checkComplete = () => {
    if (
      this.state.collectionNames !== "" &&
      this.state.collectionNames !== undefined
    ) {
      this.state.collectionNames.map((key, index) => {
        let temp = true;
        if (
          this.state.collections !== "" &&
          this.state.collections !== undefined
        ) {
          this.state.collections[index].map((value) => {
            if (value[1] != 100) {
              temp = false;
            }
          });
          let tempArr = this.state.collectionCompleteness;
          this.setState({ collectionCompleteness: [...tempArr, temp] });
        }
      });
    }
  };

  patientCheckComplete = () => {
    return new Promise((resolve) => {
      if (
        this.state.patientCollectionNames !== "" &&
        this.state.patientCollectionNames !== undefined
      ) {
        this.state.patientCollectionNames.map((key, index) => {
          let temp = true;
          if (
            this.state.patientCollections !== "" &&
            this.state.patientCollections !== undefined
          ) {
            this.state.patientCollections[index].map((value) => {
              if (value[1] != 100) {
                temp = false;
              }
            });
            let tempArr = this.state.patientCollectionCompleteness;
            this.setState({
              patientCollectionCompleteness: [...tempArr, temp],
            });
          }
        });
      }
      resolve();
    });
  };

  createMapping = async () => {
    let { appState } = this.props;
    if (appState.role == "Patient") {
      return;
    }
    const templist = await this.getPatients();
    if (templist == undefined) {
      return;
    }
    this.setState({ patientsList: templist });
    const temp = this.state.pMapping;

    for (let user of this.state.patientsList) {
      await this.getPatientSurveys(user._id);
      await this.patientCheckComplete();
      temp[user._id] = [
        this.state.patientCollectionNames,
        this.state.patientCollections,
        this.state.patientCollectionCompleteness,
      ];
      this.setState({ patientCollectionCompleteness: [] });
    }

    this.setState({ pMapping: temp });
    console.log(temp);
  };

  componentDidMount = async () => {
    let { appState } = this.props;
    this.classes = styles();
    this.bull = <span className={this.classes.bullet}>•</span>;

    if (appState.role === "Patient" || appState.role === "Volunteer") {
      await this.createMapping();
      this.checkClientSurveys(() => {
        this.checkComplete();
      });
    }

    this.checkAuth();

    this.getQuote().then((response) => {
      this.setState({ quote: response["text"] });
      this.setState({ author: response["author"] });
    });
  };

  render() {
    let { appState, classes } = this.props;
    console.log(this.state);
    if (this.render) {
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
              {/* <AlertMessage alert={alert} setParentAlert={setAlert} /> */}
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
                    {/* {(this.state.clientCompletedSurvey !== undefined && this.state.clientCompletedSurvey !== []) ?
											(<Typography variant="subtitle2" component="h2">Completed Collection(s)</Typography>) : ''}
										<br />
										<Grid item xs={12}>
											{(this.state.clientCompletedSurvey !== undefined) ?
												Object.keys(this.state.clientCompletedSurvey).map(key => {
													return (
														<Grid item xs={12} style={{ border: "1px solid grey" }}>
															<Box m={2} justifyContent="center" alignItems="center">
																<Typography variant="body2" component="h2">
																	{this.state.clientCompletedSurvey[key]}
																</Typography>
															</Box>
														</Grid>
													);
												}) : ''}

										</Grid> */}
                    {/* {(this.state.collectionNames !== undefined && this.state.collectionNames !== []) ?
											(<Typography variant="subtitle2" component="h2">Completed Collection(s)</Typography>) : ''}
										<br />
										{(this.state.collectionNames !== [] && this.state.collectionNames !== undefined) ? (
											(this.state.collectionNames).map((key, index) => {
												return (
													<>
														{this.state.collectionCompleteness[index] && <Grid item xs={12} style={{ border: "1px solid grey" }}>
															<Box m={2} justifyContent="center" alignItems="center">
																<Typography variant="body2" component="h2">
																	{key}
																</Typography>
															</Box>
														</Grid>}
													</>
												);
											})
										) : ('')
										} */}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          {(appState.role === "Patient" || appState.role === "Volunteer") && (
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
                        {appState.role === "Patient" && (
                          <Typography variant="subtitle2" component="h2">
                            What would you like to do today?
                          </Typography>
                        )}
                        {appState.role === "appState" && (
                          <Typography variant="subtitle2" component="h2">
                            Current Assigned Tasks
                          </Typography>
                        )}
                      </Grid>
                      {this.state.isLoading ? (
                        <CircularProgress />
                      ) : (
                        <Grid item xs={12}>
                          <Grid item xs={12}>
                            <Typography variant="body2" component="h2">
                              {/* {this.state.clientData.message ? (
															<p>{this.state.clientData.message}</p>
														) : ('')} */}
                              {appState.role == "Volunteer" &&
                                (JSON.stringify(this.state.pMapping) !== "{}"
                                  ? (console.log(this.state.pMapping),
                                    Object.keys(this.state.pMapping).map(
                                      (pkey, pindex) =>
                                        this.state.pMapping[pkey][0] &&
                                        this.state.pMapping[pkey][1]
                                          ? this.state.pMapping[pkey][0].map(
                                              (key, index) => {
                                                return (
                                                  <>
                                                    {this.state.pMapping[
                                                      pkey
                                                    ][2][index] == false && (
                                                      <Grid item xs={12}>
                                                        <div>
                                                          <Box
                                                            mt={1.5}
                                                            p={1.5}
                                                            className="box-container"
                                                            onClick={() =>
                                                              this.setPToggle(
                                                                pkey,
                                                                key
                                                              )
                                                            }
                                                          >
                                                            <div
                                                              size="small"
                                                              variant="contained"
                                                              color="primary"
                                                              // startIcon={<EditIcon />}
                                                              component={Link}
                                                              to={`/administration/booklets/user/view`}
                                                            >
                                                              <h3>
                                                                {key} -{" "}
                                                                {
                                                                  this.state
                                                                    .patientsList[
                                                                    pindex
                                                                  ].info.name
                                                                }
                                                              </h3>
                                                            </div>
                                                          </Box>
                                                          {this.state.pToggle[
                                                            `${pkey}-${key}`
                                                          ] && (
                                                            <Box
                                                              m={0}
                                                              p={1.5}
                                                              className="bottom-container"
                                                            >
                                                              <div className="survey-div">
                                                                {this.state
                                                                  .pMapping[
                                                                  pkey
                                                                ][1] !== [] &&
                                                                this.state
                                                                  .pMapping[
                                                                  pkey
                                                                ][1] !==
                                                                  undefined
                                                                  ? this.state.pMapping[
                                                                      pkey
                                                                    ][1][
                                                                      index
                                                                    ].map(
                                                                      (
                                                                        value
                                                                      ) => {
                                                                        return (
                                                                          <>
                                                                            <Grid
                                                                              item
                                                                              xs={
                                                                                12
                                                                              }
                                                                            >
                                                                              <Tooltip
                                                                                placement="bottom"
                                                                                title="Edit Module"
                                                                              >
                                                                                <Box
                                                                                  m={
                                                                                    1
                                                                                  }
                                                                                  pt={
                                                                                    1
                                                                                  }
                                                                                  className="survey-box"
                                                                                >
                                                                                  <Button
                                                                                    className="survey-name"
                                                                                    size="small"
                                                                                    variant="contained"
                                                                                    color="primary"
                                                                                    startIcon={
                                                                                      <EditIcon />
                                                                                    }
                                                                                    component={
                                                                                      Link
                                                                                    }
                                                                                    to={`/administration/booklets/user/view/${value[0]}`}
                                                                                  >
                                                                                    {
                                                                                      value[2]
                                                                                    }
                                                                                  </Button>
                                                                                  {value[1] ==
                                                                                    0 && (
                                                                                    <div className="status-div not-started">
                                                                                      <span>
                                                                                        Not
                                                                                        Started
                                                                                      </span>
                                                                                    </div>
                                                                                  )}
                                                                                  {value[1] >
                                                                                    0 &&
                                                                                    value[1] <
                                                                                      100 && (
                                                                                      <div className="status-div in-progress">
                                                                                        <span>
                                                                                          In
                                                                                          Progress
                                                                                        </span>
                                                                                      </div>
                                                                                    )}
                                                                                  {value[1] ==
                                                                                    100 && (
                                                                                    <div className="status-div completed">
                                                                                      <span>
                                                                                        Completed
                                                                                      </span>
                                                                                    </div>
                                                                                  )}
                                                                                </Box>
                                                                              </Tooltip>
                                                                            </Grid>
                                                                          </>
                                                                        );
                                                                      }
                                                                    )
                                                                  : "No series assigned"}
                                                              </div>
                                                            </Box>
                                                          )}
                                                        </div>
                                                      </Grid>
                                                    )}
                                                  </>
                                                );
                                              }
                                            )
                                          : "No series assigned"
                                    ))
                                  : "No series assigned")}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2" component="h2">
                              {!this.state.collectionCompleteness.every(
                                (v) => v == true
                              ) &&
                              this.state.collectionNames !== [] &&
                              this.state.collectionNames !== undefined
                                ? this.state.collectionNames.map(
                                    (key, index) => {
                                      return (
                                        <>
                                          {this.state.collectionCompleteness[
                                            index
                                          ] == false && (
                                            <Grid item xs={12}>
                                              {/* <Tooltip
																				placement="bottom"
																				title="Edit Collection"
																			> */}
                                              <div>
                                                <Box
                                                  mt={1.5}
                                                  p={1.5}
                                                  className="box-container"
                                                  onClick={() =>
                                                    this.setToggle(key)
                                                  }
                                                >
                                                  <div
                                                    size="small"
                                                    variant="contained"
                                                    color="primary"
                                                    // startIcon={<EditIcon />}
                                                    component={Link}
                                                    to={`/administration/booklets/user/view`}
                                                  >
                                                    {appState.role ==
                                                    "Volunteer" ? (
                                                      <h3>{key} - Self Care</h3>
                                                    ) : (
                                                      <h3>{key}</h3>
                                                    )}
                                                  </div>
                                                </Box>
                                                {this.state.toggle[key] && (
                                                  <Box
                                                    m={0}
                                                    p={1.5}
                                                    className="bottom-container"
                                                  >
                                                    <div className="survey-div">
                                                      {this.state
                                                        .collections !== "" &&
                                                      this.state.collections !==
                                                        undefined
                                                        ? this.state.collections[
                                                            index
                                                          ].map((value) => {
                                                            return (
                                                              <>
                                                                <Grid
                                                                  item
                                                                  xs={12}
                                                                >
                                                                  <Tooltip
                                                                    placement="bottom"
                                                                    title="Edit Module"
                                                                  >
                                                                    <Box
                                                                      m={1}
                                                                      pt={1}
                                                                      className="survey-box"
                                                                    >
                                                                      <Button
                                                                        className="survey-name"
                                                                        size="small"
                                                                        variant="contained"
                                                                        color="primary"
                                                                        startIcon={
                                                                          <EditIcon />
                                                                        }
                                                                        component={
                                                                          Link
                                                                        }
                                                                        to={`/administration/booklets/user/view/${value[0]}`}
                                                                      >
                                                                        {
                                                                          value[2]
                                                                        }
                                                                      </Button>
                                                                      {value[1] ==
                                                                        0 && (
                                                                        <div className="status-div not-started">
                                                                          <span>
                                                                            Not
                                                                            Started
                                                                          </span>
                                                                        </div>
                                                                      )}
                                                                      {value[1] >
                                                                        0 &&
                                                                        value[1] <
                                                                          100 && (
                                                                          <div className="status-div in-progress">
                                                                            <span>
                                                                              In
                                                                              Progress
                                                                            </span>
                                                                          </div>
                                                                        )}
                                                                      {value[1] ==
                                                                        100 && (
                                                                        <div className="status-div completed">
                                                                          <span>
                                                                            Completed
                                                                          </span>
                                                                        </div>
                                                                      )}
                                                                    </Box>
                                                                  </Tooltip>
                                                                </Grid>
                                                              </>
                                                            );
                                                          })
                                                        : "No Series assigned"}
                                                    </div>
                                                  </Box>
                                                )}
                                              </div>
                                              {/* </Tooltip> */}
                                            </Grid>
                                          )}
                                        </>
                                      );
                                    }
                                  )
                                : "No series assigned"}
                            </Typography>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )}
          <Grid
            item
            xs={12}
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="stretch"
            spacing={4}
          >
            <Grid item xs={4}>
              <Card variant="outlined" style={{ backgroundColor: "aliceblue" }}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    Thought{this.bull}for{this.bull}the{this.bull}Day
                  </Typography>
                  <br />
                  <Typography variant="body2" component="p">
                    {this.state.quote}
                  </Typography>
                  <br />
                  <Typography className={classes.pos} color="textSecondary">
                    {this.state.author}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return <CircularProgress />;
    }
  }
}

export default withStyles(styles)(Main);
