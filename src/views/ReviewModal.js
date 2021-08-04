import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Button,
  Modal,
  Form
}
from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import ReactStars from "react-rating-stars-component";

const REVIEW_MODEL = require('../models/review.js');

/*
  Props:
    * action - add, edit, delete
    * header - title for modal
    * show - true/false
    * review - the review to edit or delete
    * categories - the categories to choose from
    * onClickSubmit - function to handle submit
    * onClose - function to close modal
*/
const ReviewModal = (props) => {
  const [action, setAction] = useState("");
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [review, setReview] = useState();
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setAction(props.action);
    setHeader(props.header);
    setShow(props.show);
    setReview(props.review);
  }, [props.action, props.header, props.show, props.review]);

  const onChangeReview = (e) => {
    setValidated(false);
    var name = [e.target.name][0];
    var value = e.target.value;
    var reviewCopy = Object.assign({}, review);
    reviewCopy[name] = value;
    setReview(reviewCopy);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    var reviewCopy = Object.assign({}, review);
    var valid = true;
    for(var i = 0; i < REVIEW_MODEL.metadata.length; i++) {
      var field = REVIEW_MODEL.metadata[i];
      if(field.required && reviewCopy[field.value].toString().trim().length == 0) {
        valid = false;
        reviewCopy[field.value] = reviewCopy[field.value].toString().trim();
      }
    }
    setReview(reviewCopy);
    setValidated(true);
    if(valid) {
      reviewCopy.id = uuidv4().toString();
      reviewCopy.timestamp = new Date().getTime();
      props.onClickSubmit(reviewCopy);
      onClose();
    }
  }

  const onClose = () => {
    setValidated(false);
    props.onClose();
  }

  if(review === undefined) {
    return <div></div>
  }
  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title> {header} </Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col style={{marginBottom: "8px"}}>
              <Form.Label> Category </Form.Label>
              <Form.Select
                required
                name="category"
                onChange={(e) => {
                  let val = e.target.value;
                  if(val === "add") {
                    window.open('/', "_blank");
                  }
                  else {
                    onChangeReview(e);
                  }
                }}
              >
                <option selected value=""> Select </option>
                {props.categories.map((category) => {
                  return (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  );
                })}
              </Form.Select>
            </Col>
            {REVIEW_MODEL.metadata.map((field) => {
              return (
                <Col key={field.value} md={field.col} style={{marginBottom: "10px"}}>
                  <Form.Label> {field.display} </Form.Label>
                  <Form.Control
                    required={field.required}
                    as={field.element}
                    name={field.value}
                    value={review[field.value]}
                    onChange={(e) => {
                      onChangeReview(e);
                    }}
                  />
                </Col>
              );
            })}
            <Col xs={12} style={{marginTop: "10px"}}>
              <div> Give a rating for this review </div>
              <ReactStars
                count={5}
                onChange={(ratingChanged) => {
                  var reviewCopy = Object.assign({}, review);
                  reviewCopy.rating = ratingChanged.toString();
                  setReview(reviewCopy);
                }}
                size={50}
                activeColor="#ffd700"
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" variant="success"> Submit </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ReviewModal;
