import React from "react";
import AppRoute from ".././views/appRoute";
import AuthRoute from ".././views/authRoute";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect
} from "react-router-dom";
import {mainStore} from '.././stores/mainStore';
import NoMatch from '.././views/noMatch';

import { observer } from "mobx-react";
import firebase from 'firebase';

class Routes extends React.Component {

render(){
    return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => {
          return <Redirect to="/app" />;
        }}
      />
      <Route path="/auth" component={AuthRoute} />
      <Route path="/app" component={AppRoute} />
      <Route component={NoMatch}/>
    </Switch>
  );
    }
}

export default observer(Routes);
