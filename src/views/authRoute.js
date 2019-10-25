import React from "react";
import { observer } from "mobx-react";
import ".././css/custom-theme.scss";
import {Switch,Route,Redirect} from 'react-router-dom';
import LoginPage from './auth/login';
import NoMatch from './noMatch';
import {mainStore} from '.././stores/mainStore';
import {
    LOGIN,
    SIGN_UP,
    MANAGE_ORDER,
    MY_ACCOUNT,
    ORDER_HISTORY,
    OVERVIEW,
    SETTINGS,
    TRACK_PAYMENT
    } from '.././routes/routes';

const AuthRoute = observer(({match},props) => {
    const user = mainStore.uid;
  return (
    <Switch>
        <Route exact path={`${match.path}`} render={
            ()=>(user?(<Redirect  to="/app" />):(<Redirect to={`${match.path}/login`}/>))
        }/>
        <Route path={`${match.path}/login`} render={
            ()=>(user?(<Redirect  to="/app" />):(<LoginPage/>))
        } />
        <Route component={NoMatch}/>
    </Switch>
  );
});

export default AuthRoute;
