import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import HealthToday from './HealthToday';
import HealthBar from './HealthBar';


const HealthStatus = ({ reports, collection }) => {

  const scoreToWord = { 4: 'Excellent 😍', 3: 'Very Good 😃', 2: 'Good 🙂', 1: 'Fair 🙂', 0: 'Poor 😭' };

  console.log('reports:', reports);
  console.log('collection:', collection);
  console.log('reports.PH_QofL2_SD[collection]:', reports.PH_QofL2_SD && reports.PH_QofL2_SD[collection]);
  console.log('reports.MH_QofL2_SD[collection]:', reports.MH_QofL2_SD && reports.MH_QofL2_SD[collection]);


  return (
    <>
      <Typography variant="h6" color="secondary" align="left" gutterBottom>
        Health Status
      </Typography>
      <Box m={1} mb={2}>
        {reports.PH_QofL2_SD && reports.PH_QofL2_SD[collection] !== 999 && (
          <Typography display="block" variant="subtitle1" align="left" gutterBottom>
            Physical Health: {scoreToWord[reports.PH_QofL2_SD[collection]]}
          </Typography>
        )}

        {reports.MH_QofL2_SD && reports.MH_QofL2_SD[collection] !== 999 && (
          <Typography display="block" variant="subtitle1" align="left" gutterBottom>
            Mental Health: {scoreToWord[reports.MH_QofL2_SD[collection]]}
          </Typography>
        )}

        {reports.HT_QofL2_SD && reports.HT_QofL2_SD[collection] !== 999 && (
          <Typography display="block" variant="subtitle1" align="left" gutterBottom>
            Health Today Score: {reports.HT_QofL2_SD[collection]}%
          </Typography>
        )}

        {reports.HT_QofL2_SD && reports.HT_QofL2_SD[collection] !== 999 && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <Typography display="block" component="div" align="center" gutterBottom>
                Health Today
              </Typography>
              <div style={{ width: '600px', height: '100px', margin: '0 auto' }}>
                <HealthToday data={reports.HT_QofL2_SD[collection]} />
              </div>
              <Typography display="block" component="div" align="center">
                Overall Score: {reports.HT_QofL2_SD[collection]}
              </Typography>
            </div>
          </div>
        )}

        {reports.problem_walking && reports.problem_walking[collection] !== 999 &&
          reports.problem_washing_dressing && reports.problem_washing_dressing[collection] !== 999 &&
          reports.problem_usual_activities && reports.problem_usual_activities[collection] !== 999 &&
          reports.problem_pain_discomfort && reports.problem_pain_discomfort[collection] !== 999 &&
          reports.problem_anxious_depressed && reports.problem_anxious_depressed[collection] !== 999 ? (
          <Typography display="block" variant="subtitle1" align="left" gutterBottom>
            {/*

                <ul>
                <li>Walking: {reports.problem_walking[collection]}</li>
                <li>Washing and Dressing: {reports.problem_washing_dressing[collection]}</li>
                <li>Usual Activities: {reports.problem_usual_activities[collection]}</li>
                <li>Pain and Discomfort: {reports.problem_pain_discomfort[collection]}</li>
                <li>Anxious and Depressed: {reports.problem_anxious_depressed[collection]}</li>
              </ul> */}
            
            <HealthBar
              walking={reports.problem_walking[collection]}
              washingDressing={reports.problem_washing_dressing[collection]}
              usualActivities={reports.problem_usual_activities[collection]}
              painDiscomfort={reports.problem_pain_discomfort[collection]}
              anxiousDepressed={reports.problem_anxious_depressed[collection]}
            />
          </Typography>
        ) : (
          <Typography display="block" variant="subtitle2" color="textSecondary" align="left" gutterBottom>
            Data not available.
          </Typography>
        )}
      </Box>
    </>
  );
}

      export default HealthStatus;

