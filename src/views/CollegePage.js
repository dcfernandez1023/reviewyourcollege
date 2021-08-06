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
  InputGroup,
  Accordion
} from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";
import { v4 as uuidv4 } from 'uuid';
import ReviewModal from './ReviewModal.js';

const COLLEGE_CONTROLLER = require('../controllers/collegeController.js');
const REVIEW_MODEL = require('../models/review.js');
const COMMENT_MODEL = require('../models/comment.js');

const CollegePage = (props) => {
  let { collegeId } = useParams();

  /* Modal state objs */
  const [action, setAction] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [show, setShow] = useState(false);
  const [review, setReview] = useState();

  const [college, setCollege] = useState();
  const [category, setCategory] = useState("all");
  const [newComment, setNewComment] = useState({});

  useEffect(() => {
    setListener();
  }, []);

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

  const onCloseReviewModal = () => {
    setAction("");
    setModalHeader("");
    setShow(false);
    setReview();
  }

  const getFilterReviews = () => {
    if(category === "all") {
      return college.reviews;
    }
    var reviews = [];
    for(var i = 0; i < college.reviews.length; i++) {
      if(college.reviews[i].category === category) {
        reviews.push(college.reviews[i]);
      }
    }
    return reviews;
  }

  const writeCollegeReview = (review) => {
    var collegeCopy = Object.assign({}, college);
    collegeCopy.reviews.push(review);
    COLLEGE_CONTROLLER.writeCollege(college, setCollege, callbackOnError);
  }

  const writeComment = (reviewId) => {
    if(newComment[reviewId] === undefined || newComment[reviewId].trim().length == 0) {
      return;
    }
    var commentObj = Object.assign({}, COMMENT_MODEL.comment);
    commentObj.id = uuidv4().toString();
    commentObj.text = newComment[reviewId];
    commentObj.timestamp = new Date().getTime();
    var collegeCopy = Object.assign({}, college);
    for(var i = 0; i < collegeCopy.reviews.length; i++) {
      if(collegeCopy.reviews[i].id === reviewId) {
        collegeCopy.reviews[i].comments.push(commentObj);
        break;
      }
    }
    const callback = (data) => {
      var copy = Object.assign({}, newComment);
      copy[reviewId] = "";
      setNewComment(copy);
    };
    COLLEGE_CONTROLLER.writeCollege(college, callback, callbackOnError);
  }

  if(college === undefined) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" />
      </div>
    );
  }
  const reviews = getFilterReviews();
  return (
    <div>
      <ReviewModal
        action={action}
        header={modalHeader}
        show={show}
        review={review}
        categories={college.categories}
        onClickSubmit={writeCollegeReview}
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
                  <Form.Select
                    onChange={(e) => {
                      let val = e.target.value;
                      setCategory(e.target.value);
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
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col xs={7} className="right-align">
                <Button
                  variant="light"
                  style={{backgroundColor: "#EBEBEB", paddingTop: "3px", paddingBottom: "3px"}}
                  onClick={() => {
                    setAction("add");
                    setModalHeader("Add Review");
                    setShow(true);
                    setReview(Object.assign({}, REVIEW_MODEL.review));
                  }}
                >
                  Add Review
                </Button>
              </Col>
            </Row>
            <br/>
            <Row>
              {reviews == 0 ?
                <Col>
                  No reviews under this category
                </Col>
              :
              <Col xs={12}>
                {reviews.map((review) => {
                  return (
                    <Card style={{marginBottom: "15px"}}>
                      <Card.Body>
                        <Card.Title>
                          <ReactStars
                            count={5}
                            value={review.rating}
                            edit={false}
                            size={24}
                            activeColor="#ffd700"
                          />
                          {review.title}
                        </Card.Title>
                        <Card.Text> <i> {review.category} </i> </Card.Text>

                        <div> {review.text} </div>
                        <hr style={{border: "1px solid lightGray", width: "25%"}} />
                        <Accordion flush>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header> Comment Thread {"(" + review.comments.length.toString() + ")"} </Accordion.Header>
                            <Accordion.Body>
                              {review.comments.length == 0 ?
                                <p> No comments yet </p>
                              :
                                <div>
                                  {review.comments.map((comment, index) => {
                                    var dateStr = new Date(comment.timestamp).toLocaleDateString();
                                    return (
                                      <div key={comment.id}>
                                        <Row>
                                          <Col>
                                            <div>
                                              <small>
                                                <i>
                                                  {comment.user.trim().length == 0 ?
                                                    "Anonymous on " + dateStr
                                                  :
                                                    comment.user + " on " + dateStr
                                                  }
                                                </i>
                                              </small>
                                            </div>
                                            <div>
                                              {comment.text}
                                            </div>
                                          </Col>
                                        </Row>
                                        {index < (review.comments.length) - 1 ?
                                          <hr style={{border: "1px solid lightGray", width: "25%"}} />
                                        :
                                          <div></div>
                                        }
                                      </div>
                                    );
                                  })}
                                </div>
                              }
                              <hr style={{border: "1px solid lightGray"}} />
                              <Row style={{marginBottom: "8px"}}>
                                <Col>
                                  <Form.Control
                                    as="textarea"
                                    placeholder="Leave a comment"
                                    value={newComment[review.id] === undefined ? "": newComment[review.id]}
                                    onChange={(e) => {
                                      var copy = Object.assign({}, newComment);
                                      copy[review.id] = e.target.value;
                                      setNewComment(copy);
                                    }}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col className="right-align">
                                  <Button
                                    variant="success"
                                    onClick={() => {writeComment(review.id)}}
                                  >
                                    Post
                                  </Button>
                                </Col>
                              </Row>
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      </Card.Body>
                      <Card.Footer className="text-muted">
                        <Col className="right-align">
                          {review.user.trim().length == 0 ?
                            <small>
                              {new Date(review.timestamp).toLocaleDateString() + " by Anonymous"}
                            </small>
                          :
                          <small>
                            {new Date(review.timestamp).toLocaleDateString() + " by " + review.user}
                          </small>
                          }

                        </Col>
                      </Card.Footer>
                    </Card>
                  );
                })}
              </Col>
              }
            </Row>
          </Tab>
        </Tabs>
      </Row>
      <br/>
      <br/>
      <hr/>
      <Row>
          <Col md={7}>
          <p>© reviewyourcollege 2021</p>
          </Col>
          <Col md={5}>
          <p style={{float:"right"}}> 📮<a href="https://forms.gle/iMbj9NmKuHitaReF7" target="_blank"> Submit Feedback </a></p>
          </Col>
      </Row>
    </div>
  );
}

export default CollegePage;
