import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Alert } from '@material-ui/lab';

export default class HealthAlert extends Component {
    state = {
        redAlert: false,
        yellowAlert: false,
    };

    textBgRed = { backgroundColor: this.props.colors.red, padding: '10px', margin: '1px 0' };
    textBgYellow = { backgroundColor: this.props.colors.yellow, padding: '10px', margin: '1px 0' };

    componentDidMount() {
        const { reports, collection } = this.props;

        if (
            (reports && reports.HT_QofL2_SD && reports.HT_QofL2_SD[collection] <= 50) ||
            (reports && reports.PH_QofL2_SD && reports.PH_QofL2_SD[collection] === 0) ||
            (reports && reports.MH_QofL2_SD && reports.MH_QofL2_SD[collection] === 0) ||
            (reports && reports.M_QofL2_SD && (reports.M_QofL2_SD[collection] === 0 || reports.M_QofL2_SD[collection] === 1)) ||
            (reports && reports.PC_QofL2_SD && (reports.PC_QofL2_SD[collection] === 0 || reports.PC_QofL2_SD[collection] === 1)) ||
            (reports && reports.UA_QofL2_SD && (reports.UA_QofL2_SD[collection] === 0 || reports.UA_QofL2_SD[collection] === 1)) ||
            (reports && reports.PD_QofL2_SD && (reports.PD_QofL2_SD[collection] === 0 || reports.PD_QofL2_SD[collection] === 1)) ||
            (reports && reports.AD_QofL2_SD && (reports.AD_QofL2_SD[collection] === 0 || reports.AD_QofL2_SD[collection] === 1))
        ) {
            this.setState({ redAlert: true });
        }

        if (
            (reports && reports.HT_QofL2_SD && reports.HT_QofL2_SD[collection] > 50 && reports.HT_QofL2_SD[collection] <= 65) ||
            (reports && reports.PH_QofL2_SD && reports.PH_QofL2_SD[collection] === 1) ||
            (reports && reports.MH_QofL2_SD && reports.MH_QofL2_SD[collection] === 1) ||
            (reports && reports.M_QofL2_SD && reports.M_QofL2_SD[collection] === 2) ||
            (reports && reports.PC_QofL2_SD && reports.PC_QofL2_SD[collection] === 2) ||
            (reports && reports.UA_QofL2_SD && reports.UA_QofL2_SD[collection] === 2) ||
            (reports && reports.PD_QofL2_SD && reports.PD_QofL2_SD[collection] === 2) ||
            (reports && reports.AD_QofL2_SD && reports.AD_QofL2_SD[collection] === 2) ||
            (reports && reports.HU_ED_QofL2_SD && reports.HU_ED_QofL2_SD[collection] > 0 && reports.HU_ED_QofL2_SD[collection] < 999) ||
            (reports && reports.HU_HNum_QofL2_SD && reports.HU_HNum_QofL2_SD[collection] > 0 && reports.HU_HNum_QofL2_SD[collection] < 999) ||
            (reports && reports.HU_EMS_QofL2_SD && reports.HU_EMS_QofL2_SD[collection] > 0 && reports.HU_EMS_QofL2_SD[collection] < 999) ||
            (reports && reports.HU_UC_QofL2_SD && reports.HU_UC_QofL2_SD[collection] > 0 && reports.HU_UC_QofL2_SD[collection] < 999) ||
            (reports && reports.access_to_family_doctor && reports.access_to_family_doctor[collection] === "No") ||
            (
                reports && reports.support_wellness_program && reports.support_wellness_program[collection] &&
                reports.problem_walking && reports.problem_walking[collection] > 1 && reports.problem_walking[collection] < 999 &&
                reports.problem_washing_dressing && reports.problem_washing_dressing[collection] > 1 && reports.problem_washing_dressing[collection] < 999 &&
                reports.problem_usual_activities && reports.problem_usual_activities[collection] > 1 && reports.problem_usual_activities[collection] < 999 &&
                reports.problem_pain_discomfort && reports.problem_pain_discomfort[collection] > 1 && reports.problem_pain_discomfort[collection] < 999 &&
                reports.problem_anxious_depressed && reports.problem_anxious_depressed[collection] > 1 && reports.problem_anxious_depressed[collection] < 999
            ) ||
            (
                reports && reports.support_informal && reports.support_informal[collection] &&
                reports.problem_walking && reports.problem_walking[collection] > 1 && reports.problem_walking[collection] < 999 &&
                reports.problem_washing_dressing && reports.problem_washing_dressing[collection] > 1 && reports.problem_washing_dressing[collection] < 999 &&
                reports.problem_usual_activities && reports.problem_usual_activities[collection] > 1 && reports.problem_usual_activities[collection] < 999 &&
                reports.problem_pain_discomfort && reports.problem_pain_discomfort[collection] > 1 && reports.problem_pain_discomfort[collection] < 999 &&
                reports.problem_anxious_depressed && reports.problem_anxious_depressed[collection] > 1 && reports.problem_anxious_depressed[collection] < 999
            )
        ) {
            this.setState({ yellowAlert: true });
        }
    }

    render() {
        const { reports, collection } = this.props;
        const { redAlert, yellowAlert } = this.state;

        return (
            <Grid container spacing={3} style={{ fontFamily: 'Roboto, sans-serif' }}>
                <Grid item xs={12}>
                    <Typography variant="h5" color="inherit" align="left" gutterBottom>
                        Health Alert
                    </Typography>
                </Grid>

                {/* Red flag row */}
                <Grid item xs={6}>
                    <Typography variant="h6" color="inherit" align="left" gutterBottom>
                        Red Flags
                    </Typography>
                    {redAlert ? (
                        <Grid container >
                            {reports && reports.HT_QofL2_SD && reports.HT_QofL2_SD[collection] <= 50 && (
                                <Grid item xs={6}>
                                    <Paper style={this.textBgRed}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            Your health today is a concern. On a scale of 0 to 100, you rate your health today as less than 50.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.PH_QofL2_SD && reports.PH_QofL2_SD[collection] === 0 && (
                                <Grid>
                                    <Paper style={this.textBgRed}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You rate your health as poor.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.MH_QofL2_SD && reports.MH_QofL2_SD[collection] === 0 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgRed} >
                                        <Typography variant="body1" color="inherit" align="left">
                                            You rate your mental health as poor.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.M_QofL2_SD && (reports.M_QofL2_SD[collection] === 0 || reports.M_QofL2_SD[collection] === 1) && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgRed}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have severe problems walking around.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.PC_QofL2_SD && (reports.PC_QofL2_SD[collection] === 0 || reports.PC_QofL2_SD[collection] === 1) && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgRed}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have severe problems washing or dressing.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.UA_QofL2_SD && (reports.UA_QofL2_SD[collection] === 0 || reports.UA_QofL2_SD[collection] === 1) && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgRed}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have severe problems doing usual activities.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.PD_QofL2_SD && (reports.PD_QofL2_SD[collection] === 0 || reports.PD_QofL2_SD[collection] === 1) && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgRed}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have severe problems with pain/discomfort.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.AD_QofL2_SD && (reports.AD_QofL2_SD[collection] === 0 || reports.AD_QofL2_SD[collection] === 1) && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgRed} elevation={3}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have severe problems with anxiety/depression.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <Alert severity="info">No Red Flags</Alert>
                    )}
                </Grid>

                {/* Yellow flag row */}
                <Grid item xs={6}>
                    <Typography variant="h6" color="inherit" align="left" gutterBottom>
                        Yellow Flags
                    </Typography>
                    {yellowAlert ? (
                        <Grid container>
                            {reports && reports.HT_QofL2_SD && reports.HT_QofL2_SD[collection] > 50 && reports.HT_QofL2_SD[collection] <= 65 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            Your health today is a concern. On a scale of 0 to 100, you rate your health today as between 50 and 65.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.PH_QofL2_SD && reports.PH_QofL2_SD[collection] === 1 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You rate your health as fair.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.MH_QofL2_SD && reports.MH_QofL2_SD[collection] === 1 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You rate your mental health as fair.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.M_QofL2_SD && reports.M_QofL2_SD[collection] === 2 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have moderate problems walking around.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.PC_QofL2_SD && reports.PC_QofL2_SD[collection] === 2 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have moderate problems washing or dressing.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.UA_QofL2_SD && reports.UA_QofL2_SD[collection] === 2 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have moderate problems doing usual activities.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.PD_QofL2_SD && reports.PD_QofL2_SD[collection] === 2 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have moderate problems with pain/discomfort.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.AD_QofL2_SD && reports.AD_QofL2_SD[collection] === 2 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have moderate problems with anxiety/depression.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.HU_ED_QofL2_SD && reports.HU_ED_QofL2_SD[collection] > 0 && reports.HU_ED_QofL2_SD[collection] < 999 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have visited the Emergency Department in the last year.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.HU_HNum_QofL2_SD && reports.HU_HNum_QofL2_SD[collection] > 0 && reports.HU_HNum_QofL2_SD[collection] < 999 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have been hospitalized in the last year.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.HU_EMS_QofL2_SD && reports.HU_EMS_QofL2_SD[collection] > 0 && reports.HU_EMS_QofL2_SD[collection] < 999 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have used ambulance services in the last year.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.HU_UC_QofL2_SD && reports.HU_UC_QofL2_SD[collection] > 0 && reports.HU_UC_QofL2_SD[collection] < 999 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You have visited urgent care in the last year.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.access_to_family_doctor && reports.access_to_family_doctor[collection] === "No" && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left">
                                            You do not have access to a family doctor.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                            {reports && reports.support_wellness_program && reports.problem_walking && reports.problem_walking[collection] > 1 && reports.problem_walking[collection] < 999 &&
                                reports.problem_washing_dressing && reports.problem_washing_dressing[collection] > 1 && reports.problem_washing_dressing[collection] < 999 &&
                                reports.problem_usual_activities && reports.problem_usual_activities[collection] > 1 && reports.problem_usual_activities[collection] < 999 &&
                                reports.problem_pain_discomfort && reports.problem_pain_discomfort[collection] > 1 && reports.problem_pain_discomfort[collection] < 999 &&
                                reports.problem_anxious_depressed && reports.problem_anxious_depressed[collection] > 1 && reports.problem_anxious_depressed[collection] < 999 && (
                                    <Grid item xs={12}>
                                        <Paper style={this.textBgYellow}>
                                            <Typography variant="body1" color="inherit" align="left">
                                                You need support for multiple moderate problems.
                                            </Typography>
                                        </Paper>
                                    </Grid>
                            )}
                            {reports && reports.support_informal && reports.problem_walking && reports.problem_walking[collection] > 1 && reports.problem_walking[collection] < 999 &&
                                reports.problem_washing_dressing && reports.problem_washing_dressing[collection] > 1 && reports.problem_washing_dressing[collection] < 999 &&
                                reports.problem_usual_activities && reports.problem_usual_activities[collection] > 1 && reports.problem_usual_activities[collection] < 999 &&
                                reports.problem_pain_discomfort && reports.problem_pain_discomfort[collection] > 1 && reports.problem_pain_discomfort[collection] < 999 &&
                                reports.problem_anxious_depressed && reports.problem_anxious_depressed[collection] > 1 && reports.problem_anxious_depressed[collection] < 999 && (
                                    <Grid item xs={12}>
                                        <Paper style={this.textBgYellow}>
                                            <Typography variant="body1" color="inherit" align="left">
                                                You need support for multiple moderate problems.
                                            </Typography>
                                        </Paper>
                                    </Grid>
                            )}
                        </Grid>
                    ) : (
                        <Alert severity="info">No Yellow Flags</Alert>
                    )}
                </Grid>
            </Grid>
        );
    }
}
