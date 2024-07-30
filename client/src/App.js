// import React, { Component } from 'react';

// import AppRouter from './AppRouter';

// // ==================== Helpers ====================
// import validateToken from './helpers/authorization/validateToken';
// import get from './helpers/common/get';

// // ==================== Components ====================
// import Login from './views/Authentication/Login';
// import Dashboard from './views/Dashboard/Dashboard';
// import Theme from './Theme';

// // ==================== MUI ====================
// import CircularProgress from '@material-ui/core/CircularProgress'
// import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';

// // ==================== Colors ====================
// import green from '@material-ui/core/colors/green';

// const styles = {
// 	spinner: {
// 		color: green[500],
// 		position: 'absolute',
// 		left: '50%',
// 		top: '25%',
// 		marginTop: -12,
// 		marginLeft: -12,
// 	}
// }

// window.onbeforeunload = (event) => {
// 	window.localStorage.clear();
// 	return ''; // Legacy method for cross browser support
// };

// class App extends Component {
// 	constructor(props) {
// 		super(props);

// 		this.state = {
// 			_id: null,
// 			name: null,
// 			role: null,
// 			patients: [],
// 			workers: [],
// 			token: null,
// 			facilityId: null,
// 			facilityName: null,
// 			authenticated: false,
// 			render: true
// 		};
// 	}

// 	componentDidMount = () => {
// 		this.CheckAuthentication();
// 	}

// 	CheckAuthentication = () => {
// 		let { token } = this.state;

// 		if (token === null || token === undefined || token === '') {
// 			var _id = localStorage.getItem('_id');
// 			var name = localStorage.getItem('name');
// 			var role = localStorage.getItem('role');
// 			var patients = JSON.parse(localStorage.getItem('patients'));
// 			var workers = JSON.parse(localStorage.getItem('workers'));
// 			var facilityId = localStorage.getItem('facilityId');
// 			var facilityName = localStorage.getItem('facilityName');
// 			var _token = localStorage.getItem('token');

// 			if (_id == null || name == null || role == null || patients == null || workers == null || _token == null || facilityId == null || facilityName == null) {
// 				this.Logout();
// 			}
// 			else {
// 				this.setState({
// 					_id: _id,
// 					name: name,
// 					role: role,
// 					patients: patients,
// 					workers: workers,
// 					facilityId: facilityId,
// 					facilityName: facilityName,
// 					token: _token
// 				}, () => this.CheckAuthenticationValidity(tokenValid => {
// 					if (tokenValid) {
// 						this.setState({
// 							authenticated: true,
// 							render: true
// 						});
// 					}
// 					else {
// 						this.Logout();
// 					}
// 				}));
// 			}
// 		}
// 		else {
// 			this.CheckAuthenticationValidity(tokenValid => {
// 				if (!tokenValid) {
// 					this.Logout();
// 				}
// 			})
// 		}
// 	}

// 	CheckAuthenticationValidity = (callback) => {
// 		let { token } = this.state;

// 		validateToken(token, (error, response) => {
// 			if (error) {
// 				callback(false);
// 				this.Logout();
// 			}
// 			else {
// 				if (response.status === 200 || response.status === 304) {
// 					callback(true);
// 				}
// 				else {
// 					callback(false);
// 					this.Logout();
// 				}
// 			}
// 		});
// 	}

// 	UpdateUser = () => {
// 		let { _id, token } = this.state;

// 		return get('users/' + _id, token, (error, response) => {
// 			if (error) return;
// 			if (response.status === 200 || response.status === 304) {
// 				localStorage.setItem("patients", JSON.stringify(response.data.user.patients));
// 				localStorage.setItem("workers", JSON.stringify(response.data.user.workers));
// 			}
// 		});
// 	}

// 	Login = (token, user) => {
// 		const timestamp = user.updatedAt;
// 		const date = new Date(timestamp);
// 		var datestring = date.toLocaleString().slice(0,-6) + date.toLocaleString().slice(-3);
// 		localStorage.setItem("last_modified", datestring);
// 		localStorage.setItem("_id", user._id);
// 		localStorage.setItem("name", user.info.name);
// 		localStorage.setItem("role", user.role);
// 		localStorage.setItem("patients", JSON.stringify(user.patients));
// 		localStorage.setItem("workers", JSON.stringify(user.workers));
// 		localStorage.setItem("facilityId", user.facilityId._id);
// 		localStorage.setItem("facilityName", user.facilityId.name);
// 		localStorage.setItem("token", token);

// 		this.setState({
// 			_id: user._id,
// 			name: user.info.name,
// 			role: user.role,
// 			patients: user.patients,
// 			workers: user.workers,
// 			facilityId: user.facilityId._id,
// 			facilityName: user.facilityId.name,
// 			token: token,
// 			authenticated: true,
// 			last_modified: datestring
// 		});
// 	}

// 	Logout = () => {
// 		localStorage.removeItem("_id");
// 		localStorage.removeItem("name");
// 		localStorage.removeItem("role");
// 		localStorage.removeItem("patients");
// 		localStorage.removeItem("workers");
// 		localStorage.removeItem("facilityId");
// 		localStorage.removeItem("facilityName");
// 		localStorage.removeItem("token");
// 		localStorage.removeItem("last_modified");

// 		this.setState({
// 			_id: null,
// 			role: null,
// 			name: null,
// 			token: null,
// 			patients: null,
// 			workers: null,
// 			authenticated: false,
// 			render: true,
// 			last_modified: null
// 		});

// 		if (window.location.pathname != '/') {
// 			window.history.replaceState(null, "Login", "/");
// 		}
// 	}

// 	render() {
// 		let { classes } = this.props;
// 		let { authenticated, render } = this.state;

// 		// if (render) {
// 		// 	if (authenticated) {
// 		// 		return (
// 		// 			<MuiThemeProvider theme={Theme}>
// 		// 				<Dashboard
// 		// 					appState={this.state}
// 		// 					Logout={this.Logout}
// 		// 					CheckAuthenticationValidity={this.CheckAuthenticationValidity}
// 		// 					UpdateUser={this.UpdateUser}
// 		// 				/>
// 		// 			</MuiThemeProvider>
// 		// 		);
// 		// 	}
// 		// 	else {
// 		// 		return (
// 		// 			<Login
// 		// 				Login={this.Login}
// 		// 			/>
// 		// 		);
// 		// 	}
// 		// }
// 		if (render) {
// 			return (
// 				<>
// 					{authenticated ? (
// 						<MuiThemeProvider theme={Theme}>
// 							<AppRouter
// 								appState={this.state}
// 								Logout={this.Logout}
// 								CheckAuthenticationValidity={this.CheckAuthenticationValidity}
// 								UpdateUser={this.UpdateUser}
// 								authenticated={authenticated}
// 							/>
// 						</MuiThemeProvider>
// 					) : (
// 						<AppRouter
// 							Login={this.Login}
// 						/>
// 					)}

// 				</>
// 			);
// 		}
// 		else {
// 			return (
// 				<div align="center">
// 					<CircularProgress className={classes.spinner} />
// 				</div>
// 			);
// 		}
// 	}
// }

// export default withStyles(styles)(App);




import React, { Component } from 'react';
import AppRouter from './AppRouter';
import validateToken from './helpers/authorization/validateToken';
import get from './helpers/common/get';
import Login from './views/Authentication/Login';
import Dashboard from './views/Dashboard/Dashboard';
import Theme from './Theme';
import CircularProgress from '@material-ui/core/CircularProgress';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

const styles = {
  spinner: {
    color: green[500],
    position: 'absolute',
    left: '50%',
    top: '25%',
    marginTop: -12,
    marginLeft: -12,
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: null,
      name: null,
      role: null,
      patients: [],
      workers: [],
      token: null,
      facilityId: null,
      facilityName: null,
      authenticated: false,
      render: false
    };
  }

  componentDidMount() {
    this.initializeStateFromLocalStorage();
  }

  initializeStateFromLocalStorage = () => {
    const _id = localStorage.getItem('_id');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');
    const patients = JSON.parse(localStorage.getItem('patients'));
    const workers = JSON.parse(localStorage.getItem('workers'));
    const facilityId = localStorage.getItem('facilityId');
    const facilityName = localStorage.getItem('facilityName');
    const token = localStorage.getItem('token');

    if (_id && name && role && patients && workers && facilityId && facilityName && token) {
      this.setState({
        _id,
        name,
        role,
        patients,
        workers,
        facilityId,
        facilityName,
        token,
        render: true
      }, this.CheckAuthentication);
    } else {
      this.setState({ render: true });
    }
  }

  CheckAuthentication = () => {
    const { token } = this.state;
    
    if (token) {
      this.CheckAuthenticationValidity((tokenValid) => {
        if (tokenValid) {
          this.setState({ authenticated: true });
        } else {
          this.Logout();
        }
      });
    } else {
      this.Logout();
    }
  }

  CheckAuthenticationValidity = (callback) => {
    const { token } = this.state;

    validateToken(token, (error, response) => {
      if (error || !(response.status === 200 || response.status === 304)) {
        callback(false);
      } else {
        callback(true);
      }
    });
  }

  UpdateUser = () => {
    const { _id, token } = this.state;

    return get(`users/${_id}`, token, (error, response) => {
      if (error) return;
      if (response.status === 200 || response.status === 304) {
        localStorage.setItem("patients", JSON.stringify(response.data.user.patients));
        localStorage.setItem("workers", JSON.stringify(response.data.user.workers));
      }
    });
  }

  Login = (token, user) => {
    const timestamp = user.updatedAt;
    const date = new Date(timestamp);
    const datestring = date.toLocaleString().slice(0, -6) + date.toLocaleString().slice(-3);
    
    localStorage.setItem("last_modified", datestring);
    localStorage.setItem("_id", user._id);
    localStorage.setItem("name", user.info.name);
    localStorage.setItem("role", user.role);
    localStorage.setItem("patients", JSON.stringify(user.patients));
    localStorage.setItem("workers", JSON.stringify(user.workers));
    localStorage.setItem("facilityId", user.facilityId._id);
    localStorage.setItem("facilityName", user.facilityId.name);
    localStorage.setItem("token", token);

    this.setState({
      _id: user._id,
      name: user.info.name,
      role: user.role,
      patients: user.patients,
      workers: user.workers,
      facilityId: user.facilityId._id,
      facilityName: user.facilityId.name,
      token: token,
      authenticated: true,
      last_modified: datestring,
      render: true
    });
  }

  Logout = () => {
    localStorage.removeItem("_id");
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("patients");
    localStorage.removeItem("workers");
    localStorage.removeItem("facilityId");
    localStorage.removeItem("facilityName");
    localStorage.removeItem("token");
    localStorage.removeItem("last_modified");

    this.setState({
      _id: null,
      role: null,
      name: null,
      token: null,
      patients: [],
      workers: [],
      facilityId: null,
      facilityName: null,
      authenticated: false,
      render: true,
      last_modified: null
    });

    if (window.location.pathname !== '/') {
      window.history.replaceState(null, "Login", "/");
    }
  }

  render() {
    const { classes } = this.props;
    const { authenticated, render } = this.state;

    if (!render) {
      return (
        <div align="center">
          <CircularProgress className={classes.spinner} />
        </div>
      );
    }

    return (
      <>
        {authenticated ? (
          <MuiThemeProvider theme={Theme}>
            <AppRouter
              appState={this.state}
              Logout={this.Logout}
              CheckAuthenticationValidity={this.CheckAuthenticationValidity}
              UpdateUser={this.UpdateUser}
              authenticated={authenticated}
            />
          </MuiThemeProvider>
        ) : (
          <AppRouter
            Login={this.Login}
          />
        )}
      </>
    );
  }
}

export default withStyles(styles)(App);
