import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Grid from '@material-ui/core/Grid';
import { ListItem } from '@material-ui/core';

export default class SupportAvailabilityAlert extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redAlert: false,
			yellowAlert: false,
		};
	}

	componentDidMount() {
		const { reports, collection } = this.props;

		if (reports.PSS_QofL1_COMB && reports.PSS_QofL1_COMB[collection] !== undefined) {
			// Check conditions for Red Flags
			if (
				reports.PSS_QofL1_COMB[collection] >= 2.5 &&
				reports.PSS_QofL1_COMB[collection] <= 3
			) {
				this.setState({ redAlert: true });
			}

			// Check conditions for Yellow Flags
			if (
				reports.PSS_QofL1_COMB[collection] >= 1.6 &&
				reports.PSS_QofL1_COMB[collection] <= 2.4
			) {
				this.setState({ yellowAlert: true });
			}
		}
	}

	render() {
		return (
			<Grid container item xs={12} spacing={2}>
				<Grid item xs={2}>
					<Typography variant="h5" color="inherit" align="left" gutterBottom>
						Availability of Support
					</Typography>
				</Grid>

				{/* Red Flags */}
				{this.state.redAlert === false ?
					<Grid item xs={5}>
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
								None
							</Typography>
						</ListItem>
					</Grid>
					: <Grid item xs={5}>
						{/* Average of answers scored 0-3 trigger if PSS_QofL1_COMB 2.5-3 */}
						{this.props.reports.PSS_QofL1_COMB && this.props.reports.PSS_QofL1_COMB[this.props.collection] !== undefined && this.props.reports.PSS_QofL1_COMB[this.props.collection] >= 2.5 && this.props.reports.PSS_QofL1_COMB[this.props.collection] <= 3 &&
							<ListItem>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You hardly ever feel you have the social support you need from your family and friends.
								</Typography>
							</ListItem>
						}
					</Grid>}

				{/* Yellow Flags */}
				{this.state.yellowAlert === false ?
					<Grid item xs={5}>
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
								None
							</Typography>
						</ListItem>
					</Grid>
					: <Grid item xs={5}>
						{/* Average of answers scored 0-3 trigger if PSS_QofL1_COMB 1.6-2.4 */}
						{this.props.reports.PSS_QofL1_COMB && this.props.reports.PSS_QofL1_COMB[this.props.collection] !== undefined && this.props.reports.PSS_QofL1_COMB[this.props.collection] >= 1.6 && this.props.reports.PSS_QofL1_COMB[this.props.collection] <= 2.4 &&
							<ListItem>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You only sometimes feel you have the social support you need from your family and friends.
								</Typography>
							</ListItem>
						}
						{/* Comfortable asking for help alert for not comfortable(3) or only sometimes(2) */}
						{/* {this.props.reports.AFH_QofL1_SD[this.props.collection] == 2 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are only sometimes comfortable asking for help.		
							</Typography>
						</ListItem>
					}
					{this.props.reports.AFH_QofL1_SD[this.props.collection] == 3 &&
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
							You are not comfortable asking for help.		
							{this.props.reports.AFH_QofL1_SD[this.props.collection] }
							</Typography>
						</ListItem>
					} */}
					</Grid>}
			</Grid>
		)
	}
}