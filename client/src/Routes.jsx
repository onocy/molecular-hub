import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

// Views
import Dashboard from 'Dashboard';
import Account from 'Account';
import SignUp from 'SignUp';
import SignIn from 'SignIn';
import UnderDevelopment from 'UnderDevelopment';
import NotFound from 'NotFound';

function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem('isAuthenticated') ? (<Component {...props} />) : (<Redirect to= "/sign-in"/>)
      }
    />
  );
}

export default class Routes extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from="/" to="/sign-in" />
        <Route component={Dashboard} exact path="/dashboard" />
        <Route component={Account} exact path="/account" />
        <Route component={SignUp} exact path="/sign-up" />
        <Route component={SignIn} exact path="/sign-in" />
        <Route component={UnderDevelopment} exact path="/under-development" />
        <Route component={NotFound} exact path="/not-found" />
        <Redirect to="/not-found" />
      </Switch>
    );
  }
}
