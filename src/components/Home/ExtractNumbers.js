
import React, { useState, useEffect } from "react";
import agent from "../../agent";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import Files from 'react-files'
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PhoneNumber from 'awesome-phonenumber';

export default function ExtractNumbers(props) {

    const [showFileUpload, setShowFileUpload] = useState(false);
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [sendingSMS, setSendingSMS] = useState(false);
    const [extractedNumbers, setExtractedNumbers] = useState('');
    const [disableExtract, setDisableExtract] = useState(true);
    // const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [numbersCopiedStatus, setNumbersCopiedStatus] = useState(false);
    const [allGenLink, setAllGenLink] = useState([]);

    // const [options, setOptions] = useState([]);
    // const [registerCity, setRegisterCity] = useState("");

    const fileInputRef = React.createRef();


    // const onFilesChange = (files) => {

    //     let collectedFiles = selectedFile;
    //     if (collectedFiles && collectedFiles.length >= 5) {
    //         alert("Maximum File upload limit exceeded: you can upload a maximum of 5 files");
    //         return;
    //     }
    //     files.map((file) => {
    //         if (collectedFiles && collectedFiles.length < 5) {
    //             collectedFiles.push(file);
    //         }
    //     });
    //     // setSelectedFile([]);
    //     setSelectedFile('');
    //     setTimeout(() => {
    //         setSelectedFile(collectedFiles);
    //     }, 300);
    //     if (collectedFiles && collectedFiles.length === 0) {
    //         setDisableExtract(true);
    //     }
    //     else {
    //         setDisableExtract(false);
    //     }
    // }

    // const onFilesError = (error, file) => {
    //     alert("Invalid file uploaded please upload valid image file with format jpg, jpeg or png");
    // }


    const uploadFile = () => {
        // console.log("I am the file ::::::::::::", selectedFile)

        // let fileArray = [];


        // let formData = new FormData();


        // fileArray = selectedFile.map((file, index) => {
        //   // let fileData = new FormData();
        //   // return (fileData.append("file", file));
        //   // return file;
        //   formData.append(`file`, file)

        //   return formData;

        // })
        // formData.append("file", selectedFile)
        let fileData = new FormData();

        fileData.append('file', selectedFile)


        // console.log("I am the file array here: ", fileArray);

        // console.log("This is a form data::::::::", formData)

        // let inputRef = fileInputRef;

        // return;

        setIsSending(true);
        Promise.resolve(agent.Tags.putFile(fileData)).then(function (value) {
            // setMessage(value.data);
            setIsSending(false);
            // console.log("I am the value here dude: ", value);
            //   if (value && value.length > 0) {
            //     let text = '';

            //     value.map((number) => {
            //       text = text + number + '\n';
            //     });


            //     setDisableExtract(true);
            //     setExtractedNumbers(text);
            //     // setSelectedFile([]);
            //     setSelectedFile('');
            //   }


            if (value && value.length > 0) {
                let text = '';
                let toMob = [];
                value = [... new Set(value)];
                value = value.filter(function (el) {
                    return el != "";
                });
                value.map((number) => {
                    text = text + number + '\n';
                });

                setExtractedNumbers(text);
                toMob = value.filter(function (el) {
                    return el != "";
                });

                // toMob = toMob.map((mb) => {
                //     // return ({ mob: mb, isClicked: false })

                //     var pn = new PhoneNumber(mb, 'IN');
                //     // console.log("I am the phone number::", pn.getNumber( 'international' ))
                //     if (pn.isMobile()) {
                //         return (pn.getCountryCode()+pn.getNumber('significant'))
                //     }
                // })

                // console.log("I am the new set here::", toMob)
                toMob = [... new Set(toMob)];

                toMob = toMob.map((mb) => {
                    // return ({ mob: mb, isClicked: false })

                    var pn = new PhoneNumber(mb, 'IN');
                    // console.log("I am the phone number::", pn.getNumber( 'international' ))
                    if (pn.isMobile()) {
                        return ({ mob: `${pn.getCountryCode()}${pn.getNumber('significant')}`, isClicked: false })
                    }
                })

                setAllGenLink(toMob);
            }
            else {
                setExtractedNumbers('');
                setAllGenLink([]);
            }
            setIsSending(false);
            setDisableExtract(true);
            setSelectedFile('');










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


    useEffect(() => {
        // setTimeout(()=>{}, 200);

        // console.log("I have some file", selectedFile);
        // if (selectedFile && selectedFile.length === 0) {


        // console.log("I am the selected file :" ,selectedFile)
        // }
        if (selectedFile) {
            setDisableExtract(false);
            uploadFile();
        }
        else {
            setDisableExtract(true);
        }
        // if (selectedFile) {
        //   uploadFile();
        // }
    }, [selectedFile])


    // const uploadFile = () => {
    //     let formData = new FormData();
    //     selectedFile.map((file) => {
    //         formData.append("file", file);
    //     })
    //     setIsSending(true);
    //     Promise.resolve(agent.Tags.putFile(formData)).then(function (value) {
    //         if (value && value.length > 0) {
    //             let text = '';
    //             let toMob = [];
    //             value.map((number) => {
    //                 text = text + number + '\n';
    //             });
    //             setExtractedNumbers(text);
    //             toMob = value.filter(function (el) {
    //                 return el != "";
    //             });
    //             toMob = value.map((mb) => {
    //                 // return ({ mob: mb, isClicked: false })

    //                 var pn = new PhoneNumber( mb, 'IN' );
    //                 // console.log("I am the phone number::", pn.getNumber( 'international' ))
    //                 if(pn.isMobile()){
    //                     return ({ mob: `${pn.getCountryCode( )}${pn.getNumber( 'significant' )}`, isClicked: false })
    //                 }
    //             })
    //             toMob = [... new Set(toMob)];
    //             setAllGenLink(toMob);
    //         }
    //         else {
    //             setExtractedNumbers('');
    //             setAllGenLink([]);
    //         }
    //         setIsSending(false);
    //         setDisableExtract(true);
    //         setSelectedFile([]);

    //     }, function (e) {
    //         setIsSending(false);
    //         console.error("Exception occured: ", e); // TypeError: Throwing
    //         alert("There was an error while extracting numbers from image, we are sorry for the inconvenience please try after some time.")
    //     });
    // }

    const handleFileUploadClose = () => setShowFileUpload(false);
    const handleFileUploadShow = () => {
        setShowFileUpload(true);
        setExtractedNumbers('');
        // setSelectedFile([]);
        setSelectedFile('');
        setAllGenLink([]);
        setMessage('');
        setDisableExtract(true);
    };

    const redirectLink = (mo, index) => {
        let msg = message;
        if (!msg) {
            alert("Please enter message to be sent")
            return;
        }
        let allMob = allGenLink;
        allMob[index].isClicked = true;
        setAllGenLink([]);
        setTimeout(() => { setAllGenLink(allMob); }, 200)
        window.open(`https://wa.me/${mo.mob}?text=${encodeURIComponent(msg)}`, "_blank");
    }

    const handleSendSMS = () => {
        setSendingSMS(true);
        setTimeout(() => { setSendingSMS(false) }, 8000)
    }



    // useEffect(() => {
    //     let myOptions = [], sortedCity = [];

    //     if (props.cityArray && props.cityArray.length > 0) {

    //         sortedCity = props.cityArray.map((city) => {
    //             return city.trim();
    //         });

    //         sortedCity = sortedCity.sort();
    //         sortedCity = [... new Set(sortedCity)];

    //         sortedCity &&
    //             sortedCity.length > 0 &&
    //             sortedCity.map((ct) => {
    //                 myOptions.push({ value: ct, label: ct });
    //             });
    //     }
    //     setOptions(myOptions);

    // }, [props.cityArray]);



    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            color: "#000000",
            padding: "10px",
        }),
    };


    return (

        <div className={"d-flex align-items-center justify-content-center mt-2 extractContainer"}>
            {/* <OverlayTrigger
            key={'bottom'}
            placement={'bottom'}
            overlay={
              // <Tooltip id={`tooltip-bottom`}>If you are a owner/service provider who can help people then you can register here. You will get messages from people asking for help.</Tooltip>
            }
          > */}
            <div className={"w-100 p-3 h-100 d-flex align-items-center justify-content-center flex-column"} style={{ backgroundColor: "#f1f1f1", borderRadius: 5 }}>
                <div className={"d-flex align-items-center justify-content-center text-center"} style={{ minHeight: 38 }}>Extract numbers from image</div>
                <Button variant="primary" onClick={handleFileUploadShow} className={"sendMessageBtn"}>Extract</Button>
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
                        <input type="file"
                            accept="image/*"
                            className="form-control-file d-none"
                            id="uploadImage"

                            ref={fileInputRef}
                            // value={"Upload Image"}
                            onChange={(event) => {
                                // this.readFile(event) 
                                // let photo = document.getElementById("image-file").files[0];
                                // console.log("I am the file ", event.target.files[0]);
                                setSelectedFile(event.target.files[0]);

                                setDisableExtract(false);
                                // let formData = new FormData();

                                // formData.append("photo", photo);

                            }}
                        // style={{visibility:"hidden"}}
                        />
                        <label htmlFor="uploadImage" className={'btn sendMessageBtn'}>Click here to upload file</label>

                        {/* <div className="files">
                            <Files
                                className='files-dropzone'
                                onChange={onFilesChange}
                                onError={onFilesError}
                                maxFiles={5}
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
                        </div> */}
                    </div>
                    <div className="form-group">
                        <Button
                            disabled={(isSending || disableExtract) ? true : false}
                            variant="primary"
                            onClick={uploadFile}
                            className={"sendMessageBtn"}
                        >
                            {(isSending) ? <React.Fragment><FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} /> Extracting Number(s)</React.Fragment> : <span>Extract Numbers</span>}
                        </Button>
                    </div>


























                    {/* <div className="form-group row">
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
                    </div> */}


































                    {/* <div class="form-group">
                <label></label>
                <div>{(extractedNumbers) && extractedNumbers.map((number) => <span style={{ display: 'block' }}>{number}</span>)}</div>
              </div> */}
                    {(allGenLink && allGenLink.length > 0) && <div className="form-group">
                        <label htmlFor="txtmessage">
                            Message to be sent
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
                            placeholder={"Please enter message to be sent"}
                            id={"txtmessage"}
                        ></textarea>
                    </div>}

                    {/* <div className="form-group">
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
                  toMob = [... new Set(toMob)]
                  setAllGenLink(toMob);
                }}>Generate Links</button>
              </div> */}

                    {(allGenLink && allGenLink.length > 0) &&
                        <div>
                            <small style={{ fontWeight: 500, marginBottom: 5 }}>* Please click each number to send message.</small>
                            <div className="form-group files" style={{ maxHeight: 200, overflowY: 'scroll' }}>
                                <code>
                                    {(allGenLink && allGenLink.length > 0) &&
                                        allGenLink.map((mo, index) => {
                                            if (mo) {
                                                return (
                                                    <div key={mo.mob}>
                                                        <a style={{ color: '#007bff', cursor: 'pointer' }} onClick={() => { redirectLink(mo, index) }}>{mo.mob}</a>
                                                        <a style={{ color: "#25d366", marginLeft: 8, cursor: 'pointer' }} onClick={() => { redirectLink(mo, index) }}>
                                                            <FontAwesomeIcon
                                                                icon={faWhatsapp}
                                                                style={{ color: "#25d366", marginLeft: 8 }}
                                                            />
                                                        </a>
                                                        {mo.isClicked && <FontAwesomeIcon className={''} icon={faCheck} style={{ color: "#00b526", marginLeft: 5 }} />}
                                                    </div>
                                                );
                                            }
                                        })
                                    }
                                </code>
                            </div>
                        </div>}

                    {/* {(extractedNumbers && extractedNumbers.length > 0) &&
                        <div className="form-group">
                            <label
                                htmlFor="txtRegisterMobileNumber"
                                className={"col-form-label"}
                            >
                                List of extracted numbers from image
                  </label>
                            <div className={""}> */}
                    {/* <input
                    type="text"
                    className="form-control"
                    id="txtRegisterMobileNumber"
                    aria-describedby="Enter Mobile Number"
                    placeholder={"Enter Your Mobile"}
                    value={registerMobileNumber}
                    onChange={(e) => setRegisterMobileNUmber(e.target.value)}
                  /> */}

                    {/* <code>
                                    <textarea ref={ref} rows={8} className="form-control" onClick={(e) => { e.target.focus(); e.target.select() }} style={{ fontSize: 14 }} value={(extractedNumbers) && extractedNumbers}></textarea>
                                </code>
                            </div>
                        </div>
                    } */}

                    {/* {(allGenLink && allGenLink.length > 0) &&
                        <div className={'form-group'}>
                            <small style={{ fontWeight: 500, marginBottom: 5 }}>* SMS - you can send to all in one click. WhatsApp you will have to done one by one (still easier as we have generated the link for you).</small>
                        </div>} */}

                </Modal.Body>
                <Modal.Footer>
                    <CopyToClipboard text={(extractedNumbers && extractedNumbers.length > 0) ? extractedNumbers : false}
                        onCopy={() => { setNumbersCopiedStatus(true); setTimeout(() => { setNumbersCopiedStatus(false); }, 10000) }}>
                        <Button disabled={(extractedNumbers && extractedNumbers.length > 0) ? false : true} variant="primary" className={"sendMessageBtn"}>
                            {(numbersCopiedStatus) ? 'Copied to Clipboard...' : 'Copy Numbers'}
                        </Button>
                    </CopyToClipboard>
                    {/* {(extractedNumbers && extractedNumbers.length > 0) && */}
                    {(allGenLink && allGenLink.length > 0) &&
                        <Button
                            variant="primary"
                            disabled={(extractedNumbers && extractedNumbers.length > 0) ? false : true}
                            onClick={() => { props.setToNumbers(allGenLink);handleFileUploadClose(); }}
                            className={"sendMessageBtn"}
                        >
                            You can also send SMS
                </Button>}
                    {/* } */}
                    {/* <Button
                        variant="primary"
                        disabled={(sendingSMS || (allGenLink && allGenLink.length <= 0)) ? true : false}
                        onClick={handleSendSMS}
                        className={"sendMessageBtn"}
                    >{(sendingSMS) && <FontAwesomeIcon className={'rotate-icon'} icon={faSpinner} style={{ color: "#ffffff" }} />} Send SMS</Button> */}
                    <Button variant="secondary" onClick={handleFileUploadClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}