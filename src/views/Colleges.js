import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Nav, Form, Spinner, ListGroup, Button } from 'react-bootstrap';
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
    COLLEGE_CONTROLLER.listenOnCollegeTable(callbackOnError)
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach((change) => {
          if(!querySnapshot.metadata.fromCache) {
            console.log(change.doc.data().id + " came from server");
          }
        });
        var temp = [];
        for(var i = 0; i < querySnapshot.docs.length; i++) {
          temp.push(querySnapshot.docs[i].data());
        }
        temp.sort((ele1, ele2) => {
          return ele2.reviews.length - ele1.reviews.length;
        });
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
    setTimeout(() => {
      var collegesCopy = colleges.slice();
      var filteredColleges = [];
      var i = 0;
      var x = collegesCopy.length - 1;
      while(i < x) {
        if(collegesCopy[i].name !== undefined && collegesCopy[i].name.toUpperCase().includes(search)) {
          filteredColleges.push(collegesCopy[i]);
        }
        if(collegesCopy[x].name !== undefined && collegesCopy[x].name.toUpperCase().includes(search)) {
          filteredColleges.push(collegesCopy[x]);
        }
        i++;
        x--;
      }
      // for(var i = 0; i < collegesCopy.length; i++) {
      //   if(collegesCopy[i].name !== undefined && collegesCopy[i].name.toUpperCase().includes(search)) {
      //     filteredColleges.push(collegesCopy[i]);
      //   }
      // }
      setFiltered(filteredColleges);
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Container>
      <br/>
      <Row className="reviewyourcollege-header">
        <Col>
          <h1> Find, rate, and read reviews about your college </h1>
        </Col>
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
      <Row style={{marginBottom: "10px"}}>
        <Col className="right-align">
          <div> Don't see your college? Add it <a href="https://docs.google.com/forms/d/e/1FAIpQLSf597udVymArVvKtZfODUy75FXw0kfPHfSP30vp-6vkwgkGNg/viewform?usp=sf_link">here</a>. </div>
        </Col>
      </Row>
      {isLoading ?
        <div className="spinner-container">
          <Spinner animation="border" />
        </div>
      :
        <div>
          <Row style={{marginBottom: "8px"}}>
            <Col>
              {isFiltering ?
                <strong> Showing {filtered.length} colleges </strong>
              :
                <strong> Showing {colleges.length} colleges </strong>
              }
            </Col>
          </Row>
          <Row>
            <Col>
              {isFiltering ?
                <ListGroup variant="flush">
                  {filtered.map((college) => {
                    return (
                      <ListGroup.Item
                        action
                        key={college.id}
                        onClick={() => {
                          window.location.pathname = "/college/" + college.id}}
                      >
                        <Row>
                          <Col xs={6}>
                            {college.name}
                          </Col>
                          <Col xs={6} className="right-align">
                            {college.reviews.length == 1 ?
                              college.reviews.length + " review"
                            :
                              college.reviews.length + " reviews"
                            }
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              :
                <ListGroup variant="flush">
                  {colleges.map((college) => {
                    return (
                      <ListGroup.Item
                        action
                        key={college.id}
                        onClick={() => {window.location.pathname = "/college/" + college.id}}
                      >
                        <Row>
                          <Col xs={6}>
                            {college.name}
                          </Col>
                          <Col xs={6} className="right-align">
                          {college.reviews.length == 1 ?
                            college.reviews.length + " review"
                          :
                            college.reviews.length + " reviews"
                          }
                          </Col>
                        </Row>
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
