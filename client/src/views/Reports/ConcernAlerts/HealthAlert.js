import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Grid from '@material-ui/core/Grid';
import { ListItem } from '@material-ui/core';


export default class HealthAlert extends Component {
	state = {
		redAlert: false,
		yellowAlert: false
	};

	textBgRed = { backgroundColor: this.props.colors.red };
	textBgYellow = { backgroundColor: this.props.colors.yellow };


	componentDidMount() {
		// redalerts check
		if (
			(this.props.reports && this.props.reports.HT_QofL2_SD && this.props.reports.HT_QofL2_SD[this.props.collection] <= 50) ||
			(this.props.reports && this.props.reports.PH_QofL2_SD && this.props.reports.PH_QofL2_SD[this.props.collection] === 0) ||
			(this.props.reports && this.props.reports.MH_QofL2_SD && this.props.reports.MH_QofL2_SD[this.props.collection] === 0) ||
			(this.props.reports && this.props.reports.M_QofL2_SD && this.props.reports.M_QofL2_SD[this.props.collection] === 0) ||
			(this.props.reports && this.props.reports.M_QofL2_SD && this.props.reports.M_QofL2_SD[this.props.collection] === 1) ||
			(this.props.reports && this.props.reports.PC_QofL2_SD && this.props.reports.PC_QofL2_SD[this.props.collection] === 0) ||
			(this.props.reports && this.props.reports.PC_QofL2_SD && this.props.reports.PC_QofL2_SD[this.props.collection] === 1) ||
			(this.props.reports && this.props.reports.UA_QofL2_SD && this.props.reports.UA_QofL2_SD[this.props.collection] === 0) ||
			(this.props.reports && this.props.reports.UA_QofL2_SD && this.props.reports.UA_QofL2_SD[this.props.collection] === 1) ||
			(this.props.reports && this.props.reports.PD_QofL2_SD && this.props.reports.PD_QofL2_SD[this.props.collection] === 0) ||
			(this.props.reports && this.props.reports.PD_QofL2_SD && this.props.reports.PD_QofL2_SD[this.props.collection] === 1) ||
			(this.props.reports && this.props.reports.AD_QofL2_SD && this.props.reports.AD_QofL2_SD[this.props.collection] === 0) ||
			(this.props.reports && this.props.reports.AD_QofL2_SD && this.props.reports.AD_QofL2_SD[this.props.collection] === 1)
		) {
			this.setState({ redAlert: true });
		}

		//yellow alerts check
		if (
			(this.props.reports && this.props.reports.HT_QofL2_SD && this.props.reports.HT_QofL2_SD[this.props.collection] > 50 && this.props.reports.HT_QofL2_SD[this.props.collection] <= 65) ||
			(this.props.reports && this.props.reports.PH_QofL2_SD && this.props.reports.PH_QofL2_SD[this.props.collection] === 1) ||
			(this.props.reports && this.props.reports.MH_QofL2_SD && this.props.reports.MH_QofL2_SD[this.props.collection] === 1) ||
			(this.props.reports && this.props.reports.M_QofL2_SD && this.props.reports.M_QofL2_SD[this.props.collection] === 2) ||
			(this.props.reports && this.props.reports.PC_QofL2_SD && this.props.reports.PC_QofL2_SD[this.props.collection] === 2) ||
			(this.props.reports && this.props.reports.UA_QofL2_SD && this.props.reports.UA_QofL2_SD[this.props.collection] === 2) ||
			(this.props.reports && this.props.reports.PD_QofL2_SD && this.props.reports.PD_QofL2_SD[0] === 2) ||
			(this.props.reports && this.props.reports.AD_QofL2_SD && this.props.reports.AD_QofL2_SD[this.props.collection] === 2) ||
			(this.props.reports && this.props.reports.HU_ED_QofL2_SD && this.props.reports.HU_ED_QofL2_SD[this.props.collection] > 0 && this.props.reports.HU_ED_QofL2_SD[this.props.collection] < 999) ||
			(this.props.reports && this.props.reports.HU_HNum_QofL2_SD && this.props.reports.HU_HNum_QofL2_SD[this.props.collection] > 0 && this.props.reports.HU_HNum_QofL2_SD[this.props.collection] < 999) ||
			(this.props.reports && this.props.reports.HU_EMS_QofL2_SD && this.props.reports.HU_EMS_QofL2_SD[this.props.collection] > 0 && this.props.reports.HU_EMS_QofL2_SD[this.props.collection] < 999) ||
			(this.props.reports && this.props.reports.HU_UC_QofL2_SD && this.props.reports.HU_UC_QofL2_SD[this.props.collection] > 0 && this.props.reports.HU_UC_QofL2_SD[this.props.collection] < 999) ||
			(this.props.reports && this.props.reports.access_to_family_doctor && this.props.reports.access_to_family_doctor[this.props.collection] == "No") ||
			(
				this.props.reports && this.props.reports.support_wellness_program && this.props.reports.problem_walking && this.props.reports.problem_washing_dressing && this.props.reports.problem_usual_activities && this.props.reports.problem_pain_discomfort && this.props.reports.problem_anxious_depressed &&
				this.props.reports.support_wellness_program[this.props.collection] &&
				(this.props.reports.problem_walking[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
				(this.props.reports.problem_washing_dressing[this.props.collection] > 1 && this.props.reports.problem_washing_dressing[this.props.collection] < 999) &&
				(this.props.reports.problem_usual_activities[this.props.collection] > 1 && this.props.reports.problem_usual_activities[this.props.collection] < 999) &&
				(this.props.reports.problem_pain_discomfort[this.props.collection] > 1 && this.props.reports.problem_pain_discomfort[this.props.collection] < 999) &&
				(this.props.reports.problem_anxious_depressed[this.props.collection] > 1 && this.props.reports.problem_anxious_depressed[this.props.collection] < 999)
			) ||
			(
				this.props.reports && this.props.reports.support_informal && this.props.reports.problem_walking && this.props.reports.problem_washing_dressing && this.props.reports.problem_usual_activities && this.props.reports.problem_pain_discomfort && this.props.reports.problem_anxious_depressed &&
				this.props.reports.support_informal[this.props.collection] &&
				(this.props.reports.problem_walking[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
				(this.props.reports.problem_washing_dressing[this.props.collection] > 1 && this.props.reports.problem_washing_dressing[this.props.collection] < 999) &&
				(this.props.reports.problem_usual_activities[this.props.collection] > 1 && this.props.reports.problem_usual_activities[this.props.collection] < 999) &&
				(this.props.reports.problem_pain_discomfort[this.props.collection] > 1 && this.props.reports.problem_pain_discomfort[this.props.collection] < 999) &&
				(this.props.reports.problem_anxious_depressed[this.props.collection] > 1 && this.props.reports.problem_anxious_depressed[this.props.collection] < 999)
			)
		) {
			this.setState({ yellowAlert: true });
		}
	}
	render() {
		
		return (
			<Grid container item xs={12} spacing={2}>
				<Grid item xs={2}>
					<Typography variant="h5" color="inherit" align="left" gutterBottom>
						Health Alert
					</Typography>
				</Grid>

				{/* Red flag row */}
				{this.state.redAlert === false ?
					<Grid item xs={5}>
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
								None
							</Typography>
						</ListItem>
					</Grid>

					: <Grid item xs={5}>
						{/* Health today less than 50*/}
						{this.props.reports.HT_QofL2_SD && this.props.reports.HT_QofL2_SD[this.props.collection] <= 50 &&
							<ListItem style={this.textBgRed}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									Your health today is a concern. On a scale of 0 to 100, you rate your health today as less than 50
								</Typography>
							</ListItem>
						}
						{/* general health is poor (0) */}
						{this.props.reports.PH_QofL2_SD && this.props.reports.PH_QofL2_SD[this.props.collection] === 0 &&
							<ListItem style={this.textBgRed}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You rate your health as poor
								</Typography>
							</ListItem>
						}
						{/* Mental health rated poor (0) */}
						{this.props.reports.MH_QofL2_SD && this.props.reports.MH_QofL2_SD[this.props.collection] === 0 &&
							<ListItem style={this.textBgRed}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You rate your mental health as poor
								</Typography>
							</ListItem>
						}
						{
							(this.props.reports.M_QofL2_SD && this.props.reports.M_QofL2_SD[this.props.collection] &&
								(this.props.reports.M_QofL2_SD[this.props.collection] === 0 || this.props.reports.M_QofL2_SD[this.props.collection] === 1)) &&
							<ListItem style={this.textBgRed}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom style={{backgroundColor: '#e06666'}}>
									You have severe problems walking around
								</Typography>
							</ListItem>
						}
						{/* Severe (1) or extreme (0) problems with personal care */}
						{
							(this.props.reports.PC_QofL2_SD && this.props.reports.PC_QofL2_SD[this.props.collection] &&
								(this.props.reports.PC_QofL2_SD[this.props.collection] === 0 || this.props.reports.PC_QofL2_SD[this.props.collection] === 1)) &&
							<ListItem style={this.textBgRed}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You have severe problems washing or dressing
								</Typography>
							</ListItem>
						}
						{/* Severe (1) or extreme (0) problems with usual activities */}
						{
							(this.props.reports.UA_QofL2_SD && this.props.reports.UA_QofL2_SD[this.props.collection] &&
								(this.props.reports.UA_QofL2_SD[this.props.collection] === 0 || this.props.reports.UA_QofL2_SD[this.props.collection] === 1)) &&
							<ListItem style={this.textBgRed}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You have severe problems doing usual activities
								</Typography>
							</ListItem>
						}
						{/* Severe (1) or extreme (0) problems with pain / discomfort */}
						{
							(this.props.reports.PD_QofL2_SD && this.props.reports.PD_QofL2_SD[this.props.collection] &&
								(this.props.reports.PD_QofL2_SD[this.props.collection] === 0 || this.props.reports.PD_QofL2_SD[this.props.collection] === 1)) &&
							<ListItem style={this.textBgRed}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You have severe problems with pain/discomfort
								</Typography>
							</ListItem>
						}
						{/* Severe (1) or extreme (0) problems with anxiety / depression */}
						{
							(this.props.reports.AD_QofL2_SD && this.props.reports.AD_QofL2_SD[this.props.collection] &&
								(this.props.reports.AD_QofL2_SD[this.props.collection] === 0 || this.props.reports.AD_QofL2_SD[this.props.collection] === 1)) &&
							<ListItem style={this.textBgRed}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You have severe problems with anxiety/ depression
								</Typography>
							</ListItem>
						}
					</Grid>}

				{/* Yellow flag row */}
				{this.state.yellowAlert === false ?
					<Grid item xs={5}>
						<ListItem>
							<Typography variant="body1" color="inherit" align="center" gutterBottom>
								None
							</Typography>
						</ListItem>
					</Grid>
					: <Grid item xs={5}>
						{/* Health today is between 51 and 65*/}
						{
							(this.props.reports.HT_QofL2_SD && this.props.reports.HT_QofL2_SD[this.props.collection] && 50 < this.props.reports.HT_QofL2_SD[this.props.collection] && this.props.reports.HT_QofL2_SD[this.props.collection] <= 65) &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									Your health today is fair. On a scale of 0 to 100, you rate your health today as {this.props.reports.HT_QofL2_SD[this.props.collection]}
								</Typography>
							</ListItem>
						}
						{/* general health is fair (1) */}
						{
							(this.props.reports.PH_QofL2_SD && this.props.reports.PH_QofL2_SD[this.props.collection] && this.props.reports.PH_QofL2_SD[this.props.collection] === 1) &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You rate your health as fair
								</Typography>
							</ListItem>
						}
						{/* Mental health rated fair (1) */}
						{
							(this.props.reports.MH_QofL2_SD && this.props.reports.MH_QofL2_SD[this.props.collection] && this.props.reports.MH_QofL2_SD[this.props.collection] === 1) &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You rate your mental health as fair
								</Typography>
							</ListItem>
						}
						{/* Moderate(2) problems with mobility */}
						{
							(this.props.reports.M_QofL2_SD && this.props.reports.M_QofL2_SD[this.props.collection] && this.props.reports.M_QofL2_SD[this.props.collection] === 2) &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You have moderate problems walking around
								</Typography>
							</ListItem>
						}
						{/* Moderate(2) problems with personal care */}
						{
							(this.props.reports.PC_QofL2_SD && this.props.reports.PC_QofL2_SD[this.props.collection] && this.props.reports.PC_QofL2_SD[this.props.collection] === 2) &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You have moderate problems washing or dressing
								</Typography>
							</ListItem>
						}
						{/* Moderate(2) problems with usual activities */}
						{
							(this.props.reports.UA_QofL2_SD && this.props.reports.UA_QofL2_SD[this.props.collection] && this.props.reports.UA_QofL2_SD[this.props.collection] === 2) &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You have moderate problems doing usual activities
								</Typography>
							</ListItem>
						}
						{/* Moderate(2) problems with pain / discomfort */}
						{
							(this.props.reports.PD_QofL2_SD && this.props.reports.PD_QofL2_SD[this.props.collection] && this.props.reports.PD_QofL2_SD[this.props.collection] === 2) &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You have moderate problems with pain/discomfort
								</Typography>
							</ListItem>
						}
						{/* Moderate(2) problems with anxiety / depression */}
						{
							(this.props.reports.AD_QofL2_SD && this.props.reports.AD_QofL2_SD[this.props.collection] && this.props.reports.AD_QofL2_SD[this.props.collection] === 2) &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You have moderate problems with anxiety/ depression
								</Typography>
							</ListItem>
						}
						{/* Number of ER visits */}
						{
							(this.props.reports.HU_ED_QofL2_SD && this.props.reports.HU_ED_QofL2_SD[this.props.collection] && 999 > this.props.reports.HU_ED_QofL2_SD[this.props.collection] && this.props.reports.HU_ED_QofL2_SD[this.props.collection] > 0) &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You had {this.props.reports.HU_ED_QofL2_SD[this.props.collection]} ER visits in the past year.
								</Typography>
							</ListItem>
						}
						{/* Number of hospitalizations */}
						{
							(this.props.reports.HU_HNum_QofL2_SD && this.props.reports.HU_HNum_QofL2_SD[this.props.collection] && 999 > this.props.reports.HU_HNum_QofL2_SD[this.props.collection] && this.props.reports.HU_HNum_QofL2_SD[this.props.collection] > 0) &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You had {this.props.reports.HU_HNum_QofL2_SD[this.props.collection]} hospitalizations in the past year.
								</Typography>
							</ListItem>
						}
						{/* Number of crisis */}
						{
							(this.props.reports.HU_EMS_QofL2_SD && this.props.reports.HU_EMS_QofL2_SD[this.props.collection] && 999 > this.props.reports.HU_EMS_QofL2_SD[this.props.collection] && this.props.reports.HU_EMS_QofL2_SD[this.props.collection] > 0) &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You had {this.props.reports.HU_EMS_QofL2_SD[this.props.collection]} crisis in the past year.
								</Typography>
							</ListItem>
						}
						{/* Number of urgent care visits */}
						{
							(this.props.reports.HU_UC_QofL2_SD && this.props.reports.HU_UC_QofL2_SD[this.props.collection] && 999 > this.props.reports.HU_UC_QofL2_SD[this.props.collection] && this.props.reports.HU_UC_QofL2_SD[this.props.collection] > 0) &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You had {this.props.reports.HU_UC_QofL2_SD[this.props.collection]} urgent care visits in the past year.
								</Typography>
							</ListItem>
						}
						{/*access to family doctor? */}
						{
							(this.props.reports.access_to_family_doctor && this.props.reports.access_to_family_doctor[this.props.collection] && this.props.reports.access_to_family_doctor[this.props.collection] == "No") &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You don’t have access to a family doctor
								</Typography>
							</ListItem>
						}

						
						{/* Seldom participated in wellness activities */}
						{/* {this.props.reports.support_wellness_program[this.props.collection] &&
						(this.props.reports.problem_walking[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
						(this.props.reports.problem_washing_dressing[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
						(this.props.reports.problem_usual_activities[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
						(this.props.reports.problem_walking[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
						(this.props.reports.problem_pain_discomfort[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
						(this.props.reports.problem_anxious_depressed[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
								Despite serious health limitations, you seldom participated in wellness activities
							</Typography>
						</ListItem>
					} */}
						{/* No access to informal care */}
						{/* {this.props.reports.support_informal[this.props.collection] &&
						(this.props.reports.problem_walking[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
						(this.props.reports.problem_washing_dressing[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
						(this.props.reports.problem_usual_activities[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
						(this.props.reports.problem_walking[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
						(this.props.reports.problem_pain_discomfort[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
						(this.props.reports.problem_anxious_depressed[this.props.collection] > 1 && this.props.reports.problem_walking[this.props.collection] < 999) &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
								Despite serious health limitations, you did not have access to informal care
							</Typography>
						</ListItem>
					} */}
					</Grid>}
			</Grid>
		)
	}
}