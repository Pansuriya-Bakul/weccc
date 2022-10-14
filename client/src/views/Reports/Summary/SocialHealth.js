import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Box from '@material-ui/core/Box';

export default class SocialHealth extends Component {

	render() {
		return (
			
			<>		
				
				<Typography variant="h6" color="secondary" align="left" gutterBottom>
					{/* Social Health */}
				</Typography>
				<Box m={1} mb={2}>
				{this.props.reports.household2_size[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								How many people do you live with?  &nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.household2_size[this.props.collection]}
							</Typography>
						</Typography>
				}
				{this.props.reports.community_activity_participate[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								Do you participate in community activities as much as you would like?  &nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.community_activity_participate[this.props.collection]}
							</Typography>
						</Typography>
				}
				{this.props.reports.life_satisfaction2[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
							Using a scale of 1 to 10 where 1 means "Very dissatisfied" and 10 means "Very satisfied", how do you feel about your life as a whole right now?  &nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.life_satisfaction2[this.props.collection]}
							</Typography>
						</Typography>
				}
				{this.props.reports.local_community_belonging[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								How would you describe your sense of belonging to your local community?  &nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.local_community_belonging[this.props.collection]}
							</Typography>
						</Typography>
				}
				{this.props.reports.lack_companionship[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								How often do you feel that you lack companionship? &nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.lack_companionship[this.props.collection]}
							</Typography>
						</Typography>
				}
				{this.props.reports.feel_leftout[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								How often do you feel left out?   &nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.feel_leftout[this.props.collection]}
							</Typography>
						</Typography>
				}
				{this.props.reports.feel_isolated[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								How often do you feel isolated from others?   &nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.feel_isolated[this.props.collection]}
							</Typography>
						</Typography>
				}
				{this.props.reports.con_que[this.props.collection] !== 999 &&
						<Typography display="block" component="div" align="left" gutterBottom>
							<Typography display="inline" variant="body1" component="div" color="primary" align="left" gutterBottom>
								Do you agree to be contacted in the future to receive your private and confidential personal results of the Neighbours mini screening questions, along with suggested community resources, programs and support options?   &nbsp;
							</Typography>
							<Typography display="inline" variant="body1" component="div" color="inherit" align="left" gutterBottom>
								{this.props.reports.con_que[this.props.collection]}
							</Typography>
						</Typography>
				}


				</Box>
			</>
			)
	}
	
}					