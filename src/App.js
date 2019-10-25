import React from "react";
import "./css/custom-theme.scss";
import { observer} from "mobx-react";
import history from './api-functions/history';
import Routes from "./routes/routesComponent";
import {mainStore} from './stores/mainStore';
import firebase from 'firebase';
import config from './firebaseConfig';

firebase.initializeApp(config);

class App extends React.Component{

  componentDidMount(props){
    firebase.auth().onAuthStateChanged(function(user){
      if(user){
        const uid = user.uid;
        mainStore.setUid(uid);
        history.push('/app');
      }
      else{
        mainStore.setUid(null);
        history.push('/auth');
      }
    });
  }

  render(){
    return(
      <Routes/>
    );
  }

}

export default observer(App);
