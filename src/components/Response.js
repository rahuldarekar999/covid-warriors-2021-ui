import React, { useEffect, useState } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faChevronLeft, faPrayingHands, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
// import { Link, useLocation, BrowserRouter as Router } from "react-router-dom";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import agent from '../agent';
import { NavLink } from "react-router-dom";


export default function Response(props) {

    const [answer, setAnswer] = useState(true);
    const [requestObject, setRequestObject] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [question, setQuestion] = useState(false);
    const [loading, setLoading] = useState(true);
    const [questionSubmited, setQuestionSubmitted] = useState(false);

    useEffect(() => {
        var winLocation = window.location;

        var searchParams = new URLSearchParams(winLocation.search);
        if (searchParams.has("p")) {
            setLoading(true);
            Promise.resolve(agent.Tags.getUserMeta(searchParams.get("p"))).then(function (value) {
                // console.log("I am value: ", value);
                if (value && value.data) {
                    // console.log("i am value:", value.data)
                    setRequestObject(value.data);


                    Promise.resolve(agent.Tags.getQuestion(value.data.city, value.data.category, value.data.subCategory)).then(function (resp) {
                        if (resp) {
                            setQuestion(resp.data);
                        }

                        setLoading(false);
                    }, function (e) {
                        setLoading(false);
                        // setIsSending(false);
                        console.error("Exception occured: ", e); // TypeError: Throwing
                        alert("There was an error while fetching data, we are sorry for the inconvenience please try after some time.")
                    });




                }
                else {
                    setLoading(false);
                }
            }, function (e) {
                // setIsSending(false);
                setLoading(false);
                console.error("Exception occured: ", e); // TypeError: Throwing
                // alert("There was an error while extracting numbers from image, we are sorry for the inconvenience please try after some time.")
            });
        }


        // Promise.resolve(agent.Tags.putFile(fileData)).then(function (value) {

        // }, function (e) {
        //     // setIsSending(false);
        //     console.error("Exception occured: ", e); // TypeError: Throwing
        //     alert("There was an error while extracting numbers from image, we are sorry for the inconvenience please try after some time.")
        // });







        // console.log("I am the search params here :::::::::", searchParams)
    }, []);

    const submitResponse = () => {
        // "data": {
        //     "id": 0,
        //     "mobile": "919700258333",
        //     "city": "HYDERABAD",
        //     "category": "MEDICINE",
        //     "createdAt": null,
        //     "message": null,
        //     "subCategory": null
        //     }
        if (requestObject) {
            let request = {
                mobile: requestObject.mobile,
                city: requestObject.city,
                category: requestObject.category,
                subCategory: requestObject.subCategory,
                message: (answer==='yes') ? 'y' : 'n'
            }
            setIsSending(true);
            Promise.resolve(agent.Tags.sendConfirm(request)).then(function (value) {
                if (value) {
                    setIsSending(false);
                    setQuestionSubmitted(true);
                }


            }, function (e) {
                setIsSending(false);
                console.error("Exception occured: ", e); // TypeError: Throwing
                alert("There was an error while submitting response, we are sorry for the inconvenience please try after some time.")
            });
        }
    }

    return (
        <div className={'container'}>
            {/* <div className={'thank-you-container d-flex align-items-center justify-content-center flex-column'}>
                <div className={'thank-you-wrapper text-center'}>
                    <h1><FontAwesomeIcon className={'praying-hands'} icon={faPrayingHands} /></h1>
                    <h1>Thanks for your response</h1>
                    <h3>God Bless you</h3>
                    <NavLink className="btn sendMessageBtn" to="/">Go to home</NavLink>
                </div>
            </div> */}
            <div className={'thank-you-container d-flex align-items-center justify-content-center flex-column mt-5'}>




                {questionSubmited ? <div className={'thank-you-wrapper text-center'}>
                    <h1><FontAwesomeIcon className={'praying-hands'} icon={faPrayingHands} /></h1>
                    <h1>Thanks for your response</h1>
                    <h3>God Bless you</h3>
                    {/* <NavLink className="btn sendMessageBtn" to="/">Go to home</NavLink> */}
                    {/* <hr /> */}
                        <NavLink className="btn sendMessageBtn mt-1" to="/"><FontAwesomeIcon className={'mr-2 blink_me'} icon={faChevronLeft} /> Go to home</NavLink>
                </div> :

                    <div className={'thank-you-wrapper text-center col-sm-8'}>
                        <h1 className={'mb-4'}><FontAwesomeIcon className={'praying-hands'} icon={faPrayingHands} /></h1>

                        {loading ?

                            <div className={'d-flex flex-column align-items-center justify-content-center'}>
                                <FontAwesomeIcon className={'rotate-icon loading-icon'} icon={faSpinner} style={{ color: "#fa9234" }} />
                                <span className={'loading-text'}>Loading ...</span>
                            </div>
                            :
                            <React.Fragment>

                                <h1 style={{ fontSize: 22 }}>{question}</h1>
                                {/* <h3>God Bless you</h3> -->
                     <a className={'btn sendMessageBtn'}>Go to home</a> */}
                                <div className="form-group mb-3">
                                    <div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="answer"
                                                id="yes"
                                                value="yes"
                                                checked={answer === "yes"}
                                                onChange={() => {
                                                    setAnswer("yes");
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="yes">Yes, I have it</label>
                                        </div>
                                        <div className="form-check mt-2">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="answer"
                                                id="no"
                                                value="no"
                                                checked={answer === "no"}
                                                onChange={() => {
                                                    setAnswer("no");
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="no">No, I don't have it</label>
                                        </div>
                                    </div>
                                </div>
                                <div className={'form-group mb-0'}>
                                    <Button
                                        disabled={(isSending) ? true : false}
                                        variant="primary"
                                        onClick={() => { submitResponse() }}
                                        className={"sendMessageBtn"}
                                    >
                                        {(isSending) && <FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} />} Submit
                    </Button>
                                </div>


                            </React.Fragment>
                        }
                        
                    </div>



                }
            </div>
        </div >
    );
}