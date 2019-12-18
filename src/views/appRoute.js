import React from "react";
import { observer } from "mobx-react";
import ".././css/custom-theme.scss";
import {Switch,Route,Redirect} from 'react-router-dom';
import OverviewPage from './app/overviewPage';
import Dashboard from './app/dashboard';
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

const AppRoute = ({match},props) => {
    const user = mainStore.uid;
  return (
    <Switch>
        <Route exact path={`${match.path}`} render={
            ()=>(user?(<Redirect to={`${match.path}/dashboard`}/>):(<Redirect to="/auth"/>))
        }/>
        <Route path={`${match.path}/overview`} render={
            ()=>(user?(<OverviewPage/>):(<Redirect to="/auth"/>))
        } />
        <Route path={`${match.path}/dashboard`} render={
            ()=>(user?(<Dashboard/>):(<Redirect to="/auth"/>))
        } />
        <Route component={NoMatch}/>
    </Switch>
  );
}

export default observer(AppRoute);
