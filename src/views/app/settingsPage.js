import React from "react";
import { observer } from "mobx-react";
import { mainStore } from "../../stores/mainStore";
import { logout } from "../../api-functions/login_api";
import Switch from "react-switch";
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
  Tooltip,
  ListGroup,
  ListGroupItem,
  FormRadio
} from "shards-react";
import { Link } from "react-router-dom";
import firebase from "firebase";
import "firebase/firestore";
import "../../App.css";

class OutletSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseOpen: false,
      tooltipOpen: false,
      outlets: [],
      menu: [],
      selectedOutletId: ""
    };
  }

  toggleNavbar = () => {
    this.setState({
      ...this.state,
      ...{
        collapseOpen: !this.state.collapseOpen
      }
    });
  };

  toggleTooltip = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  };

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
    const thisRef = this;
    const outlets_ref = firebase.firestore().collection("outlets");
    outlets_ref
      .onSnapshot(function(snap) {
        if (snap) {
          var arr = [];
          snap.forEach(function(outlet) {
            arr.push(outlet.data());
          });
          thisRef.setState({
            outlets: arr
          });
        }
      });
      
  }

  handleItemStatus = async (id,value) =>{
    const thisRef = this;
    const db = firebase.firestore().collection("menus").doc(this.state.selectedOutletId).collection("items").doc(id);
    return db.update({active : !value}).then(function(){
      thisRef.fetchMenu(thisRef.state.selectedOutletId);
    }).catch(err => alert(err));
  }

  handleOutletStatus = async (id,value) =>{
    const thisRef = this;
    const db = firebase.firestore().collection("outlets").doc(id);
    return db.update({active : !value}).then(function(){

    }).catch(err => alert(err));
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

  fetchMenu = async (id) => {
      this.setState({
        selectedOutletId : id
      });
      const db = firebase.firestore().collection("menus").doc(id).collection("items");
      const thisRef = this;
      db.get().then((snap=>{
          if(snap){
              var arr = [];
              snap.forEach(function(item){
                if(item.data().active===true || item.data().active===false){
                  arr.push(item.data());  
                }  
                else{
                  var doc = item.data();
                  doc.active = true;
                  arr.push(doc);
                }
              });
              thisRef.setState({
                menu : arr
              });
          }
      })).catch(err => console.log(err));
  }

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
    const outletList = this.state.outlets.map((l, i) => (
      <ListGroupItem onClick={()=>{
          this.fetchMenu(l.id)
      }} action={true} className="dark-bg" key={i}>
        {l.name}
        <Switch onChange={e => {this.handleOutletStatus(l.id,l.active)}} checked={l.active}/>
      </ListGroupItem>
    ));

    const menuList = this.state.menu.map((l,i) => (
        <ListGroupItem className="dark-bg" key={i}>
            {l.name}
            <Switch onChange={e => {this.handleItemStatus(l.id,l.active)}} checked={l.active}/>
        </ListGroupItem>
    ));
    return (
      <Container className="body-container">
        <Navbar type="dark" className="body-container" expand="md">
          <NavbarBrand href="#">doorzy</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} />

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
                <Link className="nav-item" to="/app/outletSettings">
                  Outlet Settings
                </Link>
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
          <Row>
            <Col>
              <Card className="dark-card">
                <CardBody>
                    <ListGroup>
                        {outletList}
                    </ListGroup>
                </CardBody>
              </Card>
            </Col>
            <Col>
              <Card className="dark-card">
                <CardBody>
                <ListGroup>
                        {menuList}
                </ListGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
    );
  }
}

export default observer(OutletSettings);
