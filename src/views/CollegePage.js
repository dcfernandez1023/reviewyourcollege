import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Spinner,
  ListGroup,
  Card,
  Button
}
from 'react-bootstrap';

const COLLEGE_CONTROLLER = require('../controllers/collegeController.js');

const CollegePage = (props) => {
  let { collegeId } = useParams();

  const [college, setCollege] = useState();

  useEffect(() => {
    setListener();
  });

  /*
   * Generic callback function to handle errors
   * @param error - JS error object
  **/
  const callbackOnError = (error) => {
    // TODO: handle this more elegantly
    alert(error.message);
  }

  const setListener = () => {
    COLLEGE_CONTROLLER.listenOnCollegeDoc(collegeId, callbackOnError)
      .onSnapshot(quereySnapshot => {
        if(quereySnapshot.docs.length == 0) {
          setCollege();
        }
        else {
          setCollege(quereySnapshot.docs[0].data());
        }
      });
  }

  if(college === undefined) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" />
      </div>
    );
  }
  return (
    <Row>
      <Col>
        {college.name}
      </Col>
    </Row>
  );
}

export default CollegePage;
