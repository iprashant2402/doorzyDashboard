import React from "react";
import { observer } from "mobx-react";
import { mainStore } from "../.././stores/mainStore";
import { logout } from "../.././api-functions/login_api";
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  Button,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Alert,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  ListGroupItemText
} from "shards-react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import Switch from "react-switch";
import firebase from "firebase";
import "firebase/firestore";
import "../../App.css";

class OverviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedUsers: [],
      title: "",
      content: "",
      selectValue: [],
      collapseOpen: false,
      alert: false,
      recentUsers: []
    };
  }

  toggleNavbar() {
    this.setState({
      ...this.state,
      ...{
        collapseOpen: !this.state.collapseOpen
      }
    });
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

  componentDidMount() {
    const db = firebase.firestore().collection("users");
    const thisRef = this;
    db.get()
      .then(function(snap) {
        var arr = [];
        var recent = [];
        snap.forEach(function(doc) {
          arr.push(doc.data());
        });
        recent = arr;
        arr.sort(function(a,b){
          if(a.fname > b.fname){
            return 1;
          }
          if(a.fname < b.fname){
            return -1;
          }
          return 0;
        });
        recent.sort(function(a,b){
          return b.regTimestamp - a.regTimestamp;
        });
        recent = recent.slice(0,10);
        thisRef.setState({
          users: arr,
          recentUsers : recent
        });
      })
      .catch(err => console.log(err));
  }

  handleChange = e => {
    const temp = this.state.selectValue;
    if (temp.includes(e.target.value)) {
      this.setState({
        selectValue: temp.filter(x => x !== e.target.value)
      });
    } else {
      temp.push(e.target.value);
      this.setState({ selectValue: temp });
    }
    console.log(this.state.selectValue);
  };

  handleText = e => {
    this.setState(
      {
        [e.target.name]: e.target.value
      },
      () => console.log(this.state.title)
    );
  };

  postData = async (url, data) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        "Content-Type": "application/json"
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  };

  selectAll = () => {
    let temp = [];
    const users = this.state.users;
    for (var i = 0; i < users.length; i++) {
      temp.push(users[i].pushToken);
    }
    this.setState({
      selectValue: temp
    });
    console.log(this.state.selectValue);
  };

  handleSubmit = () => {
    const tokens = this.state.selectValue;
    const title = this.state.title;
    const content = this.state.content;
    const data = {
      tokens: tokens,
      title: title,
      content: content
    };
    const url = "https://powerful-wave-93367.herokuapp.com/selectedUsers";
    if (this.postData(url, data)) {
      console.log("SUCCESSFULLY SENT NOTIFICATIONS");
      this.setState({
        alert: true
      });
    }
  };

  render() {
    const userList = this.state.users.map((l, i) => (
      <option value={l.pushToken} key={i}>
        {l.fname} {l.lname}
      </option>
    ));
    const userList2 = this.state.recentUsers.map((l,i) => (
      <ListGroupItem className="dark-bg" key={i}>
  <ListGroupItemText>{l.fname} {l.lname}</ListGroupItemText>
      </ListGroupItem>
    ));
    if(this.state.alert){
      const alert = <Alert theme="success">Push Notifications successfully sent.</Alert>;
    }
    else{
      alert = null;
    }
    return (
      <Container className="body-container">
        <Navbar type="dark" className="body-container" expand="md">
          <NavbarBrand href="#">doorzy</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} />

          <Collapse open={this.state.collapseOpen} navbar>
            <Nav navbar>
              <NavItem>
                  <Link className="nav-item" to='/app/overview'>Push Notifications</Link>
              </NavItem>
              <NavItem>
              <Link className="nav-item" to='/app/dashboard'>Overview</Link>
              </NavItem>
              <NavItem>
              <Link className="nav-item" to='/app/outletSettings'>Outlet Settings</Link>
              </NavItem>
            </Nav>
            <Nav navbar className="ml-auto">
              <Button
                pill
                theme="danger"
                onClick={() => {
                  this.handleLogout();
                }}
              >
                Sign Out
              </Button>
            </Nav>
          </Collapse>
        </Navbar>
        <Container className="padding-vertical">
          <Card className="dark-card">
            <CardBody>
              <Row>
            <Col>
            <Row>
              <Col>
              <h6 className="orange-font">Select users :</h6>
              <select
                className="dark-input"
                size={21}
                multiple={true}
                value={this.state.selectValue}
                onChange={e => {
                  this.handleChange(e);
                }}
              >
                {userList}
              </select>
              </Col>
              </Row>
            <Row>
              <Col>
            <Button
              outline block squared theme="light"
                onClick={() => {
                  this.selectAll();
                }}
              >
                Select all users
              </Button>
              </Col>
              </Row>
            </Col>
            <Col>
            <Row>
              <Col>
              <h6 className="orange-font">Enter title :</h6>
              <input
                type="text"
                name="title"
                className="dark-input"
                value={this.state.title}
                onChange={e => this.handleText(e)}
              />
              <h6 className="orange-font">Enter content :</h6>
              <input
                type="text"
                name="content"
                className="dark-input"
                value={this.state.content}
                onChange={e => this.handleText(e)}
              />
              </Col>
              </Row>
              <Row>
              <Col>
              <Button
                squared
                block
                theme="success"
                onClick={() => {
                  this.handleSubmit();
                }}
              >
                Send
              </Button>
              <br/><br/>
              <h2>10 Recent Sign ups</h2>
              <ListGroup>
                  {userList2}
                </ListGroup>
              </Col>
              </Row>
            </Col>
            </Row>
            </CardBody>
          </Card>
          {/* <Card className="dark-card">
            <CardBody>
                <ListGroup>
                  {userList2}
                </ListGroup>
            </CardBody>
          </Card> */}
        </Container>
      </Container>
    );
  }
}

export default observer(OverviewPage);
