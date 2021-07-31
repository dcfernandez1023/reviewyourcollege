import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav, Form, Spinner } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Colleges from './Colleges.js';

const COLLEGE_CONTROLLER = require('../controllers/collegeController.js');

const Home = (props) => {
  const [colleges, setColleges] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCollegeListener();
  }, []);

  /*
   * Generic callback function to handle errors
   * @param error - JS error object
  **/
  const callbackOnError = (error) => {
    // TODO: handle this more elegantly
    alert(error.message);
  }

  /*
   * Listens on the 'colleges' collection for any changes to the documents and
     updates this component's state with those changes automatically
  **/
  const setCollegeListener = () => {
    setIsLoading(true);
    COLLEGE_CONTROLLER.listenOnCollegeTable(callbackOnError)
      .onSnapshot(quereySnapshot => {
        var temp = [];
        for(var i = 0; i < quereySnapshot.docs.length; i++) {
          temp.push(quereySnapshot.docs[i].data());
        }
        setColleges(temp);
        setIsLoading(false);
      });
  }

  const filterSearch = (e) => {
    setIsLoading(true);
    var search = e.target.value.toUpperCase();
    if(search.trim().length == 0) {
      setIsLoading(false);
      setFiltered([]);
      setIsFiltering(false);
      return;
    }
    setIsFiltering(true);
    var collegesCopy = colleges.slice();
    var filteredColleges = [];
    for(var i = 0; i < collegesCopy.length; i++) {
      if(collegesCopy[i].name !== undefined && collegesCopy[i].name.toUpperCase().includes(search)) {
        filteredColleges.push(collegesCopy[i]);
      }
    }
    setFiltered(filteredColleges);
    setIsLoading(false);
  }

  return (
    <div>
      <Navbar className="navbar-linear" variant="dark">
        <Container className="app-width">
          <Navbar.Brand href="/"> <h3> reviewyourcollege </h3> </Navbar.Brand>
        </Container>
      </Navbar>
      <br/>
      <Router>
        <Switch>
          <Route path="/">
            <Colleges />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default Home;
