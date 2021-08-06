import React, { useState, useEffect } from 'react';
import { Card, Container, Row, Col, Navbar, Nav, Form, Spinner, ListGroup, Button, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const COLLEGE_CONTROLLER = require('../controllers/collegeController.js');
const NEWS_CONTROLLER = require('../controllers/newsController.js');

const Colleges = (props) => {
  const [colleges, setColleges] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [mostReviewed, setMostReviewed] = useState([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [lastSearch, setLastSearch] = useState("");
  const [loadingNews, setLoadingNews] = useState(false);
  const [news, setNews] = useState([]);

  useEffect(() => {
    setListenerOnTopFiveMostReviewed();
    setNewsListener();
  }, []);

  /*
   * Generic callback function to handle errors
   * @param error - JS error object
  **/
  const callbackOnError = (error) => {
    // TODO: handle this more elegantly
    alert(error.message);
  }

  const setNewsListener = () => {
    setLoadingNews(true);
    NEWS_CONTROLLER.listenOnNewsTable(callbackOnError)
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
        setNews(temp);
        setLoadingNews(false);
      });
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
          return ele2.numReviews - ele1.numReviews;
        });
        setColleges(temp);
        setIsLoading(false);
      });
  }

  const setListenerOnTopFiveMostReviewed = () => {
    setIsLoading(true);
    COLLEGE_CONTROLLER.getTopHundredMostReviewed(callbackOnError)
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
      setMostReviewed(temp);
      setIsLoading(false);
    });
  }

  const searchColleges = (searchVal) => {
    if(searchVal.trim().length == 0 || searchVal.trim() === lastSearch.trim()) {
      return;
    }
    setIsLoading(true);
    searchVal = searchVal.trim();
    COLLEGE_CONTROLLER.searchColleges(searchVal, callbackOnError)
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
          return ele2.numReviews - ele1.numReviews;
        });
        setColleges(temp);
        setIsLoading(false);
        setSearched(true);
        setLastSearch(searchVal);
      });
  }

  // const filterSearch = (e) => {
  //   return;
  //   setIsLoading(true);
  //   var search = e.target.value.toUpperCase();
  //   if(search.trim().length == 0) {
  //     setIsLoading(false);
  //     setFiltered([]);
  //     setIsFiltering(false);
  //     return;
  //   }
  //   setIsFiltering(true);
  //   setTimeout(() => {
  //     var collegesCopy = colleges.slice();
  //     var filteredColleges = [];
  //     var i = 0;
  //     var x = collegesCopy.length - 1;
  //     while(i < x) {
  //       if(collegesCopy[i].name !== undefined && collegesCopy[i].name.toUpperCase().includes(search)) {
  //         filteredColleges.push(collegesCopy[i]);
  //       }
  //       if(collegesCopy[x].name !== undefined && collegesCopy[x].name.toUpperCase().includes(search)) {
  //         filteredColleges.push(collegesCopy[x]);
  //       }
  //       i++;
  //       x--;
  //     }
  //     // for(var i = 0; i < collegesCopy.length; i++) {
  //     //   if(collegesCopy[i].name !== undefined && collegesCopy[i].name.toUpperCase().includes(search)) {
  //     //     filteredColleges.push(collegesCopy[i]);
  //     //   }
  //     // }
  //     setFiltered(filteredColleges);
  //     setIsLoading(false);
  //   }, 1000);
  // }

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
          <i> Searches are case sensitive </i>
          <InputGroup>
            <Form.Control
              id="college-search-input"
              as="input"
              size="lg"
              placeholder="Search for your college"
            />
            <Button
              variant="outline-secondary"
              onClick={() => searchColleges(document.getElementById("college-search-input").value)}
            >
              Search
            </Button>
          </InputGroup>
        </Col>
      </Row>
      <Row style={{marginBottom: "10px"}}>
        <Col className="right-align">
          <div> Don't see your college? Add it <a href="https://docs.google.com/forms/d/e/1FAIpQLSf597udVymArVvKtZfODUy75FXw0kfPHfSP30vp-6vkwgkGNg/viewform?usp=sf_link" target="_blank">here</a>. </div>
        </Col>
      </Row>
      {isLoading || loadingNews ?
        <div className="spinner-container">
          <Spinner animation="border" />
        </div>
      :
        <div>
          <Row>
            <Col>
              {searched ?
                <div>
                  <h5>
                    🔍 Search Results {"(" + colleges.length + ")"}
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => {
                        setLastSearch("");
                        setColleges([]);
                        setSearched(false);
                      }}
                      style={{marginLeft: "5px"}}
                    >
                      x
                    </Button>
                  </h5>
                  <ListGroup>
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
                </div>
              :
                <div></div>
              }
            </Col>
          </Row>
          {searched ?
            <br/>
          :
            <div></div>
          }
          <Row>
            <Col>
            <h5> ⬆️ Most Reviewed Colleges </h5>
            {mostReviewed.length == 0 ?
              <div style={{marginTop: "15px"}}>
                <p style={{marginLeft: "25px"}}> No results to display </p>
              </div>
            :
              <ListGroup>
                {mostReviewed.map((college) => {
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
          <br/>
          <Row style={{marginBottom: "5px"}}>
            <Col>
              <h5> 📰 Random College Articles </h5>
            </Col>
          </Row>
          <Row>
            <Col>
              <ListGroup>
                {news.map((article) => {
                  return (
                    <ListGroup.Item
                      key={article.id}
                      action
                      onClick={() => {
                        window.open(article.url, "_blank");
                      }}
                    >
                      <Row>
                        <Col sm={8}>
                          {article.title}
                        </Col>
                        <Col sm={4} className="right-align">
                          	🛈 {article.source.name}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Col>
          </Row>
          {/*
          <Row>
            {news.map((article) => {
              return (
                <Col key ={article.id} md={3} style={{marginBottom: "20px"}}>
                  <a
                    className="clickable-card"
                    onClick={() => {
                      window.open(article.url, "_blank");
                    }}
                    style={{textDecoration:"none",color:"black"}}
                  >
                    <Card className="card-equal-height">
                      <img src={article.urlToImage} className="news-card-image"/>
                      <Card.Body>
                        <Card.Title> {article.title} </Card.Title>
                      </Card.Body>
                    </Card>
                  </a>
                </Col>
              );
            })}
          </Row>
          */}
        </div>
      }
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
    </Container>
  );
}

export default Colleges;
