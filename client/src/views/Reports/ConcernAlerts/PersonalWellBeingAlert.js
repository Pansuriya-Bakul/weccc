import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { ListItem, Paper } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert'; 

export default class PersonalWellBeingAlert extends Component {
  state = {
    redAlert: false,
    yellowAlert: false
  };

  textBgRed = { backgroundColor: this.props.colors.red, padding: '10px', margin: '5px 0' };
  textBgYellow = { backgroundColor: this.props.colors.yellow, padding: '10px', margin: '5px 0' };

  componentDidMount() {
    const { reports, collection } = this.props;

    if (
      (reports.LS_QofL3_SD && reports.LS_QofL3_SD[collection] <= 5) ||
      (reports.SL_QofL3_SD && reports.SL_QofL3_SD[collection] <= 5) ||
      (reports.YH_QofL3_SD && reports.YH_QofL3_SD[collection] <= 5) ||
      (reports.AL_QofL3_SD && reports.AL_QofL3_SD[collection] <= 5) ||
      (reports.PR_QofL3_SD && reports.PR_QofL3_SD[collection] <= 5) ||
      (reports.HSF_QofL3_SD && reports.HSF_QofL3_SD[collection] <= 5) ||
      (reports.FPC_QofL3_SD && reports.FPC_QofL3_SD[collection] <= 5) ||
      (reports.FS_QofL3_SD && reports.FS_QofL3_SD[collection] <= 5) ||
      (reports.SR_QofL3_SD && reports.SR_QofL3_SD[collection] <= 5) ||
      (reports.PAG_QofL1_SD && reports.PAG_QofL1_SD[collection] === 3)
    ) {
      this.setState({ redAlert: true });
    }

    if (
      (reports.SL_QofL3_SD && reports.SL_QofL3_SD[collection] === 6) ||
      (reports.YH_QofL3_SD && reports.YH_QofL3_SD[collection] === 6) ||
      (reports.AL_QofL3_SD && reports.AL_QofL3_SD[collection] === 6) ||
      (reports.PR_QofL3_SD && reports.PR_QofL3_SD[collection] === 6) ||
      (reports.HSF_QofL3_SD && reports.HSF_QofL3_SD[collection] === 6) ||
      (reports.FPC_QofL3_SD && reports.FPC_QofL3_SD[collection] === 6) ||
      (reports.FS_QofL3_SD && reports.FS_QofL3_SD[collection] === 6) ||
      (reports.SR_QofL3_SD && reports.SR_QofL3_SD[collection] === 6) ||
      (reports.PAG_QofL1_SD && reports.PAG_QofL1_SD[collection] === 2)
    ) {
      this.setState({ yellowAlert: true });
    }
  }

  render() {
    return (
      <Grid container spacing={3} style={{ fontFamily: 'Roboto, sans-serif' }}>
        <Grid item xs={12}>
          <Typography variant="h5" color="inherit" align="left" gutterBottom>
            Personal Well-Being
          </Typography>
        </Grid>

        {/* Red Flags */}
        <Grid item xs={6}>
          <Typography variant="h6" color="inherit" align="left" gutterBottom>
            Red Flags
          </Typography>
          {this.state.redAlert === false ? (
            <Alert severity="info">No Red Flags</Alert>
          ) : (
            <>
              {this.props.reports.LS_QofL3_SD && this.props.reports.LS_QofL3_SD[this.props.collection] <= 5 && (
                <Paper style={this.textBgRed} elevation={3}>
                  <Typography variant="body1" color="inherit" align="left">
                    You are not satisfied with life as a whole
                  </Typography>
                </Paper>
              )}
              {this.props.reports.SL_QofL3_SD && this.props.reports.SL_QofL3_SD[this.props.collection] <= 5 && (
                <Paper style={this.textBgRed} elevation={3}>
                  <Typography variant="body1" color="inherit" align="left">
                    You are not satisfied with your standard of living
                  </Typography>
                </Paper>
              )}
              {this.props.reports.YH_QofL3_SD && this.props.reports.YH_QofL3_SD[this.props.collection] <= 5 && (
                <Paper style={this.textBgRed} elevation={3}>
                  <Typography variant="body1" color="inherit" align="left">
                    You are not satisfied with your health
                  </Typography>
                </Paper>
              )}
              {this.props.reports.AL_QofL3_SD && this.props.reports.AL_QofL3_SD[this.props.collection] <= 5 && (
                <Paper style={this.textBgRed} elevation={3}>
                  <Typography variant="body1" color="inherit" align="left">
                    You are not satisfied with what you are achieving
                  </Typography>
                </Paper>
              )}
              {this.props.reports.PR_QofL3_SD && this.props.reports.PR_QofL3_SD[this.props.collection] <= 5 && (
                <Paper style={this.textBgRed} elevation={3}>
                  <Typography variant="body1" color="inherit" align="left">
                    You are not satisfied with your personal relationships
                  </Typography>
                </Paper>
              )}
              {this.props.reports.HSF_QofL3_SD && this.props.reports.HSF_QofL3_SD[this.props.collection] <= 5 && (
                <Paper style={this.textBgRed} elevation={3}>
                  <Typography variant="body1" color="inherit" align="left">
                    You are not satisfied with how safe you feel
                  </Typography>
                </Paper>
              )}
              {this.props.reports.FPC_QofL3_SD && this.props.reports.FPC_QofL3_SD[this.props.collection] <= 5 && (
                <Paper style={this.textBgRed} elevation={3}>
                  <Typography variant="body1" color="inherit" align="left">
                    You are not satisfied with feeling part of the community
                  </Typography>
                </Paper>
              )}
              {this.props.reports.FS_QofL3_SD && this.props.reports.FS_QofL3_SD[this.props.collection] <= 5 && (
                <Paper style={this.textBgRed} elevation={3}>
                  <Typography variant="body1" color="inherit" align="left">
                    You are not satisfied with your future security
                  </Typography>
                </Paper>
              )}
              {this.props.reports.SR_QofL3_SD && this.props.reports.SR_QofL3_SD[this.props.collection] <= 5 && (
                <Paper style={this.textBgRed} elevation={3}>
                  <Typography variant="body1" color="inherit" align="left">
                    You are not satisfied with your spirituality or religion
                  </Typography>
                </Paper>
              )}
              {this.props.reports.PAG_QofL1_SD && this.props.reports.PAG_QofL1_SD[this.props.collection] === 3 && (
                <Paper style={this.textBgRed} elevation={3}>
                  <Typography variant="body1" color="inherit" align="left">
                    You are not satisfied with the progress you are making in achieving your goals and wishes
                  </Typography>
                </Paper>
              )}
            </>
          )}
        </Grid>

        {/* Yellow Flags */}
        <Grid item xs={6}>
          <Typography variant="h6" color="inherit" align="left" gutterBottom>
            Yellow Flags
          </Typography>
          {this.state.yellowAlert === false ? (
            <Alert severity="info">No Yellow Flags</Alert>
          ) : (
            <>
              {this.props.reports.SL_QofL3_SD && this.props.reports.SL_QofL3_SD[this.props.collection] === 6 && (
                <Paper style={this.textBgYellow} elevation={3}>
                  <Typography variant="body1" color="inherit" align="left">
                    You are sometimes unsatisfied with your standard of living
                  </Typography>
                </Paper>
              )}
              {this.props.reports.YH_QofL3_SD && this.props.reports.YH_QofL3_SD[this.props.collection] === 6 && (
                <Paper style={this.textBgYellow} elevation={3}>
                  <Typography variant="body1" color="inherit" align="left">
                    You are sometimes unsatisfied with your health
                  </Typography>
                </Paper>
              )}
              {this.props.reports.AL_QofL3_SD && this.props.reports.AL_QofL3_SD[this.props.collection] === 6 && (
                <Paper style={this.textBgYellow} elevation={3}>
                  <Typography variant="body1" color="inherit" align="left">
                    You are sometimes unsatisfied with what you are achieving
</Typography>
</Paper>
)}
{this.props.reports.PR_QofL3_SD && this.props.reports.PR_QofL3_SD[this.props.collection] === 6 && (
<Paper style={this.textBgYellow} elevation={3}>
<Typography variant="body1" color="inherit" align="left">
You are sometimes unsatisfied with your personal relationships
</Typography>
</Paper>
)}
{this.props.reports.HSF_QofL3_SD && this.props.reports.HSF_QofL3_SD[this.props.collection] === 6 && (
<Paper style={this.textBgYellow} elevation={3}>
<Typography variant="body1" color="inherit" align="left">
You are sometimes unsatisfied with how safe you feel
</Typography>
</Paper>
)}
{this.props.reports.FPC_QofL3_SD && this.props.reports.FPC_QofL3_SD[this.props.collection] === 6 && (
<Paper style={this.textBgYellow} elevation={3}>
<Typography variant="body1" color="inherit" align="left">
You are sometimes unsatisfied with feeling part of the community
</Typography>
</Paper>
)}
{this.props.reports.FS_QofL3_SD && this.props.reports.FS_QofL3_SD[this.props.collection] === 6 && (
<Paper style={this.textBgYellow} elevation={3}>
<Typography variant="body1" color="inherit" align="left">
You are sometimes unsatisfied with your future security
</Typography>
</Paper>
)}
{this.props.reports.SR_QofL3_SD && this.props.reports.SR_QofL3_SD[this.props.collection] === 6 && (
<Paper style={this.textBgYellow} elevation={3}>
<Typography variant="body1" color="inherit" align="left">
You are sometimes unsatisfied with your spirituality or religion
</Typography>
</Paper>
)}
{this.props.reports.PAG_QofL1_SD && this.props.reports.PAG_QofL1_SD[this.props.collection] === 2 && (
<Paper style={this.textBgYellow} elevation={3}>
<Typography variant="body1" color="inherit" align="left">
You are only sometimes satisfied with the progress you are making in achieving your goals and wishes
</Typography>
</Paper>
)}
</>
)}
</Grid>
</Grid>
);
}
}
