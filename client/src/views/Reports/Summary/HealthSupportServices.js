import React from 'react';
import { Typography, Box, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  title: {
    color: theme.palette.secondary.main,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    
  },
  item: {
    marginBottom: theme.spacing(1),
  },
  primaryText: {
    color: theme.palette.primary.main,
    
  },
  regularText: {
    color: theme.palette.text.primary,
  },
}));

const HealthSupportServices = ({ reports, collection }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title} align="left" gutterBottom>
        Health Support Services
      </Typography>
      <Grid container spacing={2}>
        {reports.support_wellness_program[collection] !== 999 && (
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography className={classes.item}>
                <span className={classes.primaryText}>I attended wellness programs </span>
                <span className={classes.regularText}>{reports.support_wellness_program[collection]}</span>
              </Typography>
            </Paper>
          </Grid>
        )}
        {reports.support_healthcare[collection] !== 999 && (
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography className={classes.item}>
                <span className={classes.primaryText}>I visited a health care provider </span>
                <span className={classes.regularText}>{reports.support_healthcare[collection]}</span>
              </Typography>
            </Paper>
          </Grid>
        )}
        {reports.support_home_healthcare[collection] !== 999 && (
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography className={classes.item}>
                <span className={classes.primaryText}>I had home health care or personal support visits </span>
                <span className={classes.regularText}>{reports.support_home_healthcare[collection]}</span>
              </Typography>
            </Paper>
          </Grid>
        )}
        {reports.support_private_healthcare[collection] !== 999 && (
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography className={classes.item}>
                <span className={classes.primaryText}>I paid privately for extra home health care or personal support visits </span>
                <span className={classes.regularText}>{reports.support_private_healthcare[collection]}</span>
              </Typography>
            </Paper>
          </Grid>
        )}
        {reports.support_informal[collection] !== 999 && (
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography className={classes.item}>
                <span className={classes.primaryText}>I received informal support from friends, family, or a neighbour </span>
                <span className={classes.regularText}>{reports.support_informal[collection]}</span>
              </Typography>
            </Paper>
          </Grid>
        )}
        {reports.support_wellness_program[collection] === 999 &&
          reports.support_healthcare[collection] === 999 &&
          reports.support_home_healthcare[collection] === 999 &&
          reports.support_private_healthcare[collection] === 999 &&
          reports.support_informal[collection] === 999 && (
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography className={classes.item}>
                  <span className={classes.primaryText}>
                    In the past year, I have not visited any health professionals, used health care programs or services, or attended health related wellness programs.
                  </span>
                </Typography>
              </Paper>
            </Grid>
          )}
      </Grid>
    </div>
  );
};

export default HealthSupportServices;
