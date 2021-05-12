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



// const GlobalFeedTab = (props) => {
//   let refreshDate = "";
//   if (props.refreshDate) {
//     var d = new Date(0);
//     d.setUTCSeconds(props.refreshDate);
//     var a = moment(d);
//     var b = moment();
//     refreshDate = b.diff(a, "days");
//   }
//   return (
//     <li className="nav-item">
//       <a
//         className={
//           props.tab === "all" ? "nav-link pt-0 active" : "nav-link pt-0"
//         }
//       >
//         <span style={{ fontSize: 25, fontWeight: 400, color: "#000" }}>
//           Latest Potential Leads For You
//         </span>{" "}
//         (showing results for '{props.city && props.tag}' in '
//         {props.city && props.city.value}')
//         {/* <small className={'ml-5'}>(Getting last {refreshDate} days messages)</small> */}
//       </a>
//     </li>
//   );
// };

// const TagFilterTab = (props) => {
//   if (!props.tag) {
//     return null;
//   }

//   return (
//     <li className="nav-item">
//       <a href="" className="nav-link active">
//         <i className="ion-pound"></i> {props.tag}
//       </a>
//     </li>
//   );
// };

const mapStateToProps = (state) => ({
  ...state.articleList,
  tags: state.home.tags,
  token: state.common.token,
});

const mapDispatchToProps = (dispatch) => ({
  onTabClick: (tab, pager, payload) =>
    dispatch({ type: CHANGE_TAB, tab, pager, payload }),
});

const MainView = (props) => {


  // console.log("I am tags:::::::::::::::::::::" + props.isLoading)

  // if(props.isLoading){
  // props.isLoading == false;
  // }

  const [show, setShow] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);


  const [city, setCity] = useState("");
  const [typeheadCity, setTypeHeadCity] = useState();
  const [selTag, setSelTag] = useState("BED");
  const [message, setMessage] = useState("");
  const [fromMobile, setFromMobile] = useState("");
  const [toMobile, setToMobile] = useState("");
  const [validResponse, setValidResponse] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [options, setOptions] = useState([]);

  const [loadingExtract, setLoadingExtract] = useState(false);

  const [modalCity, setModalCity] = useState([]);
  const ref = React.createRef();
  const fileInputRef = React.createRef();

  const [bedOption, setBedOption] = useState("Plain Bed");
  const [bloodGroup, setBloodGroup] = useState("O-");
  const [otherMedicine, setOtherMedicine] = useState("");
  const [medicineName, setMedicineName] = useState("Remdesivir");
  const [fromOption, setFromOption] = useState("one");
  const [o2Category, setO2Category] = useState("O2 Cylinder");

  const [registerCity, setRegisterCity] = useState("");
  const [typeheadRegisterCity, setTypeHeadRegisterCity] = useState();
  const [registerCategory, setRegisterCategory] = useState("BED");
  const [registerMobileNumber, setRegisterMobileNUmber] = useState("");

  const [subscribeCity, setSubscribeCity] = useState("");
  const [typeheadSubscribeCity, setTypeHeadSubscribeCity] = useState();
  const [subscribeCategory, setSubscribeCategory] = useState("BED");
  const [subscribeMobile, setSubscribeMobile] = useState("");

  const [extractedNumbers, setExtractedNumbers] = useState();

  const [loadingCount, setLoadingCount] = useState(false);
  const [disableExtract, setDisableExtract] = useState(true);

  const [countNumbers, setCountNumbers] = useState(0);


  const [selectedFile, setSelectedFile] = useState([]);

  const [copiedText, setCopiedText] = useState('');
  const [numbersCopiedStatus, setNumbersCopiedStatus] = useState(false);

  const [loadingTwitter, setLoadingTwitter] = useState(false);

  const [allGenLink, setAllGenLink] = useState('');

  const [sendMobileMsg, setSendMobileMsg] = useState('');




  const onFilesChange = (files) => {
    console.log(files);
    // if (selectedFile && selectedFile.length > 5) {
    //   alert("Maximum File upload limit exceeded: you can upload a maximum of 5 files");
    //   return;
    // }
    let collectedFiles = selectedFile;
    // return ;
    // console.log("I am the file ", event.target.files[0]);


    if (collectedFiles && collectedFiles.length >= 5) {
      alert("Maximum File upload limit exceeded: you can upload a maximum of 5 files");
      return;
    }

    files.map((file) => {
      if (collectedFiles && collectedFiles.length < 5) {
        collectedFiles.push(file);
      }
    });

    setSelectedFile([]);
    setTimeout(() => {
      setSelectedFile(collectedFiles);
    }, 300);

    console.log("I am the collected files length::::", collectedFiles.length)

    if (collectedFiles && collectedFiles.length === 0) {
      setDisableExtract(true);
    }
    else {
      setDisableExtract(false);
    }




  }
  const onFilesError = (error, file) => {
    alert("Invalid file uploaded please upload valid image file with format jpg, jpeg or png");
    // console.log('error code ' + error.code + ': ' + error.message)
  }




  const uploadFile = () => {
    console.log("I am the file ::::::::::::", selectedFile)

    let fileArray = [];


    let formData = new FormData();


    fileArray = selectedFile.map((file, index) => {
      // let fileData = new FormData();
      // return (fileData.append("file", file));
      // return file;
      formData.append(`file`, file)

      return formData;

    })
    // formData.append("file", selectedFile)
    let fileData = new FormData();

    fileData.append('file', fileArray)


    console.log("I am the file array here: ", fileArray);

    console.log("This is a form data::::::::", formData)

    // let inputRef = fileInputRef;

    // return;

    setIsSending(true);
    Promise.resolve(agent.Tags.putFile(fileData)).then(function (value) {
      // setMessage(value.data);
      setIsSending(false);
      // console.log("I am the value here dude: ", value);
      if (value && value.length > 0) {
        let text = '';

        value.map((number) => {
          text = text + number + '\n';
        });


        setDisableExtract(true);
        setExtractedNumbers(text);
        setSelectedFile([]);
      }


    }, function (e) {
      setIsSending(false);
      console.error("Exception occured: ", e); // TypeError: Throwing
      alert("There was an error while extracting numbers from image, we are sorry for the inconvenience please try after some time.")
    });

    // if (inputRef) {
    //   // console.log("file input", inputRef);

    //   inputRef.current.value = "";
    // }

  }

  const handleRegisterClose = () => setShowRegister(false);
  const handleRegisterShow = () => {
    setShowRegister(true);
    setRegisterCity("");
    setTypeHeadRegisterCity("");
    // setSubscribeCategory('OXYGEN CYLINDER/REFILL');
    setSubscribeCategory("HOSPITAL BED");
    setMedicineName('Remdesivir')
    setBedOption("Plain Bed")
    setRegisterCategory("HOSPITAL BED");
    setRegisterMobileNUmber(localStorage.getItem('userMobile') ? localStorage.getItem('userMobile') : '');
    setIsSending(false);
  };

  const handleClose = () => {
    setShow(false);

  };
  const handleShow = () => {
    setShow(true);
    setIsSending(false);
    setCity("");
    setTypeHeadCity("");
    setSelTag("BED");
    setMessage("Need plain bed. Request your help urgently🙏🙏🙏");
    setToMobile("");
    setBedOption("Plain Bed");
    setBloodGroup("O-");
    setOtherMedicine("");
    setMedicineName("Remdesivir");
    setFromOption("one");
    setFromMobile(localStorage.getItem('userMobile') ? localStorage.getItem('userMobile') : '');
    // Promise.resolve(agent.Tags.getMessages(selTag)).then(function (value) {
    //   setMessage(value.data);
    // }, function (e) {
    //   console.error("Exception occured: ", e); // TypeError: Throwing

    // });
  };

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

  const handleFileUploadClose = () => setShowFileUpload(false);
  const handleFileUploadShow = () => {
    setShowFileUpload(true);
    setExtractedNumbers('');
    setSelectedFile([]);
    // setSubscribeCity("");
    // setSubscribeCategory("OXYGEN");
    // setSubscribeMobile("");
  };



  // const [tg, setTg] = [
  //   { id: "Thailand", text: "Thailand" },
  //   { id: "India", text: "India" },
  // ];

  const handleSubmit = () => {
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
    var toMob = [];
    var mob = "";
    mob = toMobile.replace(/,/g, "\n");

    if (mob.split("\n").length > 0) {
      toMob = mob.split("\n");
    }

    toMob = toMob.filter(function (el) {
      return el != "";
    });
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
        setShow(false);
        setIsSending(false);
        alert("Request successfully submitted for " + toMob.length + " Numbers");
      }
    }, function (e) {
      setIsSending(false);
      console.error("Exception occured: ", e); // TypeError: Throwing
      alert("There was an error while sending message, we are sorry for the inconvenience please try after some time.")
    });
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


  const validResponseState = (e) => {
    // console.log("I am the valid response: ", e.target.checked);
    if (e.target.checked) {
      setValidResponse(true)
    }
    else {
      setValidResponse(false)
    }
    // props.onClickTag(props.tag, ev, page => agent.Articles.byTag(props.tag, ev.value, page), agent.Articles.byTag(props.tag, ev.value));
  }

  const showNumbersConnect = () => {
    handleShow();
    handleFileUploadClose();
    setTimeout(() => {
      setToMobile(extractedNumbers);
    }, 400)


  }


  const handleRegisterSubmit = () => {
    if (!registerCity && !registerCity.value) {
      alert("Please select city");
      return;
    }
    if (!registerMobileNumber) {
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

    setIsSending(true);
    Promise.resolve(agent.Tags.getSocialMedia(response)).then(function (value) {
      // console.log("I am the status: ", value);
      if (value) {



        props.showLoading();
        props.onClickTag(
          cat,
          registerCity,
          (page) => agent.Articles.byTag(cat, registerCity.value, page),
          agent.Articles.byTag(cat, registerCity.value)
        );

        localStorage.setItem('userMobile', registerMobileNumber);

        setRegisterCity("");
        setRegisterCategory("BED");
        setRegisterMobileNUmber("");
        setShowRegister(false);
        setIsSending(false);
        // setSubscribeCity("");
        // setSubscribeMobile("");
        setSubscribeCategory("BED");
        alert(`Request sent to ${value.data} Leads`);
      }
    }, function (e) {
      setIsSending(false);
      console.error("Exception occured: ", e); // TypeError: Throwing
      alert("There was an error while sending message, we are sorry for the inconvenience please try after some time.")
    });
  };



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
    // setTimeout(()=>{}, 200);

    console.log("I have some file", selectedFile);
    // if (selectedFile && selectedFile.length === 0) {



    // }
    if (selectedFile && selectedFile.length === 0) {
      setDisableExtract(true);
    }
    else {
      setDisableExtract(false);
    }
    // if (selectedFile) {
    //   uploadFile();
    // }
  }, [selectedFile])



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




  // useEffect(() => {


  //   if (registerCity && registerCity.value) {
  //     var cat = subscribeCategory;

  //     if (subscribeCategory === "OXYGEN CYLINDER/REFILL") {
  //       cat = "OXYGEN";
  //     }
  //     if (subscribeCategory === "HOSPITAL BED") {
  //       cat = "BED";
  //     }
  //     let subCat = '';
  //     switch (subscribeCategory) {
  //       case "OXYGEN CYLINDER/REFILL":
  //         subCat = o2Category;
  //         break;
  //       case "HOSPITAL BED":
  //         subCat = bedOption;
  //         break;
  //       case "MEDICINE":
  //         if (otherMedicine) {
  //           subCat = otherMedicine;
  //         }
  //         else {
  //           subCat = medicineName
  //         }
  //         break;
  //       case "PLASMA":
  //         subCat = bloodGroup;
  //         break;
  //     }

  //     var response = {
  //       city: registerCity.value.toUpperCase(),
  //       category: cat,
  //       from: registerMobileNumber,
  //       forward: true,
  //       subscribed: true,
  //       subCat: subCat
  //     };


  //     setLoadingTwitter(true);
  //     Promise.resolve(agent.Tags.getTwitterData(response)).then(function (value) {

  //       if (value) {


  //         setLoadingTwitter(false);

  //         console.log("I am the status: ", unescape(value.html));


  //         document.getElementById('iframe1').contentWindow.document.write("");
  //         document.getElementById('iframe1').contentWindow.document.write(unescape(value.html));
  //         // props.showLoading();
  //         // props.onClickTag(
  //         //   cat,
  //         //   registerCity,
  //         //   (page) => agent.Articles.byTag(cat, registerCity.value, page),
  //         //   agent.Articles.byTag(cat, registerCity.value)
  //         // );

  //         // localStorage.setItem('userMobile', registerMobileNumber);

  //         // setRegisterCity("");
  //         // setRegisterCategory("BED");
  //         // setRegisterMobileNUmber("");
  //         // setShowRegister(false);
  //         // setIsSending(false);
  //         // // setSubscribeCity("");
  //         // // setSubscribeMobile("");
  //         // setSubscribeCategory("BED");
  //         // alert(`Request sent to ${value.data} Leads`);
  //       }
  //     }, function (e) {
  //       setLoadingTwitter(false);
  //       console.error("Exception occured: ", e); // TypeError: Throwing
  //       alert("There was an error while sending message, we are sorry for the inconvenience please try after some time.")
  //     });




  //   }









  // }, [registerCity, subscribeCategory, o2Category, bedOption, otherMedicine, medicineName, bloodGroup])



  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: "#000000",
      padding: "10px",
    }),
  };
  const handleChange = (ev) => {
    props.showLoading();
    props.onClickTag(
      props.tag,
      ev,
      (page) => agent.Articles.byTag(props.tag, ev.value, page),
      agent.Articles.byTag(props.tag, ev.value)
    );
  };


  const redirectLink = (mo, index) => {
    let msg = message;


    let allMob = allGenLink;

    allMob[index].isClicked = true;
setAllGenLink([]);
setTimeout(()=>{setAllGenLink(allMob);}, 200)
    

    // console.log(msg, selTag);
    window.open(`https://wa.me/91${mo.mob}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <div className="col-md-12">
      <div className={"row"}>
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
              <Button variant="secondary" onClick={handleSubscribeClose}>
                Close
      </Button>
              <Button
                variant="primary"
                disabled={isSending ? true : false}
                onClick={handleSubscribeSubmit}
                className={"sendMessageBtn"}
              >
                {(isSending) && <FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} />} Send Request
      </Button>
            </Modal.Footer>
          </Modal>
        </div>








        <div
          className={
            "d-flex align-items-center justify-content-center singleClick mt-2"
          }
        >
          <OverlayTrigger
            key={'bottom'}
            placement={'bottom'}
            overlay={
              <Tooltip id={`tooltip-bottom`}>Helps to send WhatsApp Message to multiple numbers provided by you in single click.</Tooltip>
            }
          >
            <div
              className={
                "d-flex p-3 align-items-center justify-content-center flex-column w-100 h-100"
              }
              style={{ backgroundColor: "#f1f1f1", borderRadius: 5 }}
            >
              <div
                className={"d-flex align-items-center justify-content-center"}
                style={{ minHeight: 38 }}
              >
                Received too many numbers to connect?
              {/* Got <span style={{fontSize: 22, color: '#000', fontWeight: 500}}>~100</span> numbers to contact!<br/> */}
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

                  {/* <input
                    type="text"
                    className="form-control"
                    id="txtCity"
                    aria-describedby="Enter City"
                    placeholder={"Enter City"}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  /> */}
                </div>
              </div>
              <div className="form-group row">
                <label htmlFor="selTag" className={"col-sm-2 col-form-label"}>
                  Item
                  </label>
                <div className={"col-sm-5"}>
                  {/* <input type="text" className="form-control" id="txtCity" aria-describedby="Enter City" placeholder={'Enter City'} /> */}
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
                  minlength="1"
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
                    return ({ mob: mb, isClicked: false })
                  })
                  setAllGenLink(toMob);
                }}>Generate Links</button>
              </div>
              {allGenLink && <div className="form-group files" style={{ maxHeight: 200, overflowY: 'scroll' }}>
                <code>
                  {(allGenLink && allGenLink.length > 0) &&
                    allGenLink.map((mo, index) => {
                      return (<div key={mo.mobile}><a style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => { redirectLink(mo, index) }}>{mo.mob}</a> &nbsp;&nbsp;<a style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => { redirectLink(mo, index) }}>send</a> &nbsp;{mo.isClicked && <FontAwesomeIcon className={''} icon={faCheck} style={{ color: "#212121" }} />}</div>);
                    })
                  }
                </code>
              </div>}

              {/* <div className="form-group"> */}
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
              {/* <label
                  className="form-check-label d-flex align-items-center"
                  htmlFor="chktwo"
                  style={{ fontSize: 14 }}
                >
                  Please WhatsApp me responses on
                      <input max="12" value={fromMobile} onChange={(e) => setFromMobile(e.target.value)} type="number" className="form-control col-sm-5 ml-2" id="txtFromMobile" aria-describedby="Your Mobile Number" placeholder={'Enter Your Mobile'} />
                </label> */}
              {/* </div> */}
              {/* </div> */}
            </Modal.Body>
            <Modal.Footer>
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


        {/* <div className={'col-md-1  d-flex align-items-center justify-content-center'}><span style={{fontSize: 40, fontWeight: 500}}>or</span></div> */}




        <div
          className={
            "d-flex align-items-center justify-content-center mt-2 registerContainer"
          }
        >
          <OverlayTrigger
            key={'bottom'}
            placement={'bottom'}
            overlay={
              <Tooltip id={`tooltip-bottom`}>Reach out to Twitter verified leads</Tooltip>
            }
          >
            <div
              className={
                "w-100 p-3 h-100 d-flex align-items-center justify-content-center flex-column"
              }
              style={{ backgroundColor: "#f1f1f1", borderRadius: 5 }}
            >
              <div
                className={"d-flex align-items-center justify-content-center text-center"}
                style={{ minHeight: 38 }}
              >
                {/* Register as a provider{" "} */}
                Verified Leads from Twitter
              </div>
              <Button
                variant="primary"
                onClick={handleRegisterShow}
                className={"sendMessageBtn"}
              >
                Reach
            </Button>
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
                    >
                      City
                  </label>
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
                          // inputValue = inputValue.toLowerCase();
                          return option.label.toLowerCase().startsWith(inputValue.toLowerCase());
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group row">
                    <label htmlFor="selTag" className={"col-sm-2 col-form-label"}>Item</label>
                    <div className={"col-sm-6"}>
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
                      className={"col-sm-2"}
                      style={{ lineHeight: 1 }}
                    >
                      Your Mobile
                  </label>
                    <div className={"col-sm-6"}>
                      <input
                        type="text"
                        className="form-control"
                        id="txtRegisterMobileNumber"
                        aria-describedby="Enter Mobile Number"
                        placeholder={"Enter Your Mobile"}
                        value={registerMobileNumber}
                        onChange={(e) => setRegisterMobileNUmber(e.target.value)}
                      />
                    </div>
                  </div>
                  <small style={{ fontWeight: 600 }}>*This will trigger a <strong>WhatsApp</strong> Message to all the verified leads from <strong>Twitter</strong> (last three days).</small>





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









            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleRegisterClose}>
                Close
                </Button>
              <Button
                variant="primary"
                disabled={isSending ? true : false}
                onClick={handleRegisterSubmit}
                className={"sendMessageBtn"}
              >
                {(isSending) && <FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} />} Reach Now
                </Button>
            </Modal.Footer>
          </Modal>
        </div>

        <div
          className={
            "d-flex align-items-center justify-content-center mt-2 extractContainer"
          }
          style={{}}
        >
          {/* <OverlayTrigger
            key={'bottom'}
            placement={'bottom'}
            overlay={
              // <Tooltip id={`tooltip-bottom`}>If you are a owner/service provider who can help people then you can register here. You will get messages from people asking for help.</Tooltip>
            }
          > */}
          <div
            className={
              "w-100 p-3 h-100 d-flex align-items-center justify-content-center flex-column"
            }
            style={{ backgroundColor: "#f1f1f1", borderRadius: 5 }}
          >
            <div
              className={"d-flex align-items-center justify-content-center text-center"}
              style={{ minHeight: 38 }}
            >
              Extract numbers from image
              </div>


            <Button

              variant="primary"
              onClick={handleFileUploadShow}
              className={"sendMessageBtn"}
            // disabled
            // style={{ fontSize: 10, padding: '.175rem .75rem' }}
            >
              {/* Coming Soon */}
              Extract
            </Button>

          </div>
          {/* </OverlayTrigger> */}
          <Modal show={showFileUpload} onHide={handleFileUploadClose} dialogClassName="modal-40w">
            <Modal.Header closeButton>
              <Modal.Title>Extract Phone Numbers</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="form-group">










                {/* <label for="uploadImage">Upload Image</label> */}


                {/* <label htmlFor="filePicker" style={{ background:"grey", padding:"5px 10px" }}>
Upload Image to Extract Numbers */}
                {/* <input id="filePicker" style={{visibility:"hidden"}} type={"file"}> */}
                {/* <input type="file"
                  accept="image/*"
                  class="form-control-file d-none"
                  id="uploadImage"
                  ref={fileInputRef}
                  // value={"Upload Image"}
                  onChange={(event) => {
                    // this.readFile(event) 
                    // let photo = document.getElementById("image-file").files[0];
                    console.log("I am the file ", event.target.files[0]);
                    setSelectedFile(event.target.files[0]);

                    setDisableExtract(false);
                    // let formData = new FormData();

                    // formData.append("photo", photo);

                  }}
                // style={{visibility:"hidden"}}
                /> */}
                {/* <label for="uploadImage" className={'btn sendMessageBtn'}>Click here to upload file</label> */}





                <div className="files">
                  <Files
                    className='files-dropzone'
                    onChange={onFilesChange}
                    onError={onFilesError}
                    accepts={['image/png', 'image/jpg', 'image/jpeg',]}
                    multiple
                    maxFileSize={10000000}
                    minFileSize={0}
                    clickable
                  >
                    <span className={'w-100 d-flex align-items-center justify-content-center text-center flex-column pt-3 pb-3'} style={{ display: 'block', marginBottom: 10 }}>
                      Drop files here or click to add files<small style={{ display: 'block' }}>(Maximum 5 files)</small></span>
                  </Files>
                  <div className={'pt-2 mt-3'} style={{ borderTop: '1px solid #ddd' }}>
                    {(selectedFile && selectedFile.length > 0) ? selectedFile.map((file, index) => {
                      return (<p key={file.id}><strong>File:</strong> {file.name} <span onClick={() => {
                        let arr = selectedFile.filter(function (fl) {
                          return fl.id !== file.id
                        })
                        setSelectedFile(arr);
                      }} className={'close-icon'}><FontAwesomeIcon className={''} icon={faTimes} /></span></p>);
                    }) : <p>No file added</p>}
                  </div>


                </div>
















                {/* </label> */}


              </div>
              <div className="form-group">




                <Button
                  disabled={(isSending || disableExtract) ? true : false}
                  variant="primary"
                  onClick={uploadFile}
                  className={"sendMessageBtn"}
                >
                  {/* <FontAwesomeIcon icon={faSpinner} style={{ color: "#ffffff" }} />  */}
                  {(isSending) ? <React.Fragment><FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} /> Extracting Number(s)</React.Fragment> : <span>Extract Numbers</span>}

                </Button>



              </div>
              {/* <div class="form-group">
                <label></label>
                <div>{(extractedNumbers) && extractedNumbers.map((number) => <span style={{ display: 'block' }}>{number}</span>)}</div>
              </div> */}

              {(extractedNumbers && extractedNumbers.length > 0) &&
                <div className="form-group">
                  <label
                    htmlFor="txtRegisterMobileNumber"
                    className={"col-form-label"}
                  >
                    List of extracted numbers from image
                  </label>
                  <div className={""}>
                    {/* <input
                    type="text"
                    className="form-control"
                    id="txtRegisterMobileNumber"
                    aria-describedby="Enter Mobile Number"
                    placeholder={"Enter Your Mobile"}
                    value={registerMobileNumber}
                    onChange={(e) => setRegisterMobileNUmber(e.target.value)}
                  /> */}
                    {/* <div className="img-thumbnail" style={{ height: 200, overflowY: 'scroll' }}> */}
                    {/* <textarea
                      style={{ fontSize: 14 }}
                      // value={toMobile}
                      rows={4}
                      // onChange={(e) => setToMobile(e.target.value)}
                      // type="text"
                      className="form-control"
                    // id="txtToMobile"
                    // aria-describedby="Enter Mobile Number"
                    // placeholder={
                    //   "List of mobile numbers separated by comma(,) or new line, all number formats accepted"
                    // }


                    > */}
                    {/* <code style={{ color: '#888888' }}>
                        <ul class="list-unstyled m-0" >
                          {(extractedNumbers) && extractedNumbers.map((number) => <li>{number}</li>)}
                        </ul>
                      </code> */}

                    {/* </textarea> */}




                    {/* </div> */}
                    <code>
                      <textarea ref={ref} rows={8} className="form-control" onClick={(e) => { e.target.focus(); e.target.select() }} style={{ fontSize: 14 }} value={(extractedNumbers) && extractedNumbers}></textarea>
                    </code>



                  </div>
                </div>

              }

            </Modal.Body>
            <Modal.Footer>

              {/* <Button disabled={(extractedNumbers && extractedNumbers.length > 0) ? false : true} variant="primary" className={"sendMessageBtn"} onClick={
                () => {
                  // ref.focus();
                  ref.current.focus();
                  ref.current.select();
                }

              }>Select All</Button> */}

              <CopyToClipboard text={(extractedNumbers && extractedNumbers.length > 0) ? extractedNumbers : false}
                onCopy={() => { setNumbersCopiedStatus(true); setTimeout(() => { setNumbersCopiedStatus(false); }, 10000) }}>
                <Button disabled={(extractedNumbers && extractedNumbers.length > 0) ? false : true} variant="primary" className={"sendMessageBtn"}>
                  {(numbersCopiedStatus) ? 'Copied to Clipboard...' : 'Copy Numbers'}
                </Button>
              </CopyToClipboard>

              {/* {(extractedNumbers && extractedNumbers.length > 0) && */}
              {/* <Button
                variant="primary"
                disabled={(extractedNumbers && extractedNumbers.length > 0) ? false : true}
                onClick={showNumbersConnect}
                className={"sendMessageBtn"}
              >
                One Click WhatsApp Sending
                </Button> */}
              {/* } */}
              <Button variant="secondary" onClick={handleFileUploadClose}>Close</Button>


              {/* <Button
                variant="primary"
                // disabled={isSending ? true : false}
                // onClick={handleRegisterSubmit}
                className={"sendMessageBtn"}
              >
                 Copy
                </Button> */}

              {/* <Button
                variant="primary"
                disabled={isSending ? true : false}
                onClick={handleRegisterSubmit}
                className={"sendMessageBtn"}
              >
                {(isSending) && <FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} />} Extract
                </Button> */}
            </Modal.Footer>
          </Modal>
        </div>

      </div>

      <div
        className={"mt-3 row"}
        style={{ background: "#f1f1f1", borderRadius: 5 }}
      >
        <div className={"pl-3 pt-3 d-flex align-items-center w-100"}>
          <span style={{ fontSize: 25, fontWeight: 400, color: "#000" }}>
            Latest Potential Leads For You
          </span>
          <div className="form-check ml-5">
            <input type="checkbox" className="form-check-input" id="exampleCheck1" onChange={validResponseState} />
            <label className="form-check-label" style={{ fontWeight: 600 }} htmlFor="exampleCheck1">Show Verified Leads Only</label>
          </div>
          {/* <div className={'col-sm-2 d-flex align-items-end justify-content-end'}> */}
          {/* <button on className={'btn btn-dark mb-2'}>Valid Response</button> */}
          {/* <input type="checkbox" class="form-check-input" id="exampleCheck1"/> */}

          {/* </div> */}

          {/* (showing results for '{(props.city) && props.tag}' in '{(props.city) && props.city.value}') */}
        </div>
        <div className={"col-md-12 py-3"}>
          <div className={"row"}>
            <div
              className={
                "d-flex align-items-center justify-content-start w-100 col-sm-9 col-md-3"
              }
            >
              <span className={"mr-2"}>City </span>
              <div className={"w-100"}>
                <Select
                  styles={customStyles}
                  name="form-field-name"
                  value={props.city}
                  options={options}
                  onChange={handleChange}
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

            <div className={"col-sm-9 col-md-9 d-flex align-items-center tagsContainer"}>
              {/* <h4 className="help-header">I want help in finding </h4> */}
              <Tags
                city={props.city}
                tag={props.tag}
                tags={props.tags}
                onClickTag={props.onClickTag}
                showLoading={props.showLoading}
              />
            </div>
          </div>

          <div className={"mt-4"}>
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                {/* <GlobalFeedTab tab={props.tab} onTabClick={props.onTabClick} city={props.city} tag={props.tag} refreshDate={props.refreshDate} /> */}
              </ul>
            </div>
          </div>

          {props.isLoading ?
            <div className={'d-flex flex-column align-items-center justify-content-center'}>
              <FontAwesomeIcon className={'rotate-icon loading-icon'} icon={faSpinner} style={{ color: "#fa9234" }} />
              <span className={'loading-text'}>Loading Results</span>
            </div>
            :
            <ArticleList
              pager={props.pager}
              articles={props.articles}
              loading={props.loading}
              articlesCount={props.articlesCount}
              validResponse={validResponse}
              currentPage={props.currentPage}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
