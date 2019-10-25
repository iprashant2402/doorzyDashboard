import React from "react";
import { observer } from "mobx-react";
import "../.././css/custom-theme.scss";
import { proceedLogin } from "../.././api-functions/login_api";
import {mainStore} from '../.././stores/mainStore';

 class LoginPage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
          username : '',
          password : '',
          error : ''
      };
      this.handleLogin = this.handleLogin.bind(this); 
    }

    handleLogin = () => {
        if(proceedLogin(this.state.username,this.state.password)){
            console.log("LOGGED IN");
        }
        else{
            console.log("Unable to login");
        }
    }

    render() {
      return (
        <div className="container">
          <div className="col-md-4 offset-md-4 col-sm-12 border my-5 pb-5 pt-3 rounded">
            <div className="row">
              <div className="col-md-6 offset-md-3 col-sm-12">
                <img
                  src={require("../.././images/logo_alternate_plain.png")}
                  className="logo-full"
                  alt="Virestore Logo"
                />
              </div>
            </div>
            <div className="row p-2 mb-2">
              <div className="col-md-12 col-sm-12">
                <h4 className="text-center">Sign In</h4>
                <p className="text-center text-secondary">
                  Continue to your Virestore Seller Account
                </p>
              </div>
            </div>
            <div className="row p-2">
              <div className="col-sm-12 col-md-8 offset-md-2 px-2">
                <input
                  type="email"
                  value={this.state.username}
                  className="login-form"
                  placeholder="Email"
                  onChange={(e)=>{this.setState({username : e.target.value})}}
                />
              </div>
            </div>
            <div className="row p-2">
              <div className="col-sm-12 col-md-8 offset-md-2 px-2">
                <input
                  type="password"
                  className="login-form"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={(e)=>{this.setState({password : e.target.value})}}
                />
              </div>
            </div>
            <div className="row p-2 mt-3">
              <div className="col-sm-12 col-md-8 offset-md-2 px-2">
                <button
                  type="button"
                  className="button-primary bg-success btn-block"
                  onClick={() => {
                    this.handleLogin();
                  }}
                >
                  Login
                </button>
              </div>
            </div>
            <div className="row p-2 fixed-bottom">
              <div className="col-sm-12 col-md-8 offset-md-2 px-2">
                <p className="text-secondary text-center">
                  &copy; Copyright 2019. Virestore Inc.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

export default observer(LoginPage);
