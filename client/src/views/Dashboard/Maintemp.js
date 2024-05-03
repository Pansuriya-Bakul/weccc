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
            get("membercollections/client/"+ userID, appState.token, (err, res) => {
                if (err) {
                    // Reject the promise with the error
                    reject(new Error('Unable to retrieve Member Series. Please refresh and try again.'));
                } else {
                    if (res.status === 200){
                        // Resolve the promise with the data
                        resolve(res.data.memberCollections);
                    } else {
                        // Reject the promise with an error message
                        reject(new Error('Bad HTTP Response'));
                    }
                }
            });
        });
    }, [userCollections, appState.token]);

    const getPatients = useCallback( async () => {
        
    }, [appState.token]);
    

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

            }

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

        </Grid>
    );
}

export default withStyles(styles)(Maintemp);
