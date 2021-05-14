import React, { useEffect } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPrayingHands, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
// import { Link, useLocation, BrowserRouter as Router } from "react-router-dom";
import agent from '../agent';
import { NavLink } from "react-router-dom";


export default function Response(props) {

    useEffect(() => {
        // let url = new URLSearchParams(useLocation().search);
//         console.log("This is a props here dude::::::::::::::::::::::", props)
// console.log("I am location:::::::::::::::::::::::::::::::::::", window.location)
//         console.log("I am the search params:::", props.location.search)
        
        var winLocation = window.location;
        
        var searchParams = new URLSearchParams(winLocation.search);



        if (searchParams.has("p")) {
            // console.log("I am the params ::", searchParams.get("p"));



            Promise.resolve(agent.Tags.sendConfirm('', searchParams.get("p"))).then(function (value) {
                // setMessage(value.data);
                // setIsSending(false);
                // console.log("I am the value here dude: ", value);


            }, function (e) {
                // setIsSending(false);
                console.error("Exception occured: ", e); // TypeError: Throwing
                // alert("There was an error while extracting numbers from image, we are sorry for the inconvenience please try after some time.")
            });







        }


        // console.log("I am the search params here :::::::::", searchParams)
    }, []);

    return (
        <div className={'container'}>
            <div className={'thank-you-container d-flex align-items-center justify-content-center flex-column'}>
                <div className={'thank-you-wrapper text-center'}>
                    <h1><FontAwesomeIcon className={'praying-hands'} icon={faPrayingHands} /></h1>
                    <h1>Thanks for your response</h1>
                    <h3>God Bless you</h3>
                    {/* <a className={'btn sendMessageBtn'}>Go to home</a> */}
                    <NavLink className="btn sendMessageBtn" to="/">Go to home</NavLink>
                </div>
            </div>
        </div>
    );
}