import React from "react";
import { observer } from "mobx-react";
import { mainStore } from "../.././stores/mainStore";
import { logout } from "../.././api-functions/login_api";
import firebase from "firebase";
import "firebase/firestore";

class OverviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedUsers : [],
      title : '',
      content : '',
      selectValue : []
    };
  }
  handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        mainStore.setUid(null);
      })
      .catch(err => console.log(err));
  };
  getExpoToken = () => {
    const db = firebase.firestore().collection("users");
    db.get()
      .then(function(snap) {
        var arr = [];
        snap.forEach(function(doc) {
          console.log(
            doc.data().fname +
              " " +
              doc.data().lname +
              " " +
              doc.data().pushToken
          );
          arr.push(doc.data().pushToken);
        });
        return arr;
      })
      .catch(err => {
        console.log(err);
        return err;
      });
  };

  componentDidMount(){
    const db = firebase.firestore().collection("users");
    const thisRef = this;
    db.get()
      .then(function(snap){
        var arr = [];
        snap.forEach(function(doc){
          arr.push(doc.data());
        });
        thisRef.setState({
          users : arr
        });
      }).catch(err=>console.log(err));
  }

  handleChange = (e) => {
    const temp = this.state.selectValue;
    if(temp.includes(e.target.value)){
      this.setState({
        selectValue : temp.filter(x => x !== e.target.value)
      });
    }
    else{
      temp.push(e.target.value);
      this.setState({selectValue:temp});
    }
    console.log(this.state.selectValue);
  }

  handleText = (e) =>{
    this.setState({
      [e.target.name] : e.target.value
    },()=>console.log(this.state.title));
  }

  postData =async (url, data) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      referrer: 'no-referrer', // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }

  handleSubmit = () => {
    const tokens = this.state.selectValue;
    const title = this.state.title;
    const content = this.state.content;
    const data = {
      tokens : tokens,
      title : title,
      content : content
    };
    const url = 'https://powerful-wave-93367.herokuapp.com/selectedUsers';
    if(this.postData(url,data)){
      console.log("SUCCESSFULLY SENT NOTIFICATIONS")
    }
  }

  render() {
    const userList = this.state.users.map((l,i)=>(
      <option value={l.pushToken} key={i}>{l.fname} {l.lname}</option>
    ));
    return (
      <div>
        <h1>doorzy Push Notification</h1>
        <p>Send push notifications to your users instantly.</p>
        <button
          onClick={() => {
            this.handleLogout();
          }}
        >
          Logout
        </button>
        <br></br>
        <hr></hr>
        <br></br>
        <h6>Select users :</h6>
        <select multiple={true} value={this.state.selectValue} onChange={(e)=>{this.handleChange(e)}}>{userList}</select>
        <br></br>
        <hr></hr>
        <br></br>
        <h6>ENTER NOTIFICATION TITLE :</h6>
        <input type="text" name="title" value={this.state.title} onChange={(e)=>this.handleText(e)} />
        <br></br>
        <br></br>
        <h6>ENTER NOTIFICATION CONTENT :</h6>
        <input type="text" name="content" value={this.state.content} onChange={(e)=>this.handleText(e)} />
        <br></br>
        <br></br>
        <button type="button" onClick={()=>{this.handleSubmit()}}>SEND NOTIFICATION</button>
      </div>
    );
  }
}

export default observer(OverviewPage);
