import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import HealthToday from './HealthToday';
import PersonalWellBeingBar from './PersonalWellBeingBar';

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2),
  },
  header: {
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
  },
  score: {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  dataUnavailable: {
    color: theme.palette.text.secondary,
  },
  chartContainer: {
    width: '100%',
    height: '100px',
    margin: '0 auto',
  },
  chartBox: {
    padding: theme.spacing(2),
  },
});

class PersonalWellBeing extends Component {
  render() {
    const { reports, collection, classes } = this.props;

    const PWI_QofL3_COMB = reports.PWI_QofL3_COMB ? reports.PWI_QofL3_COMB[collection] : 999;
    const LS_QofL3_SD = reports.LS_QofL3_SD ? reports.LS_QofL3_SD[collection] : 999;
    const SL_QofL3_SD = reports.SL_QofL3_SD ? reports.SL_QofL3_SD[collection] : 999;
    const YH_QofL3_SD = reports.YH_QofL3_SD ? reports.YH_QofL3_SD[collection] : 999;
    const FPC_QofL3_SD = reports.FPC_QofL3_SD ? reports.FPC_QofL3_SD[collection] : 999;
    const AL_QofL3_SD = reports.AL_QofL3_SD ? reports.AL_QofL3_SD[collection] : 999;
    const PR_QofL3_SD = reports.PR_QofL3_SD ? reports.PR_QofL3_SD[collection] : 999;
    const HSF_QofL3_SD = reports.HSF_QofL3_SD ? reports.HSF_QofL3_SD[collection] : 999;
    const FS_QofL3_SD = reports.FS_QofL3_SD ? reports.FS_QofL3_SD[collection] : 999;
    const SR_QofL3_SD = reports.SR_QofL3_SD ? reports.SR_QofL3_SD[collection] : 999;

    return (
      <Box className={classes.container}>
        <Typography variant="h6" className={classes.header} align="left" gutterBottom>
          Personal Well-Being
        </Typography>
        <Box m={1} mb={2}>
          {PWI_QofL3_COMB !== 999 ? (
            <>
              {PWI_QofL3_COMB >= 70 && PWI_QofL3_COMB <= 100 && (
                <Typography display="block" component="div" align="left" gutterBottom>
                  <Typography display="inline" variant="body1" component="div" className={classes.score} align="left" gutterBottom>
                    I am satisfied with my life right now&nbsp;
                  </Typography>
                </Typography>
              )}

              {PWI_QofL3_COMB >= 46 && PWI_QofL3_COMB <= 69 && (
                <Typography display="block" component="div" align="left" gutterBottom>
                  <Typography display="inline" variant="body1" component="div" className={classes.score} align="left" gutterBottom>
                    I am not satisfied with a few aspects of my life right now&nbsp;
                  </Typography>
                </Typography>
              )}

              {PWI_QofL3_COMB >= 20 && PWI_QofL3_COMB <= 45 && (
                <Typography display="block" component="div" align="left" gutterBottom>
                  <Typography display="inline" variant="body1" component="div" className={classes.score} align="left" gutterBottom>
                    I am not satisfied with many aspects of my life right now&nbsp;
                  </Typography>
                </Typography>
              )}

              {PWI_QofL3_COMB >= 0 && PWI_QofL3_COMB <= 19 && (
                <Typography display="block" component="div" align="left" gutterBottom>
                  <Typography display="inline" variant="body1" component="div" className={classes.score} align="left" gutterBottom>
                    I am not at all satisfied with my life right now&nbsp;
                  </Typography>
                </Typography>
              )}
            </>
          ) : (
            <Typography variant="subtitle2" className={classes.dataUnavailable} align="left" gutterBottom>
              Data not available
            </Typography>
          )}

          <Grid container spacing={2} justify="center" alignItems="center" className={classes.chartBox}>
            <Grid item xs={12} md={8}>
              {PWI_QofL3_COMB !== 999 ? (
                <div className={classes.chartContainer}>
                  <Typography display="block" variant="subtitle1" align="center" gutterBottom>
                    Personal Well-Being
                  </Typography>
                  <div className={classes.chartContainer}>
                    <HealthToday data={PWI_QofL3_COMB} />
                  </div>
                  <Typography display="block" component="div" align="center">
                    Overall Score: {PWI_QofL3_COMB}
                  </Typography>
                </div>
              ) : (
                <Typography variant="subtitle2" className={classes.dataUnavailable} align="left" gutterBottom>
                  Data not available
                </Typography>
              )}
            </Grid>
          </Grid>

          <Grid container spacing={2} className={classes.chartBox}>
            <Grid item xs={12}>
              {LS_QofL3_SD !== 999 &&
              SL_QofL3_SD !== 999 &&
              YH_QofL3_SD !== 999 &&
              FPC_QofL3_SD !== 999 &&
              AL_QofL3_SD !== 999 &&
              PR_QofL3_SD !== 999 &&
              HSF_QofL3_SD !== 999 &&
              FS_QofL3_SD !== 999 &&
              SR_QofL3_SD !== 999 ? (
                <PersonalWellBeingBar
                  id="personalWellBeingChart"
                  life_satisfaction={LS_QofL3_SD}
                  your_standard_of_living={SL_QofL3_SD}
                  your_health={YH_QofL3_SD}
                  feeling_part_of_the_community={FPC_QofL3_SD}
                  what_you_are_achieving_in_life={AL_QofL3_SD}
                  personal_relationships={PR_QofL3_SD}
                  how_safe_you_feel={HSF_QofL3_SD}
                  future_security={FS_QofL3_SD}
                  your_spirituality_or_religion={SR_QofL3_SD}
                />
              ) : (
                <Typography display="block" variant="subtitle2" className={classes.dataUnavailable} align="left" gutterBottom>
                  Data not available.
                </Typography>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    );
  }
}

export default withStyles(styles)(PersonalWellBeing);
