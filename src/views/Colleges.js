import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav, Form, Spinner, ListGroup } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const COLLEGE_CONTROLLER = require('../controllers/collegeController.js');

const Colleges = (props) => {
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
    COLLEGE_CONTROLLER.listenOnCollegeTable(callbackOnError).limit(100)
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
    <Container className="app-width">
      <Row className="reviewyourcollege-header">
        <Col> <h1> Find, rate, and read reviews about your college </h1> </Col>
      </Row>
      <br/>
      <Row>
        <Col>
          <Form.Control
            as="input"
            size="lg"
            placeholder="Search for your college"
            onChange={(e) => {filterSearch(e)}}
          />
        </Col>
      </Row>
      {isLoading ?
        <div className="spinner-container">
          <Spinner animation="border" />
        </div>
      :
        <div>
          <br/>
          <Row>
            <Col className="right-align">
              {isFiltering ?
                <strong> Showing {filtered.length} colleges </strong>
              :
                <strong> Showing {colleges.length} colleges </strong>
              }
            </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              {isFiltering ?
                <ListGroup variant="flush">
                  {filtered.map((college) => {
                    return (
                      <ListGroup.Item action key={college.id}>
                        <div> {college.name} </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              :
                <ListGroup variant="flush">
                  {colleges.map((college) => {
                    return (
                      <ListGroup.Item action key={college.id}>
                        <div> {college.name} </div>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              }
          </Col>
          </Row>
        </div>
      }
    </Container>
  );
}

export default Colleges;
