import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';

export default class SupportAvailabilityAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redAlert: false,
            yellowAlert: false,
        };
    }

    textBgRed = { backgroundColor: this.props.colors.red, padding: '10px', margin: '1px 0'  };
    textBgYellow = { backgroundColor: this.props.colors.yellow, padding: '10px', margin: '1px 0'  };

    componentDidMount() {
        const { reports, collection } = this.props;

        if (reports.PSS_QofL1_COMB && reports.PSS_QofL1_COMB[collection] !== undefined) {
            // Check conditions for Red Flags
            if (
                reports.PSS_QofL1_COMB[collection] >= 2.5 &&
                reports.PSS_QofL1_COMB[collection] <= 3
            ) {
                this.setState({ redAlert: true });
            }

            // Check conditions for Yellow Flags
            if (
                reports.PSS_QofL1_COMB[collection] >= 1.6 &&
                reports.PSS_QofL1_COMB[collection] <= 2.4
            ) {
                this.setState({ yellowAlert: true });
            }
        }
    }

    render() {
        const { reports, collection } = this.props;
        const { redAlert, yellowAlert } = this.state;

        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h5" color="inherit" align="left" gutterBottom>
                        Availability of Support
                    </Typography>
                </Grid>

                {/* Red Flags */}
                <Grid item xs={6}>
                    <Typography variant="h6" color="inherit" align="left" gutterBottom>
                        Red Flags
                    </Typography>
                    {redAlert ? (
                        <Grid container>
                            {reports && reports.PSS_QofL1_COMB && reports.PSS_QofL1_COMB[collection] >= 2.5 && reports.PSS_QofL1_COMB[collection] <= 3 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgRed}>
                                        <Typography variant="body1" color="inherit" align="left" gutterBottom>
                                            You hardly ever feel you have the social support you need from your family and friends.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <Alert severity="info">No Red Flags</Alert>
                    )}
                </Grid>

                {/* Yellow Flags */}
                <Grid item xs={6}>
                    <Typography variant="h6" color="inherit" align="left" gutterBottom>
                        Yellow Flags
                    </Typography>
                    {yellowAlert ? (
                        <Grid container>
                            {reports && reports.PSS_QofL1_COMB && reports.PSS_QofL1_COMB[collection] >= 1.6 && reports.PSS_QofL1_COMB[collection] <= 2.4 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left" gutterBottom>
                                            You only sometimes feel you have the social support you need from your family and friends.
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
