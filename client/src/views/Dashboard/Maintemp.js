//=============================================================
// MAIN DASHBOARD PAGE WHEN USER LOGS IN
//=============================================================

import React, { Component, useEffect, useState, useCallback } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import get from "../../helpers/common/get";
import post from "../../helpers/common/post";
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
                console.log(flattenedCollections);
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


    useEffect(() => {
        const fetchData = async () => {
            console.log(appState);

            // fetch user's collections
            if (appState.role !== "Admin") {
                try {
                    const userCollections = await getMemberCollections(appState._id);
                    setUserCollections(userCollections);
                    console.log(userCollections);
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

            // fetch quote of the day and update state
            let quoteResponse = await getQuote();
            setQuote({ text: quoteResponse["text"], author: quoteResponse["author"] });

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
                                                            <div key={index}>
                                                                <Box
                                                                    mt={1.5}
                                                                    p={1.5}
                                                                    className="box-container"
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
                                                            </div>
                                                            
                                                        ))
                                                    }
                                                    {patientCollections.length > 0 &&
                                                        patientCollections.map((collection, index) => (
                                                             collection.completeness < 100 &&
                                                            <div key={index}>
                                                                <Box
                                                                    mt={1.5}
                                                                    p={1.5}
                                                                    className="box-container"
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
                                                            </div>
                                                            
                                                        ))
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

        </Grid>
    );
}

export default withStyles(styles)(Maintemp);
