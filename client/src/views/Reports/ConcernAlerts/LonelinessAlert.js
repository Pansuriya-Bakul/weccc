import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';

export default class LonelinessAlert extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redAlert: false,
            yellowAlert: false,
        };
    }

    textBgRed = { backgroundColor: this.props.colors.red, padding: '10px', margin: '1px 0'   };
    textBgYellow = { backgroundColor: this.props.colors.yellow, padding: '10px', margin: '1px 0'   };

    componentDidMount() {
        const { reports, collection } = this.props;

        // Check conditions for Red Flag
        if (
            reports.PL_QofL1_COMB_often_count &&
            reports.PL_QofL1_COMB_often_count[collection] !== undefined &&
            reports.PL_QofL1_COMB_often_count[collection] > 0 &&
            reports.PL_QofL1_COMB_often_count[collection] !== 999
        ) {
            this.setState({ redAlert: true });
        }

        // Check conditions for Yellow Flag
        if (
            reports.PL_QofL1_COMB_often_count &&
            reports.PL_QofL1_COMB_often_count[collection] !== undefined &&
            reports.PL_QofL1_COMB_sometimes_count &&
            reports.PL_QofL1_COMB_sometimes_count[collection] !== undefined &&
            reports.PL_QofL1_COMB[collection] !== undefined &&
            reports.PL_QofL1_COMB_sometimes_count[collection] >= 2 &&
            reports.PL_QofL1_COMB_sometimes_count[collection] !== 999 &&
            reports.PL_QofL1_COMB[collection] !== 999
        ) {
            this.setState({ yellowAlert: true });
        }
    }

    render() {
        const { reports, collection } = this.props;
        const { redAlert, yellowAlert } = this.state;

        return (
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h5" color="inherit" align="left" gutterBottom>
                        Loneliness
                    </Typography>
                </Grid>

                {/* Red Flag */}
                <Grid item xs={6}>
                    <Typography variant="h6" color="inherit" align="left" gutterBottom>
                        Red Flags
                    </Typography>
                    {redAlert ? (
                        <Grid container spacing={2}>
                            {reports.PL_QofL1_COMB_often_count && reports.PL_QofL1_COMB_often_count[collection] > 0 && reports.PL_QofL1_COMB_often_count[collection] !== 999 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgRed}>
                                        <Typography variant="body1" color="inherit" align="left" gutterBottom>
                                            You often feel you lack companions, feel left out or feel isolated from others.
                                        </Typography>
                                    </Paper>
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <Alert severity="info">No Red Flags</Alert>
                    )}
                </Grid>

                {/* Yellow Flag */}
                <Grid item xs={6}>
                    <Typography variant="h6" color="inherit" align="left" gutterBottom>
                        Yellow Flags
                    </Typography>
                    {yellowAlert ? (
                        <Grid container spacing={2}>
                            {reports.PL_QofL1_COMB_sometimes_count && reports.PL_QofL1_COMB_sometimes_count[collection] > 0 && reports.PL_QofL1_COMB_sometimes_count[collection] !== 999 &&
                                reports.PL_QofL1_COMB && reports.PL_QofL1_COMB[collection] >= 1.6 && reports.PL_QofL1_COMB[collection] !== 999 && (
                                <Grid item xs={12}>
                                    <Paper style={this.textBgYellow}>
                                        <Typography variant="body1" color="inherit" align="left" gutterBottom>
                                            You sometimes feel you lack companions, feel left out, or feel isolated from others.
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
