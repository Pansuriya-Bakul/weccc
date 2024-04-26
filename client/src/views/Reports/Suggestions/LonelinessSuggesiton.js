import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag


export default class Loneliness extends Component {

	render() {
		return (
			<div>
				{/* Displayed if red or yellow loneliness flags are triggered */}
				{((this.props.reports.PL_QofL1_COMB_often_count && this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] > 0 && this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] !== 999) || (this.props.reports.PL_QofL1_COMB_sometimes_count && this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] >= 2 && this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] !== 999)) &&
					<>
						<Typography variant="body1" color="inherit" align="left" gutterBottom>
							<em><b>Loneliness.</b></em>
						</Typography>
						{/* If red flag is triggered  */}
						{this.props.reports.PL_QofL1_COMB_often_count && this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] !== undefined && this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] > 0 && this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] !== 999 && 
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
								Everyone needs people in their lives they feel close to. Try meeting new people and maybe make new friends.  Join events that will help you connect with neighbours who share your interests, or start your own activity, and see who you meet.
							</Typography>
						}

						{/* If yellow flag is triggered */}
						{this.props.reports.PL_QofL1_COMB_sometimes_count && this.props.reports.PL_QofL1_COMB && this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] !== undefined && this.props.reports.PL_QofL1_COMB[this.props.collection] !== undefined && this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] > 1 && this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] !== 999 && this.props.PL_QofL1_COMB_often_count === 0 &&
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
								Try connecting with others through sharing your time and talents with them. Invite others to join you in doing the activities you love best. Helping others is also a good way to feel less lonely.
							</Typography>
						}
						
						{/* {this.props.reports.PL_QofL1_COMB_often_count && this.props.reports.PL_QofL1_COMB_sometimes_count && this.props.reports.PL_QofL1_COMB && this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] !== undefined && this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] !== undefined && this.props.reports.PL_QofL1_COMB[this.props.collection] !== undefined && !(this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] > 0 && this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] !== 999) && !((this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] > 0 && this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] !== 999) && (this.props.reports.PL_QofL1_COMB[this.props.collection] >= 1.6 && this.props.reports.PL_QofL1_COMB[this.props.collection] !== 999)) &&
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
								<em><b>Feeling left out.</b></em> Talk to others to let them know what’s important to you.
							</Typography>
						} */}
					</>
				}
				<br />
			</div>
		)
	}
}