// ================================================
// Public Screener Report
// ================================================
import React, { useState, useEffect } from "react";

// ==================== Components ==================
import AlertMessage from "../../components/AlertMessage";


// ==================== Helpers =====================
import AlertType from "../../helpers/models/AlertType";

// ==================== MUI =========================
import { makeStyles } from "@material-ui/core/styles"; // withStyles can be used for classes and functional componenents but makeStyle is designed for new React with hooks

import Grid from "@material-ui/core/Grid"; // Normal Markup with MUI is layout -> Container -> Grid -> Paper etc...
import Box from "@material-ui/core/Box"; // Padding and margins
import Divider from "@material-ui/core/Divider";
import { CircularProgress } from '@material-ui/core';
import Typography from "@material-ui/core/Typography"; //h1, p replacement Tag


import risk1 from "../Reports/risk1.png";
import risk2 from "../Reports/risk2.png"
import risk3 from "../Reports/risk3.png";
import risk4 from "../Reports/risk4.png";
import risk5 from "../Reports/risk5.png";
import PublicScreenerResults from "./PublicScreenerResults";

// ==================== MUI Styles ===================

const useStyles = makeStyles(
    (
        theme //Notice the hook useStyles
    ) => ({
        root: {
            // marginTop: "rem",
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

const PublicScreenerReport = (props) => {

    // Variables ===

    // Style variable declaration
    const classes = useStyles();

    // Alert variable
    const [alert, setAlert] = useState(new AlertType());

    // // Hard-Coded Person item
    // // This is John Cena's
    // const [personId, setPersonId] = useState("60e879aac417375c838307b9");

    const reportsData = props.reportsData;;
    const [isLoading, setIsLoading] = useState(true);
    const [riskScore, setRiskScore] = useState(0);

    // Functions ===


    const checkRisk = () => {

        if (reportsData) {
            let score = 0;
            if (reportsData['household2_size'] == '0') {
                score = score + 1;
            }
            if (reportsData['community_activity_participate'] == '0') {
                score = score + 1;
            }
            if (reportsData['life_satisfaction2'] <= 6) {
                score = score + 1;

            }
            if (reportsData['local_community_belonging'] == '1' || reportsData['local_community_belonging'] == '0') {
                score = score + 1;
            }
            if ((reportsData['lack_companionship'] == '2' || reportsData['feel_isolated'] == '2' || reportsData['feel_leftout'] == '2') || (reportsData['lack_companionship'] == '1' && reportsData['feel_isolated'] == '1') || (reportsData['feel_leftout'] == '1' && reportsData['feel_isolated'] == '1') || (reportsData['lack_companionship'] == '1' && reportsData['feel_leftout'] == '1')) {
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

    // Hooks ===


    useEffect(() => {
        if (reportsData) {
            checkRisk();
            setIsLoading(false);
        }
    }, [reportsData]);


    // Render Section ===

    return alert != null ? (
        <div className={classes.root} >
            <Grid
                container
                className={classes.rootGrid}
                // direction="row"
                // justifyContent="flex-start"
                // alignItems="stretch"
                spacing={1}
            >

                <Grid item xs={4}>
                    <Box mx={1} my={1}>
                        <AlertMessage alert={alert} setParentAlert={setAlert} />

                    </Box>
                </Grid>

                <Grid item xs={12}>
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
                                                <Grid container spacing={2} style={{alignItems:'center'}}>
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

                                            <Grid item xs={12} id="summary1">
                                                <Typography
                                                    variant="h5"
                                                    color="textSecondary"
                                                    align="left"
                                                    gutterBottom
                                                    style={{ paddingBottom: '12px', paddingTop: '12px' }}
                                                >
                                                    Results
                                                </Typography>

                                                <PublicScreenerResults
                                                    reports={reportsData}
                                                // collection={currentReportIndex}
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
                </Grid>


            </Grid>
        </div>
    ) : (
        <Typography variant="h6" color="inherit" align="center" gutterBottom>
            Not Authorized. Please refresh and try again.
        </Typography>
    );
};


export default PublicScreenerReport; 
