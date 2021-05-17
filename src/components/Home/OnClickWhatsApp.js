import ArticleList from "../ArticleList";
import React, { useState, useEffect } from "react";
import agent from "../../agent";
import { connect } from "react-redux";
import { CHANGE_TAB } from "../../constants/actionTypes";
import Tags from "./Tags";
import Select from "react-select";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";

import Files from 'react-files'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";

// import { Typeahead, Menu, MenuItem } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
// import { Alert } from "bootstrap";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { createBootstrapComponent } from "react-bootstrap/esm/ThemeProvider";
import ExtractNumbers from './ExtractNumbers';
import ReachTwitter from './ReachTwitter';
import PhoneNumber from 'awesome-phonenumber';
import { faWhatsapp, faWhatsappSquare } from "@fortawesome/free-brands-svg-icons";



export default function OnClickWhatsApp(props) {



    const [show, setShow] = useState(false);

    const [city, setCity] = useState("");
    // const [typeheadCity, setTypeHeadCity] = useState();
    const [selTag, setSelTag] = useState("BED");
    const [message, setMessage] = useState("");
    const [fromMobile, setFromMobile] = useState("");
    const [toMobile, setToMobile] = useState("");
    // const [validResponse, setValidResponse] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [sendingSMS, setSendingSMS] = useState(false);

    const [options, setOptions] = useState([]);

    const [bedOption, setBedOption] = useState("Plain Bed");
    const [bloodGroup, setBloodGroup] = useState("O-");
    const [otherMedicine, setOtherMedicine] = useState("");
    const [medicineName, setMedicineName] = useState("Remdesivir");
    const [fromOption, setFromOption] = useState("one");
    const [o2Category, setO2Category] = useState("O2 Cylinder");

    const [subscribeCity, setSubscribeCity] = useState("");
    const [subscribeCategory, setSubscribeCategory] = useState("BED");

    const [loadingCount, setLoadingCount] = useState(false);

    const [countNumbers, setCountNumbers] = useState(0);

    const [allGenLink, setAllGenLink] = useState('');





    const handleClose = () => {
        setShow(false);
        props.setToNumbers(false);
    };
    const handleShow = () => {
        setShow(true);
        // setIsSending(false);
        setCity("");
        // setTypeHeadCity("");
        setSelTag("BED");
        setMessage("Need plain bed. Request your help urgently🙏🙏🙏");
        setToMobile("");
        setBedOption("Plain Bed");
        setBloodGroup("O-");
        setOtherMedicine("");
        setMedicineName("Remdesivir");
        setFromOption("one");
        setAllGenLink([]);
        setFromMobile(localStorage.getItem('userMobile') ? localStorage.getItem('userMobile') : '');
        // Promise.resolve(agent.Tags.getMessages(selTag)).then(function (value) {
        //   setMessage(value.data);
        // }, function (e) {
        //   console.error("Exception occured: ", e); // TypeError: Throwing

        // });
    };

    const sendSMS = () => {
        if (!city && !city.value) {
            alert("Please select city");
            return;
        }
        if (!message) {
            alert("Please enter Message");
            return;
        }
        if (!toMobile) {
            alert("Please enter mobile number(s) to send message");
            return;
        }
        if (!fromMobile) {
            alert("Please enter your mobile number");
            return;
        }

        var pn = new PhoneNumber(fromMobile, 'IN');
        if (!pn.isMobile()) {
            alert("Please enter your valid mobile number");
            return;
        }

        if (selTag == 'MEDICINE' && medicineName === "Other" && !otherMedicine) {
            alert("Please enter Medicine Name");
            return;
        }








        var toMob = [];
        var mob = "";
        mob = toMobile.replace(/,/g, "\n");
        if (mob.split("\n").length > 0) {
            toMob = mob.split("\n");
        }

        toMob = toMob.filter(function (el) {
            return el != "";
        });

        toMob = toMob.map((mb) => {

            var pn = new PhoneNumber(mb, 'IN');
            if (pn.isMobile()) {
                return `${pn.getCountryCode()}${pn.getNumber('significant')}`;
            }
            else {
                return '';
            }
        })
        toMob = toMob.filter(function (el) {
            return el != "";
        });
        toMob = [... new Set(toMob)]


        // console.log("I am the city: ", ref.current)
        // alert(`Request successfully submitted for ${countNumbers} Number(s)`);
        // return;

        let subCat = '';
        switch (selTag) {
            case "OXYGEN":
                subCat = o2Category;
                break;
            case "BED":
                subCat = bedOption;
                break;
            case "MEDICINE":
                if (otherMedicine) {
                    subCat = otherMedicine;
                }
                else {
                    subCat = medicineName
                }
                break;
            case "PLASMA":
                subCat = bloodGroup;
                break;
        }



        var request = {
            city: city.value.toUpperCase(),
            category: selTag,
            mobileList: toMob,
            message: message,
            from: fromMobile,
            subCat: subCat,
            forward: (fromMobile) ? true : false
        };


        // console.log("I am the response: ", request);
        // return;

        setIsSending(true);
        Promise.resolve(agent.Tags.sendSMS(request)).then(function (value) {
            if (value === null) {

                props.showLoading();
                props.onClickTag(
                    selTag,
                    city,
                    (page) => agent.Articles.byTag(selTag, city.value, page),
                    agent.Articles.byTag(selTag, city.value)
                );

                localStorage.setItem('userMobile', fromMobile);
                setCity("");
                setSelTag("BED");
                setMessage("");
                setFromMobile("");
                setToMobile("");
                // setShow(false);
                setIsSending(false);
                alert("SMS successfully sent to " + toMob.length + " Numbers");
            }
        }, function (e) {
            setIsSending(false);
            console.error("Exception occured: ", e); // TypeError: Throwing
            alert("There was an error while sending message, we are sorry for the inconvenience please try after some time.")
        });


    }



    useEffect(() => {


        if (props.toNumbers !== false && props.toNumbers.length > 0) {
            // console.log("I am the to numbers", props.toNumbers);
            //Show the modal window here
            handleShow();

            let mobStr = '';

            props.toNumbers.map((mo) => {
                if (mo) {
                    mobStr = mo.mob + ',' + mobStr;
                }
            })


            mobStr = mobStr.replace(/,/g, "\n");



            setToMobile(mobStr);


            var toMob = [];
            var mob = "";
            mob = mobStr;
            if (mob.split("\n").length > 0) {
                toMob = mob.split("\n");
            }

            toMob = toMob.filter(function (el) {
                return el != "";
            });

            toMob = toMob.map((mb) => {

                var pn = new PhoneNumber(mb, 'IN');
                if (pn.isMobile()) {
                    return `${pn.getCountryCode()}${pn.getNumber('significant')}`;
                }
                else {
                    return '';
                }
            })
            toMob = toMob.filter(function (el) {
                return el != "";
            });
            toMob = [... new Set(toMob)]
            toMob = toMob.map((mb) => {
                var pn = new PhoneNumber(mb, 'IN');
                if (pn.isMobile()) {
                    return ({ mob: `${pn.getCountryCode()}${pn.getNumber('significant')}`, isClicked: false })
                }
            })

            setAllGenLink(toMob);





        }


    }, [props.toNumbers])


    useEffect(() => {
        let myOptions = [], sortedCity = [];

        if (props.cityArray && props.cityArray.length > 0) {

            sortedCity = props.cityArray.map((city) => {
                return city.trim();
            });

            sortedCity = sortedCity.sort();
            sortedCity = [... new Set(sortedCity)];

            sortedCity &&
                sortedCity.length > 0 &&
                sortedCity.map((ct) => {
                    myOptions.push({ value: ct, label: ct });
                    // modalCity.push(ct);
                });
        }
        setOptions(myOptions);


        // setModalCity();
    }, [props.cityArray]);


    useEffect(() => {


        if (subscribeCity && subscribeCity.value && subscribeCategory) {


            let category = "";
            switch (subscribeCategory) {
                case 'OXYGEN CYLINDER/REFILL':
                    category = "OXYGEN"
                    break;
                case 'HOSPITAL BED':
                    category = "BED"
                    break;
                default:
                    category = subscribeCategory
            }
            setLoadingCount(true);
            Promise.resolve(agent.Tags.getCount(subscribeCity.value, category)).then(function (response) {


                // console.log("I am the message here:::", response)
                if (response) {
                    setCountNumbers(response.data);
                }

                // setMessage(value.data);
                setLoadingCount(false);


            }, function (e) {
                setLoadingCount(false);
                console.error("Exception occured: ", e); // TypeError: Throwing
            });
        }


    }, [subscribeCity, subscribeCategory])



    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: "#000000",
            padding: "10px",
        }),
    };

    const redirectLink = (mo, index) => {
        let msg = message;

        if (!msg) {
            alert("Please enter message to be sent");
            return;
        }

        let allMob = allGenLink;

        allMob[index].isClicked = true;
        setAllGenLink([]);
        setTimeout(() => { setAllGenLink(allMob); }, 200)


        // console.log(msg, selTag);
        window.open(`https://wa.me/${mo.mob}?text=${encodeURIComponent(msg)}`, "_blank");
    }


















    return (

        <div className={"d-flex align-items-center justify-content-center singleClick mt-2"}>
            <OverlayTrigger
                key={'bottom'}
                placement={'bottom'}
                overlay={
                    <Tooltip id={`tooltip-bottom`}>Helps to send WhatsApp Message to multiple numbers provided by you in single click.</Tooltip>
                }>
                <div className={"d-flex p-3 align-items-center justify-content-center flex-column w-100 h-100"}
                    style={{ backgroundColor: "#f1f1f1", borderRadius: 5 }}>
                    <div
                        className={"d-flex align-items-center justify-content-center"}
                        style={{ minHeight: 38 }}>
                        Received too many numbers to connect?
                    </div>

                    <Button
                        variant="primary"
                        onClick={handleShow}
                        className={"sendMessageBtn"}
                    >
                        One Click WhatsApp Sending
            </Button>
                </div>
            </OverlayTrigger>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Single Click WhatsApp Sending</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group row">
                        <label
                            htmlFor="txtCity"
                            className={"col-sm-2 col-form-label"}
                        >City</label>
                        <div className={"col-sm-5"}>


                            {/* <Typeahead
                    ref={ref}
                    id={'singleClickCity'}
                    placeholder={'Enter City'}
                    onInputChange={(text, e) => { setCity(text); }}
                    onChange={(selected) => {
                      // this.setState({selected});
                      // console.log("I am the city here: ", selected)
                      setTypeHeadCity(selected)
                      setCity((selected && selected.length > 0) && selected[0].value);
                    }}
                    labelKey={option => `${option.value}`}
                    options={options}
                    // options={(props && props.cityArray) && props.cityArray}
                    selected={typeheadCity}
                    renderMenu={(results, menuProps) => (
                      <Menu {...menuProps}>
                        {results.map((result, index) => (
                          <MenuItem option={result} position={index}>
                            {result.label}
                          </MenuItem>
                        ))}
                      </Menu>
                    )}
                  /> */}
                            <Select
                                id={'singleClickCity'}
                                styles={customStyles}
                                name="singleClickCity"
                                value={city}
                                placeholder={"Select City"}
                                options={options}
                                onChange={(text) => { setCity(text) }}
                                theme={(theme) => ({
                                    ...theme,
                                    borderRadius: 5,
                                    colors: {
                                        ...theme.colors,
                                        primary25: "#fa9234",
                                        primary: "#fa9234",
                                    },
                                })}
                                filterOption={(option, inputValue) => {
                                    // inputValue = inputValue.toLowerCase();
                                    return option.label.toLowerCase().startsWith(inputValue.toLowerCase());
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-group row">
                        <label htmlFor="selTag" className={"col-sm-2 col-form-label"}>Item</label>
                        <div className={"col-sm-5"}>
                            <select
                                onChange={(e) => {
                                    let targetValue = e.target.value;
                                    setSelTag(targetValue);
                                    // Promise.resolve(
                                    //   agent.Tags.getMessages(targetValue)
                                    // ).then(function (value) {
                                    // setMessage(value.data);

                                    if (targetValue === 'OXYGEN') {
                                        setO2Category("O2 Cylinder");
                                        setMessage("Do you have O2 cylinder available. Need urgent help please 🙏🙏🙏");
                                    }
                                    if (targetValue === "BED") {
                                        setBedOption("Plain Bed");
                                        setMessage(
                                            "Need plain bed. Request your help urgently🙏🙏🙏"
                                        );
                                    }
                                    if (targetValue === "PLASMA") {
                                        setBloodGroup('O-');
                                        setMessage(
                                            `Do you have PLASMA for O- bloodgroup available? Need Urgent help Please 🙏🙏🙏`
                                        );
                                    }
                                    if (targetValue === "MEDICINE") {
                                        setMedicineName('Remdesivir');
                                        setMessage(
                                            "Do you have Remdesivir medicine available? Need urgent help please 🙏🙏🙏"
                                        );
                                    }
                                    // });
                                }}
                                value={selTag}
                                className="form-control"
                                name={"selTag"}
                                id={"selTag"}
                            >
                                {props.tags &&
                                    props.tags.length > 0 &&
                                    props.tags.map((tg) => {
                                        if (tg !== "CUSTOM") {
                                            return (
                                                <option key={tg} value={tg}>
                                                    {tg}
                                                </option>
                                            );
                                        }
                                    })}
                            </select>
                        </div>
                    </div>


                    {selTag === "OXYGEN" && (
                        <React.Fragment>
                            <div className="form-group row">
                                <div className={"col-sm-2"}></div>
                                <div className={"col-sm-10"}>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="oxygenCat"
                                            id="oxygenCylinder"
                                            value="O2 Cylinder"
                                            checked={o2Category === "O2 Cylinder"}
                                            onChange={() => {
                                                setO2Category("O2 Cylinder");
                                                setMessage("Do you have O2 cylinder available. Need urgent help please 🙏🙏🙏");
                                                // setMessage(
                                                //   "Do you have Remdesivir medicine available? Need urgent help please 🙏🙏🙏"
                                                // );
                                            }}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="oxygenCylinder"
                                        >
                                            O2 Cylinder
                          </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="oxygenCat"
                                            id="oxygenRefill"
                                            value="O2 Refill"
                                            checked={o2Category === "O2 Refill"}
                                            onChange={() => {
                                                setO2Category("O2 Refill");
                                                setMessage("Do you have O2 Refill available. Need urgent help please 🙏🙏🙏");
                                                // setMessage(
                                                //   "Do you have Tocilizumab medicine available? Need urgent help please 🙏🙏🙏"
                                                // );
                                            }}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="oxygenRefill"
                                        >
                                            O2 Refill
                          </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="oxygenCat"
                                            id="oxygenConcentrator"
                                            value="O2 Concentrator"
                                            checked={o2Category === "O2 Concentrator"}
                                            onChange={() => {
                                                setO2Category("O2 Concentrator");
                                                setMessage("Do you have O2 Concentrator available. Need urgent help please 🙏🙏🙏");
                                                // setOtherMedicine("");
                                                // setMessage(
                                                //   "Do you have ____ medicine available? Need urgent help please 🙏🙏🙏"
                                                // );
                                            }}
                                        />
                                        <label className="form-check-label" htmlFor="oxygenConcentrator">
                                            O2 Concentrator
                          </label>
                                    </div>
                                </div>
                            </div>

                        </React.Fragment>
                    )}


                    {selTag === "BED" && (
                        <div className="form-group row">
                            <div className={"col-sm-2"}></div>
                            <div className={"col-sm-10"}>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="bedOptions"
                                        id="plainBed"
                                        value="Plain Bed"
                                        checked={bedOption === "Plain Bed"}
                                        onChange={() => {
                                            setBedOption("Plain Bed");
                                            setMessage(
                                                "Need plain bed. Request your help urgently🙏🙏🙏"
                                            );
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="plainBed">
                                        Plain
                        </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="bedOptions"
                                        id="o2Bed"
                                        value="O2 Bed"
                                        checked={bedOption === "O2 Bed"}
                                        onChange={() => {
                                            setBedOption("O2 Bed");
                                            setMessage(
                                                "Need O2 bed urgently. Request your help urgently🙏🙏🙏"
                                            );
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor="o2Bed">
                                        O2
                        </label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="bedOptions"
                                        id="ventilatorBed"
                                        value="Ventilator Bed"
                                        checked={bedOption === "Ventilator Bed"}
                                        onChange={() => {
                                            setBedOption("Ventilator Bed");
                                            setMessage(
                                                "Need ventilator bed very urgently. Request your help urgently🙏🙏🙏"
                                            );
                                        }}
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="ventilatorBed"
                                    >
                                        Ventilator
                        </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {selTag === "PLASMA" && (
                        <div className="form-group row">
                            <label
                                htmlFor="selBloodGroup"
                                style={{ lineHeight: 1.2 }}
                                className={"col-sm-2 mb-0"}
                            >
                                Blood Group
                    </label>
                            <div className={"col-sm-5"}>
                                {/* <input type="text" className="form-control" id="txtCity" aria-describedby="Enter City" placeholder={'Enter City'} /> */}
                                <select
                                    onChange={(e) => {
                                        let targetValue = e.target.value;
                                        setBloodGroup(targetValue);
                                        setMessage(
                                            `Do you have PLASMA for ${targetValue} bloodgroup available? Need Urgent help Please 🙏🙏🙏`
                                        );
                                    }}
                                    value={bloodGroup}
                                    className="form-control"
                                    name={"selBloodGroup"}
                                    id={"selBloodGroup"}
                                >
                                    <option key={"O-"} value={"O-"}>
                                        {"O-"}
                                    </option>
                                    <option key={"O+"} value={"O+"}>
                                        {"O+"}
                                    </option>
                                    <option key={"A-"} value={"A-"}>
                                        {"A-"}
                                    </option>
                                    <option key={"A+"} value={"A+"}>
                                        {"A+"}
                                    </option>
                                    <option key={"B-"} value={"B-"}>
                                        {"B-"}
                                    </option>
                                    <option key={"B+"} value={"B+"}>
                                        {"B+"}
                                    </option>
                                    <option key={"AB-"} value={"AB-"}>
                                        {"AB-"}
                                    </option>
                                    <option key={"AB+"} value={"AB+"}>
                                        {"AB+"}
                                    </option>
                                </select>
                            </div>
                        </div>
                    )}
                    {selTag === "MEDICINE" && (
                        <React.Fragment>
                            <div className="form-group row">
                                <div className={"col-sm-2"}></div>
                                <div className={"col-sm-10"}>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="medicineName"
                                            id="Remdesivir"
                                            value="Remdesivir"
                                            checked={medicineName === "Remdesivir"}
                                            onChange={() => {
                                                setMedicineName("Remdesivir");
                                                setMessage(
                                                    "Do you have Remdesivir medicine available? Need urgent help please 🙏🙏🙏"
                                                );
                                            }}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="Remdesivir"
                                        >
                                            Remdesivir
                          </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="medicineName"
                                            id="Tocilizumab"
                                            value="Tocilizumab"
                                            checked={medicineName === "Tocilizumab"}
                                            onChange={() => {
                                                setMedicineName("Tocilizumab");
                                                setMessage(
                                                    "Do you have Tocilizumab medicine available? Need urgent help please 🙏🙏🙏"
                                                );
                                            }}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="Tocilizumab"
                                        >
                                            Tocilizumab
                          </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="medicineName"
                                            id="Other"
                                            value="Other"
                                            checked={medicineName === "Other"}
                                            onChange={() => {
                                                setMedicineName("Other");
                                                setOtherMedicine("");
                                                setMessage(
                                                    "Do you have ____ medicine available? Need urgent help please 🙏🙏🙏"
                                                );
                                            }}
                                        />
                                        <label className="form-check-label" htmlFor="Other">
                                            Other
                          </label>
                                    </div>
                                </div>
                            </div>

                            {medicineName === "Other" && (
                                <div className="form-group row">
                                    {/* <div className="col-sm-2"></div> */}
                                    {/* <div className="col-sm-10"> */}
                                    <label
                                        htmlFor="txtOtherMedicine"
                                        style={{ lineHeight: 1.2 }}
                                        className={"col-sm-2 mb-0"}
                                    >
                                        Other Medicine
                        </label>
                                    <div className={"col-sm-6"}>
                                        <input
                                            maxLength="50"
                                            value={otherMedicine}
                                            onChange={(e) => {
                                                setOtherMedicine(e.target.value);
                                                if (e.target.value === "") {
                                                    setMessage(
                                                        `Do you have ____ medicine available? Need urgent help please 🙏🙏🙏`
                                                    );
                                                } else {
                                                    setMessage(
                                                        `Do you have ${e.target.value} medicine available? Need urgent help please 🙏🙏🙏`
                                                    );
                                                }
                                            }}
                                            type="text"
                                            className="form-control"
                                            id="txtOtherMedicine"
                                            aria-describedby="Enter Medicine Name"
                                            placeholder={"Enter Medicine Name"}
                                        />
                                    </div>
                                    {/* </div> */}
                                </div>
                            )}
                        </React.Fragment>
                    )}

                    <div className="form-group">
                        <label htmlFor="txtmessage">
                            Message{" "}
                            {/* <small>
                    (cannot be edited because of security reasons)
                    </small> */}
                        </label>
                        <textarea
                            // readonly="true"
                            rows={2}
                            minLength="1"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="form-control"
                            placeholder={""}
                            id={"txtmessage"}
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="txtToMobile">To </label>
                        {/* (Maximum 20 Mobile Numbers Allowed) */}
                        <textarea
                            style={{ fontSize: 14 }}
                            value={toMobile}
                            rows={4}
                            onChange={(e) => setToMobile(e.target.value)}
                            type="text"
                            className="form-control"
                            id="txtToMobile"
                            aria-describedby="Enter Mobile Number"
                            placeholder={
                                "List of mobile numbers separated by comma(,) or new line, all number formats accepted"
                            }
                        ></textarea>
                    </div>


                    <div>
                        { }
                    </div>

                    <div className="form-group">
                        <button className="btn sendMessageBtn" onClick={() => {


                            if (!toMobile) {
                                alert("Please enter To Mobile numbers");
                                return;
                            }

                            var toMob = [];
                            var mob = "";
                            mob = toMobile.replace(/,/g, "\n");
                            if (mob.split("\n").length > 0) {
                                toMob = mob.split("\n");
                            }

                            toMob = toMob.filter(function (el) {
                                return el != "";
                            });

                            toMob = toMob.map((mb) => {

                                var pn = new PhoneNumber(mb, 'IN');
                                if (pn.isMobile()) {
                                    return `${pn.getCountryCode()}${pn.getNumber('significant')}`;
                                }
                                else {
                                    return '';
                                }
                            })
                            toMob = toMob.filter(function (el) {
                                return el != "";
                            });
                            toMob = [... new Set(toMob)]
                            toMob = toMob.map((mb) => {
                                var pn = new PhoneNumber(mb, 'IN');
                                if (pn.isMobile()) {
                                    return ({ mob: `${pn.getCountryCode()}${pn.getNumber('significant')}`, isClicked: false })
                                }
                            })

                            setAllGenLink(toMob);
                        }}>Generate WhatsApp links</button>
                    </div>




                    {(allGenLink && allGenLink.length > 0) && <div>

                        <small style={{ fontWeight: 500, marginBottom: 5 }}>
                            * Please click each number to send message.
      </small>
                        <div className="form-group files" style={{ maxHeight: 200, overflowY: 'scroll' }}>

                            <code>
                                {(allGenLink && allGenLink.length > 0) &&
                                    allGenLink.map((mo, index) => {
                                        if (mo) {
                                            return (<div key={mo.mobile}><a style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => { redirectLink(mo, index) }}>
                                                {mo.mob}</a>
                                                <a style={{ color: "#25d366", marginLeft: 8, cursor: 'pointer' }} onClick={() => { redirectLink(mo, index) }}>
                                                    <FontAwesomeIcon
                                                        icon={faWhatsapp}
                                                        style={{ color: "#25d366", marginLeft: 8 }}
                                                    />
                                                </a>


                                                {/* <a style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => { redirectLink(mo, index) }}>send</a> */}


                                                {mo.isClicked && <FontAwesomeIcon className={''} icon={faCheck} style={{ color: "#00b526", marginLeft: 5 }} />}</div>);
                                        }
                                    })
                                }
                            </code>
                        </div></div>}

                    <div className="form-group">
                        {/* <div
                    className={`form-check ${
                      fromOption === "two" && "d-flex align-items-start"
                    }`}
                  >
                    <input
                      className="form-check-input"
                      checked={fromOption === "one" ? true : false}
                      type="checkbox"
                      onChange={() => {
                        setFromOption("one");
                      }}
                      value="one"
                      id="chkone"
                    />
                    <label className="form-check-label" htmlFor="chkone">
                      Results will be shown on the screen
                    </label>
                  </div> */}

                        {/* <div
                  className={`form-check ${fromOption === "two" && "d-flex align-items-center"
                    }`}
                > */}
                        {/* <input
                    className="form-check-input"
                    checked={fromOption === "two" ? true : false}
                    type="checkbox"
                    onChange={(e) => {
                      // console.log("I am the target: ", e.target.checked)
                      if (e.target.checked) {
                        setFromOption("two");
                        setFromMobile("");
                      }
                      else {
                        setFromOption('');
                        setFromMobile("");
                      }

                    }}
                    value="two"
                    id="chktwo"
                  /> */}
                        <label
                            className="form-check-label d-flex align-items-center"
                            htmlFor="txtFromMobile"
                            style={{ fontSize: 14 }}
                        >
                            Your Mobile
                      <input max="12" value={fromMobile} onChange={(e) => setFromMobile(e.target.value)} type="number" className="form-control col-sm-5 ml-2" id="txtFromMobile" aria-describedby="Your Mobile Number" placeholder={'Enter Your Mobile'} />
                        </label>
                        {/* </div> */}
                    </div>
                    {(allGenLink && allGenLink.length > 0) && <div className={'form-group'}>
                        <small style={{ fontWeight: 500, marginBottom: 5 }}>
                            * SMS - you can send to all in one click. WhatsApp you will have to do one by one (still easier as we have generated the link for you).

      </small>
                    </div>}

                </Modal.Body>
                <Modal.Footer>

                    <Button
                        variant="primary"
                        disabled={(sendingSMS) ? true : false}
                        onClick={() => { sendSMS(); }}
                        className={"sendMessageBtn"}
                    >{(sendingSMS) && <FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} />} You can also send SMS</Button>

                    <Button variant="secondary" onClick={handleClose}>
                        Close
                </Button>
                    {/* <Button
                variant="primary"
                disabled={isSending ? true : false}
                onClick={handleSubmit}
                className={"sendMessageBtn"}
              >{(isSending) && <FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} />} Send</Button> */}
                </Modal.Footer>
            </Modal>

        </div>

    );
}