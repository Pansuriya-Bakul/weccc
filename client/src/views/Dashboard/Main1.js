import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import get from '../../helpers/common/get';
import { Link } from 'react-router-dom';
// ==================== MUI ====================
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Dashboard from '@material-ui/icons/Dashboard';
import { CircularProgress } from '@material-ui/core';


// const [currentPatient, setCurrentPatient] = useState(
// localStorage.getItem("_id");
//   );

const styles = theme => ({
	bullet: {
		display: 'inline-block',
		margin: '0 2px',
		transform: 'scale(0.8)'
	}
});

class Main extends Component {
	constructor(props) {
		super(props);

		this.state = {
			render: false,
			clientData: [],
			clientSurvey: ''
		};
	}

	checkAuth = () => {
		setTimeout(() => {
			this.props.ToggleDrawerClose();
			this.setState({
				render: true
			});
			this.props.CheckAuthenticationValidity(tokenValid => {
				if (tokenValid) {
					this.setState({
						render: true
					});
				}
			});
		}, 200);
	};

	checkClientSurveys = () => {
		let { appState } = this.props;

		const url = `users/client/${localStorage.getItem("_pid")}`;
		const token = appState.token;

		get(url, token, (error, response) => {
			if (error) return;

			if (response.status === 200) {
				// console.log(response.data.surveys[0]._id);
				// console.log(response);
				this.setState({ clientData: response.data });
				this.setState({ clientSurvey: response.data.surveys });
				this.setState({ clientCompletedSurvey: response.data.completedSurveys });
				this.setState({ clientNotCompletedSurvey: response.data.notCompletedSurveys });
				// console.log(this.state.clientData.in);
				this.setState({ clientName: this.state.clientData.info.name });
				// console.log(this.state.clientName);

			}
		}); // call the get request.
	};

	componentDidMount = () => {
		let { appState } = this.props;
		this.classes = styles();
		this.bull = <span className={this.classes.bullet}>•</span>;

		if (appState.role === 'Volunteer') {
			this.checkClientSurveys();
		}

		this.checkAuth();
	};


	render() {
		let { appState, classes } = this.props;
		// console.log(this.state.clientNotCompletedSurvey[0][0]);

		if (this.render) {
			return (
				<Grid
					container
					className={classes.rootGrid}
					direction="row"
					justifyContent="flex-start"
					alignItems="stretch"
					spacing={2}
				>
					<Grid item xs={3}>
						<Box mx={1} my={1}>
							<Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
								<Grid item>
									<Dashboard color="primary" />
								</Grid>
								<Grid item xs>
									<Typography variant="h5" color="secondary" align="left" gutterBottom={false}>
										Dashboard
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</Grid>
					<Grid item xs={9}>
						<Box mx={1} my={1}>
							{/* <AlertMessage alert={alert} setParentAlert={setAlert} /> */}
						</Box>
					</Grid>
					<Grid item xs={12}>
						<Card raised={true}>
							<CardContent>
								<Box mx={1} my={1} boxShadow={0}>
									<Grid container direction="column" justifyContent="flex-start" alignItems="stretch" >
										<Grid item xs={12}>
											<Typography variant="h5" component="h1">
												Welcome back, {this.state.clientName}
											</Typography>
										</Grid>
										<br/>
										{(this.state.clientCompletedSurvey !== undefined && this.state.clientCompletedSurvey !==[]) ? 
										(<Typography variant="subtitle2" component="h2">Completed Survey(s)</Typography>) : ''}
										<br/>
										<Grid item xs={12}>
											{(this.state.clientCompletedSurvey !== undefined) ? 
											Object.keys(this.state.clientCompletedSurvey).map(key => {
												return (
													<Grid item xs={12} style={{ border: "1px solid grey" }}>
														<Box m={2} justifyContent="center" alignItems="center">
															<Typography variant="body2" component="h2">
																{this.state.clientCompletedSurvey[key]}
															</Typography>
														</Box>
													</Grid>
												);
											}) : ''}
											
										</Grid>
									</Grid>
								</Box>
							</CardContent>
						</Card>
					</Grid>
					{appState.role === 'Volunteer' && (
						<Grid item xs={12}>
							<Card raised={true}>
								<CardContent>
									<Box mx={1} my={1} boxShadow={0}>
										<Grid container direction="column" justifyContent="flex-start" alignItems="stretch" spacing={1}>
											<Grid item xs={12}>
												<Typography variant="subtitle2" component="h2">
													Survey(s) to complete
												</Typography>
											</Grid>
											<Grid item xs={12}>
												<Typography variant="body2" component="h2">

												{this.state.clientData.message ? (
													<p>{this.state.clientData.message}</p>
												):( '')}
												{(this.state.clientNotCompletedSurvey !== '' && this.state.clientNotCompletedSurvey !== undefined) ? (
													Object.keys(this.state.clientNotCompletedSurvey).map(key=> {
														return(
													<>
														<Grid item xs={12}>
															<Tooltip
																placement="bottom"
																title="Edit Chapter"
															>
																<Box m={1} pt={1}>
																<Button 
																	size="small" 
																	variant="contained" 
																	color="primary"
																	startIcon={<EditIcon />}
																	component={Link}
																	to={`/administration/booklets/user/view/${this.state.clientNotCompletedSurvey[key][0][0]}`}
																>
																	{/* View Survey {parseInt(key, 10)+1} :  */}
																	{this.state.clientNotCompletedSurvey[key][1][0]}
																</Button>
																</Box>
															</Tooltip>
														</Grid>
													</>
														);
													})
												) : (
													''
												)}
												</Typography>
											</Grid>
										</Grid>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					)}
				</Grid>
			);
		} else {
			return <CircularProgress />;
		}
	}
}

export default withStyles(styles)(Main);