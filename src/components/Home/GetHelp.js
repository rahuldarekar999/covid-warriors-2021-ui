import React, { useState, useEffect } from "react";
import agent from "../../agent";
import Select from "react-select";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";

// import { Typeahead, Menu, MenuItem } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';


export default function GetHelp(props){


  const [showSubscribe, setShowSubscribe] = useState(false);
  
  const [isSending, setIsSending] = useState(false);

  const [options, setOptions] = useState([]);

  const [bedOption, setBedOption] = useState("Plain Bed");
  const [bloodGroup, setBloodGroup] = useState("O-");
  const [otherMedicine, setOtherMedicine] = useState("");
  const [medicineName, setMedicineName] = useState("Remdesivir");
  const [o2Category, setO2Category] = useState("O2 Cylinder");

  const [subscribeCity, setSubscribeCity] = useState("");
  const [typeheadSubscribeCity, setTypeHeadSubscribeCity] = useState();
  const [subscribeCategory, setSubscribeCategory] = useState("BED");
  const [subscribeMobile, setSubscribeMobile] = useState("");


  const [loadingCount, setLoadingCount] = useState(false);

  const [countNumbers, setCountNumbers] = useState(0);

  

  const handleSubscribeClose = () => setShowSubscribe(false);
  const handleSubscribeShow = () => {
    setShowSubscribe(true);
    setSubscribeCity("");
    setTypeHeadSubscribeCity("");
    setSubscribeCategory("HOSPITAL BED");
    setMedicineName('Remdesivir')
    setBedOption("Plain Bed")
    setSubscribeMobile(localStorage.getItem('userMobile') ? localStorage.getItem('userMobile') : '');
    setCountNumbers(0);
  };


  const handleSubscribeSubmit = () => {
    if (!subscribeCity && !subscribeCity.value) {
      alert("Please select city");
      return;
    }
    if (!subscribeMobile) {
      alert("Please enter your mobile number");
      return;
    }

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
      city: subscribeCity.value.toUpperCase(),
      category: cat,
      from: subscribeMobile,
      forward: true,
      subscribed: true,
      subCat: subCat
    };

    // alert(`Request successfully queued to ${countNumbers} provider(s)`);
    // return;

    setIsSending(true);
    Promise.resolve(agent.Tags.subscribe(response)).then(function (value) {
      // console.log("I am the status: ", value);
      if (value === null) {

        props.showLoading();
        props.onClickTag(
          cat,
          subscribeCity,
          (page) => agent.Articles.byTag(cat, subscribeCity.value, page),
          agent.Articles.byTag(cat, subscribeCity.value)
        );


        localStorage.setItem('userMobile', subscribeMobile);
        setSubscribeCity("");
        setSubscribeMobile("");
        setSubscribeCategory("BED");
        setIsSending(false);
        // alert("Successfully sent request");
        alert(`Request successfully queued to ${countNumbers} provider(s)`);

        setShowSubscribe(false);
      }
    }, function (e) {
      setIsSending(false);
      console.error("Exception occured: ", e); // TypeError: Throwing
      alert("There was an error while sending message, we are sorry for the inconvenience please try after some time.")
    });
  };

  const sendSMS = () => {



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


    return(

        <div
          className={
            "d-flex align-items-center justify-content-center leadContainer mt-2"
          }
        >
          {/* <div className={''} style={{backgroundColor: '#f1f1f1', borderRadius: 5}} > */}
          <OverlayTrigger
            key={'bottom'}
            placement={'bottom'}
            overlay={
              <Tooltip id={`tooltip-bottom`}>Get instant help on O<sub>2</sub>, Bed, Medicine and Plasma</Tooltip>
            }
          >
            <div
              className={
                "w-100 p-3 h-100 d-flex align-items-center justify-content-center flex-column"
              }
              style={{ backgroundColor: "#f1f1f1", borderRadius: 5 }}
            >
              <div
                className={"d-flex align-items-center justify-content-center"}
                style={{ minHeight: 38 }}
              >
                {/* Leads Directly in your WhatsApp */}
      Get help now
    </div>
              <Button
                variant="primary"
                onClick={handleSubscribeShow}
                className={"sendMessageBtn"}
              >
                Help Me
  </Button>
            </div>
          </OverlayTrigger>
          <Modal show={showSubscribe} onHide={handleSubscribeClose}>
            <Modal.Header closeButton>
              <Modal.Title>Please Help me with</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group row">
                <label
                  htmlFor="txtCity"
                  className={"col-sm-2 col-form-label"}
                >
                  City
        </label>
                <div className={"col-sm-5"}>
                  {/* <Typeahead
                    // allowNew={true}
                    id={'subscribeCity'}
                    // placeholder={"Enter City"}
                    placeholder={'Enter City'}
                    style={{ textTransform: 'uppercase' }}
                    // ref={ref}
                    onInputChange={(text, e) => { setSubscribeCity(text); }}
                    onChange={(selected) => {
                      // this.setState({selected});
                      // console.log("I am the city here: ", selected)
                      setTypeHeadSubscribeCity(selected)
                      setSubscribeCity((selected && selected.length > 0) && selected[0].value);
                    }}
                    labelKey={option => `${option.value}`}
                    options={options}
                    // className="form-control"
                    // options={(props && props.cityArray) && props.cityArray}
                    selected={typeheadSubscribeCity}
                    renderMenu={(results, menuProps) => {
                      // console.log("I am the results in the city::::::::::::::::::::::::::::::::::::::", results)
                      return (<Menu {...menuProps}>
                        {results.map((result, index) => (
                          <MenuItem key={index} option={result} position={index}>
                            {result.label}
                          </MenuItem>
                        ))}
                      </Menu>)
                    }}
                  /> */}
                  <Select
                    id={'subscribeCity'}
                    styles={customStyles}
                    name="subscribeCity"
                    value={subscribeCity}
                    placeholder={"Select City"}
                    options={options}
                    onChange={(text) => { setSubscribeCity(text) }}
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




                  {/* <input
          type="text"
          className="form-control"
          id="txtCity"
          aria-describedby="Enter City"
          placeholder={"Enter City"}
          value={subscribeCity}
          onChange={(e) => setSubscribeCity(e.target.value)}
        /> */}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="selTag" className={"col-sm-2 col-form-label"}>Item</label>
                <div className={"col-sm-5"}>
                  {/* <input type="text" className="form-control" id="txtCity" aria-describedby="Enter City" placeholder={'Enter City'} /> */}
                  <select
                    onChange={(e) => {
                      // setSubscribeCategory(e.target.value);
                      let cat = e.target.value;
                      setSubscribeCategory(cat);
                      setO2Category("O2 Cylinder");
                      setBedOption("Plain Bed");
                      setBloodGroup("O-");
                      setMedicineName("Remdesivir");
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
                          // setMessage(
                          //   "Need plain bed. Request your help urgently🙏🙏🙏"
                          // );
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
                          // setMessage(
                          //   "Need O2 bed urgently. Request your help urgently🙏🙏🙏"
                          // );
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
                          // setMessage(
                          //   "Need ventilator bed very urgently. Request your help urgently🙏🙏🙏"
                          // );
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
                    {/* <input type="text" className="form-control" id="txtCity" aria-describedby="Enter City" placeholder={'Enter City'} /> */}
                    <select
                      onChange={(e) => {
                        let targetValue = e.target.value;
                        setBloodGroup(targetValue);
                        // setMessage(
                        //   `Do you have PLASMA for ${targetValue} bloodgroup available? Need Urgent help Please 🙏🙏🙏`
                        // );
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
                            // setMessage(
                            //   "Do you have Remdesivir medicine available? Need urgent help please 🙏🙏🙏"
                            // );
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
                            // setMessage(
                            //   "Do you have Tocilizumab medicine available? Need urgent help please 🙏🙏🙏"
                            // );
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
                            // setMessage(
                            //   "Do you have ____ medicine available? Need urgent help please 🙏🙏🙏"
                            // );
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
                            // if (e.target.value === "") {
                            // setMessage(
                            //   `Do you have ____ medicine available? Need urgent help please 🙏🙏🙏`
                            // );
                            // } else {
                            // setMessage(
                            //   `Do you have ${e.target.value} medicine available? Need urgent help please 🙏🙏🙏`
                            // );
                            // }
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
                <label
                  htmlFor="txtRegisterMobileNumber"
                  className={"col-sm-2 col-form-label"}
                >
                  Mobile
        </label>
                <div className={"col-sm-5"}>
                  <input
                    type="text"
                    className="form-control"
                    id="txtRegisterMobileNumber"
                    aria-describedby="Enter Your Mobile"
                    placeholder={"Enter Your Mobile"}
                    value={subscribeMobile}
                    onChange={(e) => setSubscribeMobile(e.target.value)}
                  />
                </div>
              </div>
              <small style={{ fontWeight: 600 }}>
                {/* *All leads for the selected city and category will be
      forwarded to given mobile number */}
                {/* Also will send you the verified leads from last 24 hrs. */}

      * You will start receiving response from providers on given mobile. Also will send you verified leads since last 24 hrs.
      </small>
            </Modal.Body>
            <Modal.Footer>
              
              <Button
                variant="primary"
                disabled={isSending ? true : false}
                onClick={handleSubscribeSubmit}
                className={"sendMessageBtn"}
              >
                {(isSending) && <FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} />} Send Request
      </Button>
      <Button variant="secondary" onClick={handleSubscribeClose}>
                Close
      </Button>
            </Modal.Footer>
          </Modal>
        </div>
    );
}