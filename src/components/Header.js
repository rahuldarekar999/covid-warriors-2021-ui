import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavItem, Modal, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";

import agent from '../agent';
// import Sidebar from 'react-side-bar';

// import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
// import 'react-pro-sidebar/dist/css/styles.css';


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";


import flag from '../assets/img/India-flag.png';

const LoggedOutView = (props) => {
  if (!props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Sign in
          </Link>
        </li>
      </ul>
    );
  }
  return null;
};

const LoggedInView = (props) => {
  if (props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/editor" className="nav-link">
            <i className="ion-compose"></i>&nbsp;New Post
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/settings" className="nav-link">
            <i className="ion-gear-a"></i>&nbsp;Settings
          </Link>
        </li>

        <li className="nav-item">
          <Link to={`/@${props.currentUser.username}`} className="nav-link">
            <img
              src={props.currentUser.image}
              className="user-pic"
              alt={props.currentUser.username}
            />
            {props.currentUser.username}
          </Link>
        </li>
      </ul>
    );
  }

  return null;
};

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      isFeedbackModalShow: false,
      name: '',
      message: '',
      isSending: false
    }
    // this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  showFeedbackModal = () => {
    this.setState({ isFeedbackModalShow: true });
  }

  hideFeedbackModal = () => {
    this.setState({ isFeedbackModalShow: false });
  }
  // onSetSidebarOpen(open) {
  // this.setState({ opened: !this.state.open });
  // }

  sendFeedback = () => {
    // if (!this.state.name) {
    //   alert("Please enter your name");
    //   return;
    // }
    if (!this.state.message) {
      alert("Please enter your feedback");
      return;
    }

    var that = this;

    var request = {
      name: (this.state.name) ? this.state.name : "Anonymous",
      message: this.state.message
    };

    this.setState({ isSending: true });
    Promise.resolve(agent.Tags.sendFeedback(request)).then(function (value) {
      that.setState({ isSending: false });
      if (value && value.status === "success") {
        that.setState({ ...that.state, name: '', message: '' });
        alert("Feedback Sent Successfully");
      }
      else {
        alert("There was an error while sending feedback, we are sorry for the inconvenience please try after some time.")
      }

    }, function (e) {

      that.setState({ isSending: false });
      console.error("Exception occured: ", e); // TypeError: Throwing
      alert("There was an error while sending feedback, we are sorry for the inconvenience please try after some time.")
    });


  }


  render() {

    // const [isVisible, setIsVisible] = useState(false);


    // const updateModal = (isVisible) => {
    //   // this.state.isVisible = isVisible;
    //   setIsVisible(isVisible);
    //   // this.forceUpdate();
    // }
    // menuIconClick = () => {
    //   //condition checking to change state from true to false and vice versa
    //   menuCollapse ? setMenuCollapse(false) : setMenuCollapse(true);
    // };

    return (
      <React.Fragment>
        {/* // <nav className="navbar navbar-light">
          //   <div className="container">

            //     <Link to="/" className="navbar-brand">
              //       {this.props.appName.toLowerCase()}
      //     </Link>

      //     <LoggedOutView currentUser={this.props.currentUser} />

      //     <LoggedInView currentUser={this.props.currentUser} />
      //   </div>
      // </nav> */}

        <header className={"topNav"}>
          <div className={"container"}>
            <div className={"py-3"} style={{ color: "#ffffff" }}>
              <Navbar expand="xs" bg="transparent" variant="dark" className={'p-0'}>
                <div className={'d-flex align-items-center justify-content-between flex-row w-100'}>
                  {/* <button class="navbar-toggler mr-0"
                    type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation"
                    onClick={() => this.setState({ opened: true })}>
                    <span class="navbar-toggler-icon"></span>
                  </button> */}
                  <span>
                    <NavLink className={'header-link'} to="/">
                      <span><img className={'img-fluid'} width={60} src={flag} /></span>
                      <span style={{ color: "#ffffff", fontSize: 28, marginLeft: 15 }}>Your Covid Assistant - Innovation That Helps</span>
                    </NavLink>
                  </span>

                  <Button
                    variant="primary"
                    onClick={this.showFeedbackModal}
                    className={"sendMessageBtn"}
                  >Feedback</Button>

                </div>
                {/* <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                  <Nav.Link href="#features">Features</Nav.Link>
                  <Nav.Link href="#pricing">Pricing</Nav.Link>
                  <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                    <NavDropdown.Item href="#action/3.1">
                      Action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">
                      Another action
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">
                      Something
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                      Separated link
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>

              </Navbar.Collapse> */}

              </Navbar>

              {/* Covid Warriors */}
              {/* <br /> */}
              {/* Automated Message Sending & Intelligent Reading */}
              {/* <br /> */}
              {/* (Shows only the percived positive messages & filters, no reponse or negavite messages) */}
              {/* <br /> */}
              {/* (WhatsApp only) */}
              {/* <small style={{display: 'block', fontSize: '10px'}}>Fight against Corona</small> */}
            </div>
          </div>

          {/* <nav className="navbar navbar-expand-lg navbar-transparent topNav">
          <div className={'container'}>
            <a className="navbar-brand" href="#" style={{ color: '#ffffff' }}>
              Covid Warriors - Innovation That Helps */}
          {/* Covid Warriors */}
          {/* <br />
          Fully Automated Message Sending & Reading
          <br />
          (Shows only the percived positive messages & filters, no reponse or negavite messages)
          <br />
          (This Service is only for WatsApp mobile number) */}
          {/* <small style={{display: 'block', fontSize: '10px'}}>Fight against Corona</small> */}

          {/* </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto"> */}
          {/* <li className="nav-item active">
                  <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                </li> */}
          {/* <li className="nav-item">
                  <a className="nav-link" href="#">Sign In</a>
                </li> */}
          {/* <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Dropdown
        </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
            </li> */}
          {/* </ul> */}
          {/* <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form> */}
          {/* </div> */}
          {/* </div> */}
          {/* </nav> */}
        </header>

        {/* <button onClick={() => this.updateModal(true)}>
            Open sidebar
        </button> */}

        <div className={`${this.state.opened ? 'sidebarOpen' : 'sidebarClose'}`}>
          <div className='topBar'>SIDEBAR</div>
          <div className='main'>Main</div>
        </div>





        <Modal show={this.state.isFeedbackModalShow} onHide={this.hideFeedbackModal}>
          <Modal.Header closeButton>
            <Modal.Title>Provide your valuable feedback</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group row">
              <label
                htmlFor="txtName"
                className={"col-sm-2 col-form-label"}
              >Name</label>
              <div className={"col-sm-8"}>
                <input
                  maxLength="50"
                  value={this.state.name}
                  onChange={(e) => { this.setState({ name: e.target.value }) }}
                  type="text"
                  className="form-control"
                  id="txtName"
                  aria-describedby="Enter Name"
                  placeholder={"Enter Name (Optional)"}
                />
              </div>
            </div>
            <div className="form-group row">
              <label
                htmlFor="txtmessage"
                className={"col-sm-2 col-form-label"}
              >Feedback</label>
              <div className={"col-sm-8"}>
                <textarea
                  rows={4}
                  value={this.state.message}
                  onChange={(e) => this.setState({ message: e.target.value })}
                  className="form-control"
                  placeholder={"Enter Your Feedback"}
                  id={"txtmessage"}
                ></textarea>
              </div>
            </div>
            <div className={'form-group'}>
              <p style={{ fontWeight: 500, fontSize: 14 }}>*Your feedback is very important. You can also share new feature request or report bugs.</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.hideFeedbackModal}>Close</Button>
            <Button variant="primary" disabled={this.state.isSending ? true : false} onClick={this.sendFeedback} className={"sendMessageBtn"} >
              {(this.state.isSending) ? <React.Fragment><FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} /> Send Feedback</React.Fragment> : <span>Send Feedback</span>}
            </Button>
          </Modal.Footer>
        </Modal>


      </React.Fragment>
    );
  }
}

export default Header;
