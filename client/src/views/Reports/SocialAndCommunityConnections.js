import React from "react";
import { Box, Typography, Grid, Card, CardContent, makeStyles } from "@material-ui/core";
import OverallFrequencyOfCommunityParticipation from "./OverallFrequencyOfCommunityParticipation";
import FrequencyByType from "./FrequencyByType";
import HealthStatus from './Summary/HealthStatus';
import HealthSupportServices from './Summary/HealthSupportServices';
import PersonalWellBeing from './Summary/PersonalWellBeing';
import './reports.css';

const useStyles = makeStyles((theme) => ({
  card: {
    margin: theme.spacing(2),
    '&:hover': {
      boxShadow: theme.shadows[6],
    },
  },
  title: {
    color: theme.palette.primary.main,
  },
  subtitle: {
    color: theme.palette.secondary.main,
  },
  listItem: {
    padding: theme.spacing(1, 0),
  },
  avoidBreak: {
    pageBreakInside: 'avoid',
  }
}));

export default function ({ reports, collection }) {
  const classes = useStyles();

  return (
    <>
      <Box m={1} className={classes.avoidBreak}>
        {reports.FCP_INT_COMB && (
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" className={classes.subtitle} align="left" gutterBottom>
                Overall Frequency of Community Participation
              </Typography>
              <OverallFrequencyOfCommunityParticipation source={reports.FCP_INT_COMB} />
              <Typography variant="h6" className={classes.subtitle} align="left" gutterBottom>
                Frequency by type of community activity
              </Typography>
              <Box m={1} mb={1}>
                <FrequencyByType source={reports.FCP_INT_COMB} />
              </Box>
            </CardContent>
          </Card>
        )}
        {reports.FCP_STRINGS_COMB && (
          <Card className={classes.card}>
            <CardContent>
              <Typography variant="h6" className={classes.subtitle} align="left" gutterBottom>
                Preferences for doing more activities
              </Typography>
              <Box m={1} mb={1}>
                {reports.FCP_STRINGS_COMB &&
                  Array.isArray(reports.FCP_STRINGS_COMB[0]) &&
                  reports.FCP_STRINGS_COMB[0].map((words, index) => (
                    <Typography
                      display="initial"
                      variant="body1"
                      component="div"
                      color="inherit"
                      align="left"
                      gutterBottom
                      key={index}
                    >
                      {index + 1}. {words}
                    </Typography>
                  ))}
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
      <div className={classes.avoidBreak}>
        <HealthStatus reports={reports} collection={collection} />
        <HealthSupportServices reports={reports} collection={collection} />
        <PersonalWellBeing reports={reports} collection={collection} />
      </div>
    </>
  );
}
