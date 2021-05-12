import React from 'react';


export default function ExtractNumbers(props) {
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