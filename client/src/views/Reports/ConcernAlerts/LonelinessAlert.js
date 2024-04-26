import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';  //h1, p replacement Tag
import Grid from '@material-ui/core/Grid';
import { ListItem } from '@material-ui/core';

export default class LonelinessAlert extends Component {
	constructor(props) {
		super(props);
		this.state = {
			redAlert: false,
			yellowAlert: false,
		};
	}

	textBgRed = { backgroundColor: this.props.colors.red };
	textBgYellow = { backgroundColor: this.props.colors.yellow };

	componentDidMount() {
		const { reports, collection } = this.props;

		// Check conditions for Red Flag
		if (
			reports.PL_QofL1_COMB_often_count &&
			reports.PL_QofL1_COMB_often_count[collection] !== undefined &&
			reports.PL_QofL1_COMB_often_count[collection] > 0 &&
			reports.PL_QofL1_COMB_often_count[collection] !== 999
		) {
			this.setState({ redAlert: true });
		}

		// Check conditions for Yellow Flag
		if (
			reports.PL_QofL1_COMB_often_count &&
			reports.PL_QofL1_COMB_often_count[collection] !== undefined &&
			reports.PL_QofL1_COMB_sometimes_count &&
			reports.PL_QofL1_COMB_sometimes_count[collection] !== undefined &&
			reports.PL_QofL1_COMB[collection] !== undefined &&
			reports.PL_QofL1_COMB_sometimes_count[collection] >= 2 &&
			reports.PL_QofL1_COMB_sometimes_count[collection] !== 999 &&
			reports.PL_QofL1_COMB[collection] !== 999
		) {
			this.setState({ yellowAlert: true });
		}
	}

	render() {
		return (
			<Grid container item xs={12} spacing={2}>
				<Grid item xs={2}>
					<Typography variant="h5" color="inherit" align="left" gutterBottom>
						Loneliness
					</Typography>
				</Grid>

				{/* Red Flag */}
				{this.state.redAlert === false ?
					<Grid item xs={5}>
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
								None
							</Typography>
						</ListItem>
					</Grid>
					: <Grid item xs={5}>
						{/* Feel isolated, left, out, lack companions <-> answer often for 1*/}
						{this.props.reports.PL_QofL1_COMB_often_count && this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] !== undefined && this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] > 0 && this.props.reports.PL_QofL1_COMB_often_count[this.props.collection] !== 999 &&
							<ListItem style={this.textBgRed}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You often feel you lack companions, feel left out or feel isolated from others
								</Typography>
							</ListItem>
						}
					</Grid>}

				{/* Yellow Flag */}
				{this.state.yellowAlert === false ?
					<Grid item xs={5}>
						<ListItem>
							<Typography variant="body1" color="inherit" align="left" gutterBottom>
								None
							</Typography>
						</ListItem>
					</Grid>
					: <Grid item xs={5}>
						{/* Feel isolated, left, out, lack companions <-> score 1.6 && 1+ [sometimes] */}
						{(this.props.reports.PL_QofL1_COMB_sometimes_count && this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] !== undefined && this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] > 0 && this.props.reports.PL_QofL1_COMB_sometimes_count[this.props.collection] !== 999) &&
							(this.props.reports.PL_QofL1_COMB && this.props.reports.PL_QofL1_COMB[this.props.collection] !== undefined && this.props.reports.PL_QofL1_COMB[this.props.collection] >= 1.6 && this.props.reports.PL_QofL1_COMB[this.props.collection] !== 999) &&
							<ListItem style={this.textBgYellow}>
								<Typography variant="body1" color="inherit" align="left" gutterBottom>
									You sometimes feel you lack companions, feel left out, or feel isolated from others
								</Typography>
							</ListItem>
						}
					</Grid>}
			</Grid>
		)
	}
}