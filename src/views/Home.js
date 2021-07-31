import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav, Form, Spinner } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Colleges from './Colleges.js';
import CollegePage from './CollegePage.js';

const COLLEGE_CONTROLLER = require('../controllers/collegeController.js');

const Home = (props) => {

  return (
    <div>
      <Navbar className="navbar-linear" variant="dark">
        <Container style={{width: "60%", height: "100%"}}>
          <Navbar.Brand href="/"> <h3> reviewyourcollege </h3> </Navbar.Brand>
        </Container>
      </Navbar>
      <br/>
      <Container style={{width: "60%"}}>
        <Router>
          <Switch>
            <Route path="/college/:collegeId">
              <CollegePage />
            </Route>
            <Route path="/">
              <Colleges />
            </Route>
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default Home;
