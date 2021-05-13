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




export default function ExtractNumbers(props) {


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

    );
}