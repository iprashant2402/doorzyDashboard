import React from "react";
import { observer } from "mobx-react";
import { mainStore } from "../../stores/mainStore";
import { logout } from "../../api-functions/login_api";
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
  CardTitle,
  Progress,
  Tooltip
} from "shards-react";
import { Link } from "react-router-dom";
import firebase from "firebase";
import "firebase/firestore";
import "../../App.css";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      succOrderCount: 0,
      unsuccOrderCount: 0,
      userCount: 0,
      tooltipOpen: false
    };
  }

  toggleNavbar = () => {
    this.setState({
      ...this.state,
      ...{
        collapseOpen: !this.state.collapseOpen
      }
    });
  }

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
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

  componentDidMount() {
    const user_count_ref = firebase
      .firestore()
      .collection("counters")
      .doc("user_count");
    const succ_count_ref = firebase
      .firestore()
      .collection("counters")
      .doc("succ_order_count");
    const unsucc_count_ref = firebase
      .firestore()
      .collection("counters")
      .doc("unsucc_order_count");
    const thisRef = this;
    user_count_ref.onSnapshot(function(doc) {
      thisRef.setState({
        userCount: doc.data().count
      });
    });

    succ_count_ref.onSnapshot(function(doc) {
      thisRef.setState({
        succOrderCount: doc.data().count
      });
    });

    unsucc_count_ref.onSnapshot(function(doc) {
      thisRef.setState({
        unsuccOrderCount: doc.data().count
      });
    });
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

  render() {
    return (
      <Container className="body-container">
        <Navbar type="dark" className="body-container" expand="md">
          <NavbarBrand href="#">doorzy</NavbarBrand>
          <NavbarToggler onClick={()=>this.toggleNavbar()} />

          <Collapse open={this.state.collapseOpen} navbar>
            <Nav navbar>
              <NavItem>
                <Link className="nav-item" to="/app/overview">
                  Push Notifications
                </Link>
              </NavItem>
              <NavItem>
                <Link className="nav-item" to="/app/dashboard">
                  Overview
                </Link>
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
        <Container>
          <Row>
            <Col>
              <Card className="dark-card">
                <CardBody className="center-div">
                  <CardTitle className="counter-title">USERS</CardTitle>
                  <p className="large-count">{this.state.userCount}</p>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className="dark-card">
                <CardBody className="center-div">
                  <CardTitle className="counter-title">ORDERS</CardTitle>
                  <p className="large-count" id="orderTooltip">
                    {this.state.succOrderCount + this.state.unsuccOrderCount}
                  </p>
                  <Tooltip open={this.state.tooltipOpen} target="#orderTooltip" toggle={()=>{this.toggleTooltip()}}>
                    Delivered - {this.state.succOrderCount}  Cancelled - {this.state.unsuccOrderCount}
                  </Tooltip>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
            <Card className="dark-card">
                <CardBody className="center-div">
                  <CardTitle className="counter-title">Target - 500 USERS</CardTitle>
                  <Progress theme="success" value={this.state.userCount} max={500}/>
                </CardBody>
              </Card>
            </Col>
            <Col>
            <Card className="dark-card">
                <CardBody className="center-div">
                  <CardTitle className="counter-title">Target - 1000 ORDERS</CardTitle>
                  <Progress theme="success" value={this.state.unsuccOrderCount+this.state.succOrderCount} max={1000}/>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
}

export default observer(Dashboard);
