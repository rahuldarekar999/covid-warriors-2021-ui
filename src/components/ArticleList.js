import ArticlePreview from "./ArticlePreview";
import ListPagination from "./ListPagination";
import React, { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faWhatsappSquare } from "@fortawesome/free-brands-svg-icons";
// import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";

import moment from "moment";

import { Accordion, Card, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useEffect } from "react";

const ArticleList = (props) => {
  const [allArticles, setAllArticles] = useState({});

  useEffect(() => {
    // console.log("I got some articles", props.validResponse, props.articles);

    if (props.validResponse) {
      let customArticles = {};

      Object.keys(props.articles).map((userMobileNo, index) => {
        userMobileNo &&
          props.articles[userMobileNo].length > 0 &&
          props.articles[userMobileNo].map((article) => {
            if (article.valid === true) {
              if (
                !customArticles[userMobileNo] &&
                customArticles[userMobileNo] === undefined
              ) {
                customArticles[userMobileNo] = [];
                customArticles[userMobileNo].push(article);
              } else {
                customArticles[userMobileNo].push(article);
              }
            }
          });
      });
      setAllArticles(customArticles);
      // console.log("I am the custom articles: ", customArticles)
    } else {
      setAllArticles(props.articles);
    }
  }, [props.articles, props.validResponse]);

  // console.log(':: I am the all articles here ', allArticles)

  // console.log("I am the props in the articles: ", props.articles)
  if (!allArticles) {
    return <div className="article-preview">Loading...</div>;
  }

  if (allArticles && Object.keys(allArticles).length === 0) {
    return (
      <div className="article-preview">No Response for this Category.</div>
    );
  }

  const getTruncate = (text) => {
    // if (text.length > 90) {
    //    return text.substring(0, 90) + '...';
    // }
    return text;
  };

  const getDate = (time) => {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(time);
    // console.log("I am the time : ", d)

    if (moment(d).format("DD/MM/YYYY") === moment().add(-1, 'days').format("DD/MM/YYYY")) {
      d = 'Yesterday';
    }
    else if (moment(d).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY")) {
      d = "Today";
    }
    else {
      d = moment(d).format("DD/MM/YYYY \xa0 hh:mm a");
    }

    return d;
  };

  return (
    <div>
      <Accordion defaultActiveKey="1">
        {/* {
          Object.keys(props.articles).map(article => {
            // console.log("I am the article", article);
            
            if (article && article.length > 0) {

              return props.articles[article].map((art) => {
                // console.log("ai am tha art: ", art)
                return (
                  <ArticlePreview article={art} key={art.slug} />
                );
              })
            }
          })
        } */}

        {Object.keys(allArticles).map((userMobileNo, index) => {
          // console.log("I am the article", article);

          return (
            <Card key={userMobileNo} className={"article-card"}>
              <Card.Header
                className={`d-flex align-items-center justify-content-between w-100`}
                style={{ padding: ".75rem 1.25rem .75rem 0" }}
              >
                <span
                  className={"d-flex align-items-center accordian-user-number"}
                >
                  <span className={"mr-2 d-flex flex-row align-items-center "}>
                    <FontAwesomeIcon
                      icon={faUser}
                      style={{ color: "#606060", marginRight: '0.5rem' }}
                    />

                  </span>

                  <span className={'d-flex flex-row d-flex align-items-center'}>

                    <a
                      className={'mr-3'}
                      style={{ minWidth: 150 }}
                      // style={{ lineHeight: 1 }}
                      href={`tel:${userMobileNo}`} >
                      +{userMobileNo}

                    </a>
                    <OverlayTrigger
                      key={'bottom'}
                      placement={'bottom'}
                      overlay={
                        <Tooltip id={`tooltip-bottom`}>WhatsApp</Tooltip>
                      }
                    >
                      <a target={'_blank'} href={`https://wa.me/${userMobileNo}`} style={{ fontSize: 22 }}>
                        {/* <small
                      style={{
                        display: "block",
                        // fontWeight: 400,
                        // fontSize: "90%",
                        // color: "#a0a0a0",
                      }}
                    > */}
                        <FontAwesomeIcon
                          icon={faWhatsapp}
                          style={{ color: "#25d366" }}
                        />
                        {/* Click here for WhatsApp */}
                        {/* </small> */}
                      </a>
                    </OverlayTrigger>
                  </span>
                </span>

                <Accordion.Toggle
                  as={Button}
                  variant="btn btn-default acc-btn"
                  eventKey={index + 1}
                  className={
                    "d-flex align-items-center justify-content-between w-100"
                  }
                >
                  <span
                    className={
                      "d-flex align-items-center justify-content-start"
                    }
                  >
                    <span className={"mx-4  message-text"}>
                      <span>
                        {userMobileNo &&
                          allArticles[userMobileNo].length > 0 &&
                          getTruncate(allArticles[userMobileNo][0].body)}
                      </span>
                      <small
                        style={{
                          display: "block",
                          fontWeight: 400,
                          fontSize: "65%",
                          color: "#a0a0a0",
                        }}
                      >
                        {/* {getDate(article.time)} */}
                        {userMobileNo &&
                          allArticles[userMobileNo].length > 0 &&
                          getDate(allArticles[userMobileNo][0].time)}
                      </small>
                    </span>
                  </span>
                  <FontAwesomeIcon
                    className={"accord-down-icon"}
                    icon={faChevronDown}
                  />
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey={index + 1}>
                <Card.Body
                  style={{ padding: "0 1.25rem", background: "#f5f5f5" }}
                >
                  {userMobileNo &&
                    allArticles[userMobileNo].length > 0 &&
                    allArticles[userMobileNo].map((article) => {
                      if (props.validResponse) {
                        return (
                          article.valid && (
                            <ArticlePreview
                              article={article}
                              key={article.slug}
                            />
                          )
                        );
                      } else {
                        return (
                          <ArticlePreview
                            article={article}
                            key={article.slug}
                          />
                        );
                      }
                    })}

                </Card.Body>
              </Accordion.Collapse>
            </Card>
          );
          // if (article && article.length > 0) {

          //   return props.articles[article].map((art) => {
          //     console.log("ai am tha art: ", art)
          //     return (
          //       <ArticlePreview article={art} key={art.slug} />
          //     );
          //   })
          // }
        })}

        {/* <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">Click me!</Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>Hello! I'm the body</Card.Body>
          </Accordion.Collapse>
        </Card> */}

        {/* <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Click me!
      </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>Hello! I'm another body</Card.Body>
          </Accordion.Collapse>
        </Card> */}
      </Accordion>

      {/* {
        Object.keys(props.articles).map(article => {
          // console.log("I am the article", article);

          if (article && article.length > 0) {

            return props.articles[article].map((art) => {
              // console.log("ai am tha art: ", art)
              return (
                <ArticlePreview article={art} key={art.slug} />
              );
            })
          }
        })
      } */}

      <ListPagination
        pager={props.pager}
        articlesCount={props.articlesCount}
        currentPage={props.currentPage}
      />
    </div>
  );
};

export default ArticleList;
