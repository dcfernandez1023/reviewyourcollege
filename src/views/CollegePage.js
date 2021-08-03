import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Spinner,
  ListGroup,
  Card,
  Button,
  Figure,
  Tabs,
  Tab,
  Nav,
  Form,
  InputGroup
}
from 'react-bootstrap';
import ReviewModal from './ReviewModal.js';

const COLLEGE_CONTROLLER = require('../controllers/collegeController.js');

const CollegePage = (props) => {
  let { collegeId } = useParams();

  /* Modal state objs */
  const [action, setAction] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [show, setShow] = useState(false);
  const [review, setReview] = useState();

  const [college, setCollege] = useState();
  const [category, setCategory] = useState("all");

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

  const getAllReviews = (categories) => {
    var allReviews = [];
    for(var i = 0; i < categories.length; i++) {
      for(var x = 0; x < categories[i].reviews.length; x++) {
        allReviews.push(categories[i].reviews[x]);
      }
    }
    return allReviews;
  }

  const onCloseReviewModal = () => {
    setAction("");
    setModalHeader("");
    setShow(false);
    setReview();
  }

  if(college === undefined) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" />
      </div>
    );
  }
  const allReviews = getAllReviews(college.categories);
  return (
    <div>
      <ReviewModal
        action={action}
        header={modalHeader}
        show={show}
        review={review}
        onClickSubmit={undefined}
        onClose={onCloseReviewModal}
      />
      <Row>
        <Col>
          <Button
            variant="light"
            style={{backgroundColor: "#EBEBEB", fontSize: "25px", paddingTop: "3px", paddingBottom: "3px"}}
            onClick={() => {
              window.location.href = "/";
            }}
          >
            ←
          </Button>
        </Col>
      </Row>
      <br/>
      <Row>
        <Col className="center-align">
          <h4>
            <Figure style={{marginRight: "10px"}}>
              <Figure.Image
                width={75}
                height={75}
                src={college.logo}
              />
            </Figure>
            {college.name}
          </h4>
        </Col>
      </Row>
      <Row>
        <Tabs defaultActiveKey="overview" className="mb-3">
          <Tab eventKey="overview" title="Overview">
            <div style={{marginBottom: "10px"}}> 🏫 {college.founded} </div>
            <div style={{marginBottom: "10px"}}>
              {"🌐 "}
              <a
                className="clickable-card"
                onClick={() => { window.open(college.website, "_blank"); }}
              >
                {college.name}
              </a>
            </div>
            <div style={{marginBottom: "10px"}}> 📍 {college.location} </div>
            <div>
              <span> 📝 </span>
              <span> {college.description} </span>
            </div>
          </Tab>
          <Tab eventKey="reviews" title="Reviews">
            <Row>
              <Col xs={5}>
                <InputGroup className="mb-3">
                  <InputGroup.Text> Categories </InputGroup.Text>
                  <Form.Control
                    as="select"
                    onChange={(e) => {
                      let val = e.target.value;
                      if(val === "add") {
                        let currCategory = category;
                        setCategory(currCategory);
                        window.open('/', "_blank");
                      }
                      else {
                        setCategory(e.target.value);
                      }
                    }}
                  >
                    <option value="all"> All </option>
                    {college.categories.map((category) => {
                      return (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      );
                    })}
                    <option value="add"> + Add a category </option>
                  </Form.Control>
                </InputGroup>
              </Col>
              <Col xs={7} className="right-align">
                <Button
                  variant="light"
                  style={{backgroundColor: "#EBEBEB", paddingTop: "3px", paddingBottom: "3px"}}
                  onClick={() => {
                    setAction("add");
                    setModalHeader("Add review");
                    setShow(true);
                  }}
                >
                  Add Review
                </Button>
              </Col>
            </Row>
            <br/>
            <Row>
              <Col>
                {}
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </Row>
      <br/>
      <br/>
    </div>
  );
}

export default CollegePage;
