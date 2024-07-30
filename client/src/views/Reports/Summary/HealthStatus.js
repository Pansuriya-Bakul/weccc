import React from 'react';
import { Typography, Box, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import HealthToday from './HealthToday';
import HealthBar from './HealthBar';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  title: {
    color: theme.palette.secondary.main,
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    marginBottom: theme.spacing(1),
  },
  healthBar: {
    marginTop: theme.spacing(2),
  },
  hoverEffect: {
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  largeText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  overallScore: {
    marginTop: theme.spacing(2),
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
}));

const HealthStatus = ({ reports, collection }) => {
  const classes = useStyles();
  const scoreToWord = { 4: 'Excellent 😍', 3: 'Very Good 😃', 2: 'Good 🙂', 1: 'Fair 🙂', 0: 'Poor 😭' };

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title} align="left" gutterBottom>
        Health Status
      </Typography>
      <Grid container spacing={3}>
        {reports.PH_QofL2_SD && reports.PH_QofL2_SD[collection] !== 999 && (
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={`${classes.paper} ${classes.hoverEffect}`}>
              <Typography variant="subtitle1" className={classes.subtitle} align="left" gutterBottom>
                Physical Health: {scoreToWord[reports.PH_QofL2_SD[collection]]}
              </Typography>
            </Paper>
          </Grid>
        )}

        {reports.MH_QofL2_SD && reports.MH_QofL2_SD[collection] !== 999 && (
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={`${classes.paper} ${classes.hoverEffect}`}>
              <Typography variant="subtitle1" className={classes.subtitle} align="left" gutterBottom>
                Mental Health: {scoreToWord[reports.MH_QofL2_SD[collection]]}
              </Typography>
            </Paper>
          </Grid>
        )}

        {reports.HT_QofL2_SD && reports.HT_QofL2_SD[collection] !== 999 && (
          <Grid item xs={12} sm={6} md={4}>
            <Paper className={`${classes.paper} ${classes.hoverEffect}`}>
              <Typography variant="subtitle1" className={classes.subtitle} align="left" gutterBottom>
                Health Today Score: {reports.HT_QofL2_SD[collection]}%
              </Typography>
            </Paper>
          </Grid>
        )}

        {reports.HT_QofL2_SD && reports.HT_QofL2_SD[collection] !== 999 && (
          <Grid item xs={12}>
            <Paper className={`${classes.paper} ${classes.hoverEffect}`}>
              <Typography display="block" component="div" align="center" gutterBottom>
                Health Today
              </Typography>
              <div style={{ width: '100%', height: '100px', margin: '0 auto' }}>
                <HealthToday data={reports.HT_QofL2_SD[collection]} />
              </div>
              <Typography display="block" component="div" align="center" className={classes.overallScore}>
                Overall Score: {reports.HT_QofL2_SD[collection]}
              </Typography>
            </Paper>
          </Grid>
        )}

        {reports.problem_walking && reports.problem_walking[collection] !== 999 &&
          reports.problem_washing_dressing && reports.problem_washing_dressing[collection] !== 999 &&
          reports.problem_usual_activities && reports.problem_usual_activities[collection] !== 999 &&
          reports.problem_pain_discomfort && reports.problem_pain_discomfort[collection] !== 999 &&
          reports.problem_anxious_depressed && reports.problem_anxious_depressed[collection] !== 999 ? (
          <Grid item xs={12}>
            <Paper className={`${classes.paper} ${classes.hoverEffect}`}>
              <HealthBar
                walking={reports.problem_walking[collection]}
                washingDressing={reports.problem_washing_dressing[collection]}
                usualActivities={reports.problem_usual_activities[collection]}
                painDiscomfort={reports.problem_pain_discomfort[collection]}
                anxiousDepressed={reports.problem_anxious_depressed[collection]}
              />
            </Paper>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary" align="left" gutterBottom>
              Data not available.
            </Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default HealthStatus;
