// import React, { Component } from 'react';
// import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
// import Box from '@material-ui/core/Box';

// import LineChart from '../LineChart';
// import PH_GAUGE from './PH_GAUGE';
// import MH_Gauge from './MH_Gauge';
// import HealthToday_Gauge from './HeathToday_Gauge';

// export default class HealthStatus extends Component {

// 	render() {
// 		return (
// 			<>
// 				<Typography variant="h6" color="secondary" align="left" gutterBottom>
// 					Health Status
// 				</Typography>
// 				<Box m={1} mb={2}>
// 					{this.props.reports.PH_QofL2_SD[this.props.collection] !== 999 &&
// 						<PH_GAUGE data={this.props.reports.PH_QofL2_SD[this.props.collection]} />

// 					}
// 					{this.props.reports.MH_QofL2_SD[this.props.collection] !== 999 &&
// 						<MH_Gauge data={this.props.reports.MH_QofL2_SD[this.props.collection]} />
// 					}
// 					{this.props.reports.HT_QofL2_SD[this.props.collection] !== 999 &&
// 						<Typography display="block" component="div" align="left" gutterBottom>
// 							<HealthToday_Gauge data={this.props.reports.HT_QofL2_SD[this.props.collection]} />
// 						</Typography>
// 					}
// 					{(this.props.reports.problem_walking[this.props.collection] !== 999 &&
// 						this.props.reports.problem_washing_dressing[this.props.collection] !== 999 &&
// 						this.props.reports.problem_usual_activities[this.props.collection] !== 999 &&
// 						this.props.reports.problem_pain_discomfort[this.props.collection] !== 999 &&
// 						this.props.reports.problem_anxious_depressed[this.props.collection] !== 999) ?
// 						<LineChart walking={this.props.reports.problem_walking[this.props.collection]}
// 							care={this.props.reports.problem_washing_dressing[this.props.collection]}
// 							usual={this.props.reports.problem_usual_activities[this.props.collection]}
// 							pain={this.props.reports.problem_pain_discomfort[this.props.collection]}
// 							anxious={this.props.reports.problem_anxious_depressed[this.props.collection]}
// 						/>
// 						:
// 						<Typography display="block" variant="subtitle2" color="textSecondary" align="left" gutterBottom>
// 							No available reports.
// 						</Typography>
// 					}
// 				</Box>
// 			</>
// 		)
// 	}
// }




import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

export default class HealthStatus extends Component {

  render() {
    const scoreToWord = {4:'Excellent', 3: 'Very Good', 2:'Good', 1: 'Fair', 0:'Poor'};

    return (
      <>
        <Typography variant="h6" color="secondary" align="left" gutterBottom>
          Health Status
        </Typography>
        <Box m={1} mb={2}>
          {this.props.reports.PH_QofL2_SD[this.props.collection] !== 999 && (
            <Typography display="block" variant="subtitle1" align="left" gutterBottom>
              Physical Health Score: {scoreToWord[this.props.reports.PH_QofL2_SD[this.props.collection]]}
            </Typography>
          )}

          {this.props.reports.MH_QofL2_SD[this.props.collection] !== 999 && (
            <Typography display="block" variant="subtitle1" align="left" gutterBottom>
              Mental Health Score: {scoreToWord[this.props.reports.MH_QofL2_SD[this.props.collection]]}
            </Typography>
          )}

          {this.props.reports.HT_QofL2_SD[this.props.collection] !== 999 && (
            <Typography display="block" variant="subtitle1" align="left" gutterBottom>
              Health Today Score: {this.props.reports.HT_QofL2_SD[this.props.collection]}%
            </Typography>
          )}

          {this.props.reports.problem_walking[this.props.collection] !== 999 &&
            this.props.reports.problem_washing_dressing[this.props.collection] !== 999 &&
            this.props.reports.problem_usual_activities[this.props.collection] !== 999 &&
            this.props.reports.problem_pain_discomfort[this.props.collection] !== 999 &&
            this.props.reports.problem_anxious_depressed[this.props.collection] !== 999 ? (
              <Typography display="block" variant="subtitle1" align="left" gutterBottom>
                Problem Scores:
                <ul>
                  <li>Walking: {this.props.reports.problem_walking[this.props.collection]}</li>
                  <li>Washing and Dressing: {this.props.reports.problem_washing_dressing[this.props.collection]}</li>
                  <li>Usual Activities: {this.props.reports.problem_usual_activities[this.props.collection]}</li>
                  <li>Pain and Discomfort: {this.props.reports.problem_pain_discomfort[this.props.collection]}</li>
                  <li>Anxious and Depressed: {this.props.reports.problem_anxious_depressed[this.props.collection]}</li>
                </ul>
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
}
