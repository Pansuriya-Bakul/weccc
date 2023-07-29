import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Import your components
import Login from './views/Authentication/Login';
import Dashboard from './views/Dashboard/Dashboard';
import Register from './views/Authentication/Register';

class AppRouter extends Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/register" component={Register} />
                    <Route path="/" render={() => (
                        this.props.authenticated ?
                            <Dashboard
                                appState={this.props.appState}
                                Logout={this.props.Logout}
                                CheckAuthenticationValidity={this.props.CheckAuthenticationValidity}
                                UpdateUser={this.props.UpdateUser}
                            />
                            :
                            <Login
                                Login={this.props.Login}
                            />
                    )} />
                </Switch>
            </Router>
        );
    }
}

export default AppRouter;