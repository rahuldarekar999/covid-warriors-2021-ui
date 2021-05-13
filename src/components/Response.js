import React, { useEffect } from 'react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPrayingHands, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
// import { Link, useLocation, BrowserRouter as Router } from "react-router-dom";



export default function Response(props) {

    useEffect(()=>{
        // let url = new URLSearchParams(useLocation().search);
        console.log("This is a props here dude::::::::::::::::::::::", props)


        var searchParams = new URLSearchParams(props.location.search);


        console.log("I am the search params here :::::::::", searchParams)
    },[]);

    return (
        <div className={'container'}>
            <div className={'thank-you-container d-flex align-items-center justify-content-center flex-column'}>
                <div className={'thank-you-wrapper text-center'}>
                    <h1><FontAwesomeIcon className={'praying-hands'} icon={faPrayingHands} /></h1>
                    <h1>Thanks for your response</h1>
                    <h3>God Bless you</h3>
                </div>
            </div>
        </div>
    );
}