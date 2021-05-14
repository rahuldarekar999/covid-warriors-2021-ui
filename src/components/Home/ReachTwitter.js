import React, { useState, useEffect } from "react";
import agent from "../../agent";
import Select from "react-select";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";

// import { Typeahead, Menu, MenuItem } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
// import { Alert } from "bootstrap";
import { faWhatsapp, faWhatsappSquare } from "@fortawesome/free-brands-svg-icons";
import PhoneNumber from 'awesome-phonenumber';






export default function ReachTwitter(props) {

    const [showRegister, setShowRegister] = useState(false);
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sendingSMS, setSendingSMS] = useState(false);

    const [options, setOptions] = useState([]);

    const [twitterLeadsData, setTwitterLeadsData] = useState([]);
    const [noTwitterData, setNoTwitterData] = useState(false);


    const [bedOption, setBedOption] = useState("Plain Bed");
    const [bloodGroup, setBloodGroup] = useState("O-");
    const [otherMedicine, setOtherMedicine] = useState("");
    const [medicineName, setMedicineName] = useState("Remdesivir");
    const [o2Category, setO2Category] = useState("O2 Cylinder");

    const [registerCity, setRegisterCity] = useState("");
    const [typeheadRegisterCity, setTypeHeadRegisterCity] = useState();
    const [registerCategory, setRegisterCategory] = useState("BED");
    const [registerMobileNumber, setRegisterMobileNumber] = useState("");

    const [subscribeCity, setSubscribeCity] = useState("");
    const [subscribeCategory, setSubscribeCategory] = useState("BED");

    const [loadingCount, setLoadingCount] = useState(false);
    const [countNumbers, setCountNumbers] = useState(0);




    const handleRegisterClose = () => setShowRegister(false);
    const handleRegisterShow = () => {
        setShowRegister(true);
        setRegisterCity("");
        setTypeHeadRegisterCity("");
        setNoTwitterData(false);
        // setSubscribeCategory('OXYGEN CYLINDER/REFILL');
        setSubscribeCategory("HOSPITAL BED");
        setMedicineName('Remdesivir')
        setBedOption("Plain Bed");
        setMessage("Need plain bed. Request your help urgently🙏🙏🙏");
        setRegisterCategory("HOSPITAL BED");
        setRegisterMobileNumber(localStorage.getItem('userMobile') ? localStorage.getItem('userMobile') : '');
        setIsSending(false);
        setTwitterLeadsData([]);
    };


    const handleRegisterSubmit = () => {
        if (!registerCity && !registerCity.value) {
            alert("Please select city");
            return;
        }
        // if (!registerMobileNumber) {
        //   alert("Please enter your mobile number");
        //   return;
        // }

        var cat = subscribeCategory;

        if (subscribeCategory === "OXYGEN CYLINDER/REFILL") {
            cat = "OXYGEN";
        }
        if (subscribeCategory === "HOSPITAL BED") {
            cat = "BED";
        }
        let subCat = '';
        switch (subscribeCategory) {
            case "OXYGEN CYLINDER/REFILL":
                subCat = o2Category;
                break;
            case "HOSPITAL BED":
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

        var response = {
            city: registerCity.value.toUpperCase(),
            category: cat,
            from: registerMobileNumber,
            forward: true,
            subscribed: true,
            subCat: subCat
        };

        // var cat = registerCategory;

        // if (registerCategory === "OXYGEN CYLINDER/REFILL") {
        //   cat = "OXYGEN";
        // }
        // if (registerCategory === "HOSPITAL BED") {
        //   cat = "BED";
        // }

        // var response = {
        //   city: registerCity.value.toUpperCase(),
        //   category: cat,
        //   mobile: registerMobileNumber,
        // };


        setNoTwitterData(false);
        setIsSending(true);
        setTwitterLeadsData([]);
        Promise.resolve(agent.Tags.getTwitterData(response)).then(function (value) {
            // console.log("I am the status: ", value);
            if (value && value.mobileList && value.mobileList.length > 0) {



                props.showLoading();
                props.onClickTag(
                    cat,
                    registerCity,
                    (page) => agent.Articles.byTag(cat, registerCity.value, page),
                    agent.Articles.byTag(cat, registerCity.value)
                );

                localStorage.setItem('userMobile', registerMobileNumber);

                // setRegisterCity("");
                // setRegisterCategory("BED");
                // setRegisterMobileNumber("");
                // setShowRegister(false);
                setIsSending(false);
                // setSubscribeCity("");
                // setSubscribeMobile("");
                // setSubscribeCategory("BED");



                var toMob = [];
                // var mob = "";
                //   mob = toMobile.replace(/,/g, "\n");
                //   if (mob.split("\n").length > 0) {
                //     toMob = mob.split("\n");
                //   }
                toMob = value.mobileList.filter(function (el) {
                    return el != "";
                });
                toMob = [... new Set(toMob)];
                toMob = toMob.map((mb) => {

                    var pn = new PhoneNumber(mb, 'IN');
                    // console.log("I am the phone number::", pn.getNumber( 'international' ))
                    if (pn.isMobile()) {
                        return ({ mob: `${pn.getCountryCode()}${pn.getNumber('significant')}`, isClicked: false })
                    }

                })







                // console.log("I am to mob ::::::::::::", toMob)
                // setAllGenLink(toMob);


                setNoTwitterData(false);









                setTwitterLeadsData(toMob);
                // alert(`Request sent to ${value.data} Leads`);
            }
            else {
                setNoTwitterData(true);
                setIsSending(false);
                setTwitterLeadsData([]);
            }
        }, function (e) {
            setIsSending(false);
            setNoTwitterData(false);
            setTwitterLeadsData([]);
            console.error("Exception occured: ", e); // TypeError: Throwing
            alert("There was an error while sending message, we are sorry for the inconvenience please try after some time.")
        });
    }



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
                });
        }
        setOptions(myOptions);

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


    const redirectWhatsApp = (mo, index) => {
        let msg = message;

        if (!msg) {
            alert("Please enter message to be sent");
            return;
        }

        if (subscribeCategory == 'MEDICINE' && medicineName === "Other" && !otherMedicine) {
            alert("Please enter Medicine Name");
            return;
        }


        let allMob = twitterLeadsData;

        allMob[index].isClicked = true;
        setTwitterLeadsData([]);
        setTimeout(() => { setTwitterLeadsData(allMob); }, 200)

        window.open(`https://wa.me/${mo.mob}?text=${encodeURIComponent(msg)}`, "_blank");
    }

    const sendSMS = () => {



        if (!registerCity && !registerCity.value) {
            alert("Please select city");
            return;
        }
        // if (!registerMobileNumber) {
        //   alert("Please enter your mobile number");
        //   return;
        // }



        var cat = subscribeCategory;

        if (subscribeCategory === "OXYGEN CYLINDER/REFILL") {
            cat = "OXYGEN";
        }
        if (subscribeCategory === "HOSPITAL BED") {
            cat = "BED";
        }
        let subCat = '';
        switch (subscribeCategory) {
            case "OXYGEN CYLINDER/REFILL":
                subCat = o2Category;
                break;
            case "HOSPITAL BED":
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

        if (subscribeCategory == 'MEDICINE' && medicineName === "Other" && !otherMedicine) {
            alert("Please enter Medicine Name");
            return;
        }

        // var response = {
        //     city: registerCity.value.toUpperCase(),
        //     category: cat,
        //     from: registerMobileNumber,
        //     forward: true,
        //     subscribed: true,
        //     subCat: subCat
        // };
        let toMob = [];
        toMob = twitterLeadsData.map((mo) => {
            return mo.mob;
        })

        var request = {
            city: registerCity.value.toUpperCase(),
            category: cat,
            mobileList: toMob,
            message: message,
            from: registerMobileNumber,
            subCat: subCat,
            forward: (registerMobileNumber) ? true : false
        };


        // console.log("i AM REQUEST", request);
        // return;
        // var cat = registerCategory;

        // if (registerCategory === "OXYGEN CYLINDER/REFILL") {
        //   cat = "OXYGEN";
        // }
        // if (registerCategory === "HOSPITAL BED") {
        //   cat = "BED";
        // }

        // var response = {
        //   city: registerCity.value.toUpperCase(),
        //   category: cat,
        //   mobile: registerMobileNumber,
        // };


        // setNoTwitterData(false);
        setSendingSMS(true);
        // setTwitterLeadsData([]);
        Promise.resolve(agent.Tags.sendSMS(request)).then(function (value) {
            // console.log("I am the status: ", value);
            if (value === null) {



                props.showLoading();
                props.onClickTag(
                    cat,
                    registerCity,
                    (page) => agent.Articles.byTag(cat, registerCity.value, page),
                    agent.Articles.byTag(cat, registerCity.value)
                );

                localStorage.setItem('userMobile', registerMobileNumber);

                // setRegisterCity("");
                // setRegisterCategory("BED");
                // setRegisterMobileNumber("");
                // setShowRegister(false);
                // setSendingSMS(false);
                // setSubscribeCity("");
                // setSubscribeMobile("");
                // setSubscribeCategory("BED");



                // var toMob = [];
                // // var mob = "";
                // //   mob = toMobile.replace(/,/g, "\n");
                // //   if (mob.split("\n").length > 0) {
                // //     toMob = mob.split("\n");
                // //   }
                // toMob = value.mobileList.filter(function (el) {
                //     return el != "";
                // });
                // toMob = [... new Set(toMob)];
                // toMob = toMob.map((mb) => {

                //     var pn = new PhoneNumber(mb, 'IN');
                //     // console.log("I am the phone number::", pn.getNumber( 'international' ))
                //     if (pn.isMobile()) {
                //         return ({ mob: `${pn.getCountryCode()}${pn.getNumber('significant')}`, isClicked: false })
                //     }

                // })







                // console.log("I am to mob ::::::::::::", toMob)
                // setAllGenLink(toMob);


                // setNoTwitterData(false);





                setSendingSMS(false);



                // setTwitterLeadsData(toMob);
                alert(`Request sent to ${toMob.length} potential providers`);
            }
            else {
                // setNoTwitterData(true);
                setSendingSMS(false);
                // setTwitterLeadsData([]);
            }
        }, function (e) {
            setSendingSMS(false);
            // setNoTwitterData(false);
            // setTwitterLeadsData([]);
            console.error("Exception occured: ", e); // TypeError: Throwing
            alert("There was an error while sending message, we are sorry for the inconvenience please try after some time.")
        });










    }


    return (

        <div className={"d-flex align-items-center justify-content-center mt-2 registerContainer"}>
            <OverlayTrigger
                key={'bottom'}
                placement={'bottom'}
                overlay={
                    <Tooltip id={`tooltip-bottom`}>Reach out to Twitter verified leads</Tooltip>
                }
            >
                <div className={"w-100 p-3 h-100 d-flex align-items-center justify-content-center flex-column"} style={{ backgroundColor: "#f1f1f1", borderRadius: 5 }}>
                    <div className={"d-flex align-items-center justify-content-center text-center"} style={{ minHeight: 38 }}>
                        Verified Leads</div>
                    <Button
                        variant="primary"
                        onClick={handleRegisterShow}
                        className={"sendMessageBtn"}
                    >Reach</Button>
                </div>
            </OverlayTrigger>
            <Modal show={showRegister} onHide={handleRegisterClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Reach out to Verified Leads</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={'row'}>
                        <div className={'col-sm-12'}>
                            <div className="form-group row">
                                <label
                                    htmlFor="txtRegisterCity"
                                    className={"col-sm-2 col-form-label"}
                                >City</label>
                                <div className={"col-sm-6"}>
                                    <Select
                                        id={'registerCity'}
                                        styles={customStyles}
                                        name="registerCity"
                                        value={registerCity}
                                        placeholder={"Select City"}
                                        options={options}
                                        onChange={(text) => { setRegisterCity(text) }}
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
                                            return option.label.toLowerCase().startsWith(inputValue.toLowerCase());
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="form-group row">
                                <label htmlFor="selTag" className={"col-sm-2 col-form-label"}>Item</label>
                                <div className={"col-sm-6"}>
                                    <select
                                        onChange={(e) => {
                                            let cat = e.target.value;
                                            setSubscribeCategory(cat);

                                            if (cat === 'OXYGEN CYLINDER/REFILL') {
                                                setO2Category("O2 Cylinder");
                                                setMessage("Do you have O2 cylinder available. Need urgent help please 🙏🙏🙏");
                                            }
                                            if (cat === "HOSPITAL BED") {
                                                setBedOption("Plain Bed");
                                                setMessage(
                                                    "Need plain bed. Request your help urgently🙏🙏🙏"
                                                );
                                            }
                                            if (cat === "PLASMA") {
                                                setBloodGroup('O-');
                                                setMessage(
                                                    `Do you have PLASMA for O- bloodgroup available? Need Urgent help Please 🙏🙏🙏`
                                                );
                                            }
                                            if (cat === "MEDICINE") {
                                                setMedicineName('Remdesivir');
                                                setMessage(
                                                    "Do you have Remdesivir medicine available? Need urgent help please 🙏🙏🙏"
                                                );
                                            }

                                        }}
                                        value={subscribeCategory}
                                        className="form-control"
                                        name={"selTag"}
                                        id={"selTag"}
                                    >
                                        {props.tags &&
                                            props.tags.length > 0 &&
                                            props.tags.map((tg) => {
                                                if (tg === "OXYGEN") {
                                                    return (
                                                        <option
                                                            key={"OXYGEN CYLINDER/REFILL"}
                                                            value={"OXYGEN CYLINDER/REFILL"}
                                                        >
                                                            OXYGEN CYLINDER/REFILL
                                                        </option>
                                                    );
                                                }
                                                if (tg === "BED") {
                                                    return (
                                                        <option
                                                            key={"HOSPITAL BED"}
                                                            value={"HOSPITAL BED"}
                                                        >
                                                            HOSPITAL BED
                                                        </option>
                                                    );
                                                }
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

                            {subscribeCategory === "HOSPITAL BED" && (
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

                            {subscribeCategory === "PLASMA" && (
                                <div className="form-group row">
                                    <label
                                        htmlFor="selBloodGroup"
                                        style={{ lineHeight: 1.2 }}
                                        className={"col-sm-2 mb-0"}
                                    >
                                        Blood Group
                    </label>
                                    <div className={"col-sm-5"}>
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
                            {subscribeCategory === "MEDICINE" && (
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

                            {subscribeCategory === "OXYGEN CYLINDER/REFILL" && (
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
                                                        setMessage(
                                                            "Do you have O2 Cylinder available? Need urgent help please 🙏🙏🙏"
                                                        );
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
                                                        setMessage(
                                                            "Do you have O2 Refill available? Need urgent help please 🙏🙏🙏"
                                                        );
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
                                                        // setOtherMedicine("");
                                                        setMessage(
                                                            "Do you have O2 Concentrator available? Need urgent help please 🙏🙏🙏"
                                                        );
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

                            {subscribeCity &&
                                <div className={'form-group row'}>
                                    <div className={'col-sm-2'}></div>
                                    <div className={'col-sm-9'}>
                                        <span style={{ fontWeight: 500 }}>
                                            Message will be sent to &nbsp;
                      {
                                                (loadingCount) ? <FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#fa9234" }} /> :

                                                    <strong style={{ fontSize: 20 }}>{countNumbers}&nbsp;</strong>
                                            }
                      providers
                  </span>
                                    </div>
                                </div>
                            }




                            <div className="form-group row">
                                <label htmlFor="txtmessage" className={'col-sm-2'}>Message to be sent</label>
                                <div className={'col-sm-10'}>
                                    <textarea
                                        // readonly="true"
                                        rows={2}
                                        minLength="1"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="form-control"
                                        placeholder={"Please enter message to be sent"}
                                        id={"txtmessage"}
                                    ></textarea>
                                </div>
                            </div>


                            <div className={'form-group row'}>
                                <label className={"col-sm-2 col-form-label"}></label>
                                <div className={'col-sm-5'}>
                                    <Button
                                        variant="primary"
                                        disabled={isSending ? true : false}
                                        className={"sendMessageBtn"}
                                        onClick={handleRegisterSubmit}
                                    >

                                        {(isSending) && <FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} />} Fetch
                      </Button>
                                </div>
                            </div>


                            <div className={'form-group row'}>
                                <label className={"col-sm-2 col-form-label"}></label>
                                <div className={'col-sm-10'}>
                                    {(twitterLeadsData && twitterLeadsData.length > 0) && <small style={{ fontWeight: 600, display: 'block' }}>Found <strong>{twitterLeadsData.length}</strong> verified lead(s) from Twitter</small>}
                                    {(noTwitterData) && <small>Sorry, couldn't not find any verified leads</small>}
                                </div>
                            </div>


                            {(twitterLeadsData && twitterLeadsData.length > 0) && <div>
                                <small style={{ fontWeight: 500, marginBottom: 5 }}>* Please click each number to send message.</small>
                                <div className="form-group files" style={{ maxHeight: 200, overflowY: 'scroll' }}>
                                    <code>
                                        {(twitterLeadsData && twitterLeadsData.length > 0) &&
                                            twitterLeadsData.map((mo, index) => {
                                                if (mo) {
                                                    return (
                                                        <div key={mo.mob}>
                                                            <a style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => { redirectWhatsApp(mo, index) }}>{mo.mob}</a>
                                                            <a style={{ color: "#25d366", marginLeft: 8, cursor: 'pointer' }} onClick={() => { redirectWhatsApp(mo, index) }}>
                                                                <FontAwesomeIcon
                                                                    icon={faWhatsapp}
                                                                    style={{ color: "#25d366", marginLeft: 8 }}
                                                                /></a>
                                                            {mo.isClicked && <FontAwesomeIcon className={''} icon={faCheck} style={{ color: "#00b526", marginLeft: 5 }} />}
                                                        </div>
                                                    );
                                                }
                                            })
                                        }
                                    </code>
                                </div>
                            </div>}






                            <div className="form-group row">
                                <label
                                    htmlFor="txtRegisterMobileNumber"
                                    className={"col-sm-2"}
                                    style={{ lineHeight: 1 }}
                                >Your Mobile</label>
                                <div className={"col-sm-6"}>
                                    <input
                                        type="number"
                                        max="12"
                                        className="form-control"
                                        id="txtRegisterMobileNumber"
                                        aria-describedby="Enter Your Mobile"
                                        placeholder={"Enter Your Mobile"}
                                        value={registerMobileNumber}
                                        onChange={(e) => setRegisterMobileNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                            {/* <small style={{ fontWeight: 600 }}>*This will trigger a <strong>WhatsApp</strong> Message to all the verified leads from <strong>Twitter</strong> (last three days).</small> */}





                        </div>
                        {/* <div className={'col-sm-6'}>


                  {(loadingTwitter) ? <div className={'d-flex flex-column align-items-center justify-content-center'}>
                    <FontAwesomeIcon className={'rotate-icon loading-icon'} icon={faSpinner} style={{ color: "#fa9234" }} />
                    <span className={'loading-text'}>Loading Results</span>
                  </div> : <iframe id="iframe1" style={{ height: 430 }} className={'col-sm-12'}>
                    <p>Your browser does not support iframes.</p>
                  </iframe>}



                </div> */}
                    </div>



                    {(twitterLeadsData && twitterLeadsData.length > 0) && <div className={'form-group'}>
                        <small style={{ fontWeight: 500, marginBottom: 5 }}>
                            * SMS - you can send to all in one click. WhatsApp you will have to do one by one (still easier as we have generated the link for you).

      </small>
                    </div>}





                </Modal.Body>
                <Modal.Footer>

                    <Button
                        variant="primary"
                        disabled={(sendingSMS || (twitterLeadsData && twitterLeadsData.length <= 0)) ? true : false}
                        onClick={() => { sendSMS() }}
                        className={"sendMessageBtn"}
                    >
                        {(sendingSMS) && <FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} />} You can also send SMS
                </Button>


                    <Button variant="secondary" onClick={handleRegisterClose}>
                        Close
                </Button>
                    {/* <Button
                variant="primary"
                disabled={isSending ? true : false}
                onClick={handleRegisterSubmit}
                className={"sendMessageBtn"}
              >
                {(isSending) && <FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} />} Reach Now
                </Button> */}
                </Modal.Footer>
            </Modal>
        </div>

    );

}