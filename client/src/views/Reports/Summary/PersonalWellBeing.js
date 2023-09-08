// import React, {Component} from 'react';
// import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
// import Box from '@material-ui/core/Box';
// import PersonalWellbeing_Gauge from './PersonalWellbeing_Gauge';

// export default class PersonalWellBeing extends Component {

// 	render() {
// 		return (
// 			<>
// 				<Typography variant="h6" color="secondary" align="left" gutterBottom>
// 					Personal Well-Being
// 				</Typography>
// 				<Box m={1} mb={2}>
// 					{/* PWI determined sentence */}
// 					{/* PWI 70-100 */}
// 					{this.props.reports.PWI_QofL3_COMB[this.props.collection] !== 999 && 
// 					this.props.reports.PWI_QofL3_COMB[this.props.collection] >= 70 && this.props.reports.PWI_QofL3_COMB[this.props.collection] <= 100 &&
// 						<Typography display="block" component="div" align="left" gutterBottom>
// 							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
// 								I am satisfied with my life right now&nbsp;
// 							</Typography>
// 						</Typography>
// 					}
// 					{/* PWI 46-69 */}
// 					{this.props.reports.PWI_QofL3_COMB[this.props.collection] !== 999 && 
// 					this.props.reports.PWI_QofL3_COMB[this.props.collection] >= 46 && this.props.reports.PWI_QofL3_COMB[this.props.collection] <= 69 &&
// 						<Typography display="block" component="div" align="left" gutterBottom>
// 							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
// 								I am not satisfied with a few aspects of my life right now&nbsp;
// 							</Typography>
// 						</Typography>
// 					}
// 					{/* PWI 20-45 */}
// 					{this.props.reports.PWI_QofL3_COMB[this.props.collection] !== 999 && 
// 					this.props.reports.PWI_QofL3_COMB[this.props.collection] >= 20 && this.props.reports.PWI_QofL3_COMB[this.props.collection] <= 45 &&
// 						<Typography display="block" component="div" align="left" gutterBottom>
// 							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
// 								I am not satisfied with many aspects of my life right now&nbsp;
// 							</Typography>
// 						</Typography>
// 					}
// 					{/* PWI 0-19 */}
// 					{this.props.reports.PWI_QofL3_COMB[this.props.collection] !== 999 && 
// 					this.props.reports.PWI_QofL3_COMB[this.props.collection] >= 0 && this.props.reports.PWI_QofL3_COMB[this.props.collection] <= 19 &&
// 						<Typography display="block" component="div" align="left" gutterBottom>
// 							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
// 								I am not at all satisfied with my life right now&nbsp;
// 							</Typography>
// 						</Typography>
// 					}
// 					{this.props.reports.PWI_QofL3_COMB[this.props.collection] !== 999 && 
// 						<PersonalWellbeing_Gauge data = {this.props.reports.PWI_QofL3_COMB[this.props.collection]}/>
// 					}
// 				</Box>
// 			</>
// 			)
// 	}
// }



import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import HealthToday from './HealthToday';
import PersonalWellBeingBar from './PersonalWellBeingBar';

export default class PersonalWellBeing extends Component {
  render() {
    const PWI_QofL3_COMB = this.props.reports.PWI_QofL3_COMB[this.props.collection];

    return (
      <>
        <Typography variant="h6" color="secondary" align="left" gutterBottom>
          Personal Well-Being
        </Typography>
        <Box m={1} mb={2}>
          {/* PWI determined sentence */}
          {PWI_QofL3_COMB !== 999 ? <>
            {PWI_QofL3_COMB !== 999 && PWI_QofL3_COMB >= 70 && PWI_QofL3_COMB <= 100 && (
              <Typography display="block" component="div" align="left" gutterBottom>
                <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                  I am satisfied with my life right now&nbsp;
                </Typography>
              </Typography>
            )}

            {PWI_QofL3_COMB !== 999 && PWI_QofL3_COMB >= 46 && PWI_QofL3_COMB <= 69 && (
              <Typography display="block" component="div" align="left" gutterBottom>
                <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                  I am not satisfied with a few aspects of my life right now&nbsp;
                </Typography>
              </Typography>
            )}

            {PWI_QofL3_COMB !== 999 && PWI_QofL3_COMB >= 20 && PWI_QofL3_COMB <= 45 && (
              <Typography display="block" component="div" align="left" gutterBottom>
                <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                  I am not satisfied with many aspects of my life right now&nbsp;
                </Typography>
              </Typography>
            )}

            {PWI_QofL3_COMB !== 999 && PWI_QofL3_COMB >= 0 && PWI_QofL3_COMB <= 19 && (
              <Typography display="block" component="div" align="left" gutterBottom>
                <Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
                  I am not at all satisfied with my life right now&nbsp;
                </Typography>
              </Typography>
            )}</> : (
            <Typography variant="subtitle2" color="textSecondary" align="left" gutterBottom>
              Data not available
            </Typography>
          )}

          {PWI_QofL3_COMB !== 999 ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <Typography display="block" variant="subtitle1" align="center" gutterBottom>
                  Personal Well-Being
                </Typography>
                <div style={{ width: '600px', height: '100px', margin: '0 auto' }}>
                  <HealthToday data={PWI_QofL3_COMB} />
                </div>
                <Typography display="block" component="div" align="center">
                  Overall Score: {PWI_QofL3_COMB}
                </Typography>
              </div>
            </div>
          ) : (
            <Typography variant="subtitle2" color="textSecondary" align="left" gutterBottom>
              Data not available
            </Typography>
          )}


          {this.props.reports.LS_QofL3_SD[this.props.collection] !== 999 &&
            this.props.reports.SL_QofL3_SD[this.props.collection] !== 999 &&
            this.props.reports.YH_QofL3_SD[this.props.collection] !== 999 &&
            this.props.reports.FPC_QofL3_SD[this.props.collection] !== 999 &&
            this.props.reports.AL_QofL3_SD[this.props.collection] !== 999 &&
            this.props.reports.PR_QofL3_SD[this.props.collection] !== 999 &&
            this.props.reports.HSF_QofL3_SD[this.props.collection] !== 999 &&
            this.props.reports.FS_QofL3_SD[this.props.collection] !== 999 &&
            this.props.reports.SR_QofL3_SD[this.props.collection] !== 999 ? (
            <>
              <PersonalWellBeingBar id="personalWellBeingChart"
                life_satisfaction={this.props.reports.LS_QofL3_SD[this.props.collection]}
                your_standard_of_living={this.props.reports.SL_QofL3_SD[this.props.collection]}
                your_health={this.props.reports.YH_QofL3_SD[this.props.collection]}
                feeling_part_of_the_community={this.props.reports.FPC_QofL3_SD[this.props.collection]}
                what_you_are_achieving_in_life={this.props.reports.AL_QofL3_SD[this.props.collection]}
                personal_relationships={this.props.reports.PR_QofL3_SD[this.props.collection]}
                how_safe_you_feel={this.props.reports.HSF_QofL3_SD[this.props.collection]}
                future_security={this.props.reports.FS_QofL3_SD[this.props.collection]}
                your_spirituality_or_religion={this.props.reports.SR_QofL3_SD[this.props.collection]}
              />
            </>
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
