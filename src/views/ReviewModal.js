import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Button,
  Modal
}
from 'react-bootstrap';

/*
  Props:
    * action - add, edit, delete
    * header - title for modal
    * show - true/false
    * review - the review to edit or delete
    * onClickSubmit - function to handle submit
    * onClose - function to close modal
*/
const ReviewModal = (props) => {
  const [action, setAction] = useState("");
  const [show, setShow] = useState(false);
  const [header, setHeader] = useState("");
  const [review, setReview] = useState();

  useEffect(() => {
    setAction(props.action);
    setHeader(props.header);
    setShow(props.show);
    setReview(props.review);
  }, [props.action, props.header, props.show, props.review]);

  return (
    <Modal
      show={show}
      onHide={props.onClose}
      backdrop="static"
    >
      <Modal.Header>
        <Modal.Title> {header} </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.onClose}> Cancel </Button>
        <Button variant="success"> Done </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReviewModal;
