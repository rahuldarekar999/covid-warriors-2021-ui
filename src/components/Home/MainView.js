import ArticleList from '../ArticleList';
import React, { useState } from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { CHANGE_TAB } from '../../constants/actionTypes';
import Tags from './Tags';
import Select from 'react-select';
import { Button, Modal } from 'react-bootstrap';
import moment from 'moment';
// import { Switch } from 'react-router';
// import { WithContext as ReactTags } from 'react-tag-input';
// import agent from '../../agent';

// const YourFeedTab = props => {
//   if (props.token) {
//     const clickHandler = ev => {
//       ev.preventDefault();
//       props.onTabClick('feed', agent.Articles.feed, agent.Articles.feed());
//     }

//     return (
//       <li className="nav-item">
//         <a href=""
//           className={props.tab === 'feed' ? 'nav-link active' : 'nav-link'}
//           onClick={clickHandler}>
//           Your Feed
//         </a>
//       </li>
//     );
//   }
//   return null;
// };

const GlobalFeedTab = props => {
  // const clickHandler = ev => {
  //   ev.preventDefault();
  //   props.onTabClick('all', agent.Articles.all, agent.Articles.all());
  // };

  let refreshDate = '';
  if (props.refreshDate) {
    // console.log("I am the refresh data: ", props.refreshDate)
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(props.refreshDate);
    // console.log("I am the time : ", d)
    // d = moment(d).format("DD/MM/YYYY")
    // return d;
    // console.log("I am the date %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%", d)


    var a = moment(d);
    var b = moment();
    // console.log("hello from te hererfjefwefnerjfnernfverjnverjnjerngjkrtngjkrngjkrt", b.diff(a, 'days') )
    refreshDate = b.diff(a, 'days');
  }

  // console.log("I am the feedback here::::", moment(props.refreshDate).format());

  return (
    <li className="nav-item">
      <a

        className={props.tab === 'all' ? 'nav-link pt-0 active' : 'nav-link pt-0'}
      // onClick={clickHandler}
      >
        <span style={{fontSize: 25, fontWeight: 400, color: '#000'}}>Latest responses for you</span> (showing results for '{(props.city) && props.tag}' in '{(props.city) && props.city.value}')
        {/* <small className={'ml-5'}>(Getting last {refreshDate} days messages)</small> */}
      </a>

    </li>
  );
};

const TagFilterTab = props => {
  if (!props.tag) {
    return null;
  }

  return (
    <li className="nav-item">
      <a href="" className="nav-link active">
        <i className="ion-pound"></i> {props.tag}
      </a>
    </li>
  );
};

const mapStateToProps = state => ({
  ...state.articleList,
  tags: state.home.tags,
  token: state.common.token,
  // city: state.home.city
});

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) => dispatch({ type: CHANGE_TAB, tab, pager, payload }),
});


const MainView = props => {

  // console.log("Props in the main view :::", props)
  const [show, setShow] = useState(false);


  const [city, setCity] = useState('');
  const [selTag, setSelTag] = useState('OXYGEN');
  const [message, setMessage] = useState('');
  const [fromMobile, setFromMobile] = useState('');
  const [toMobile, setToMobile] = useState('');
  const [validResponse, setValidResponse] = useState(false);
  const [isSending, setIsSending] = useState(false);


  const [bedOption, setBedOption] = useState('plainBed');
  const [bloodGroup, setBloodGroup] = useState('O-');
  const [otherMedicine, setOtherMedicine] = useState('');
  const [medicineName, setMedicineName] = useState('Remdesivir');
  const [fromOption, setFromOption] = useState('one');

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setIsSending(false);
    Promise.resolve(agent.Tags.getMessages(selTag)).then(function (value) {
      // console.log("I am the message >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", value)
      setMessage(value.data);
    })
  }


  const [tg, setTg] = [{ id: 'Thailand', text: 'Thailand' }, { id: 'India', text: 'India' }];
  // suggestions: suggestions,

  const handleSubmit = () => {
    // console.log("I am the message ", city, selTag, message, fromMobile, toMobile);

    if (!city) {
      alert("Please enter city")
      return;
    }
    if (!message) {
      alert("Please enter Message")
      return;
    }
    if (!fromMobile && fromOption==='two') {
      alert("Please enter from mobile number")
      return;
    }
    if (!toMobile) {
      alert("Please enter to mobile number")
      return;
    }
    // if (toMobile) {
    //   alert("Maximum 10 mobile numbers are allowed")
    //   return;
    // }

    var toMob = [];
    var mob = '';
    // if(toMobile.split(',').length>0){
    //   toMob = toMobile.split(',')
    // }


    mob = toMobile.replace(/,/g, '\n');

if(mob.split('\n').length>0){
  toMob = mob.split('\n')
}







toMob = toMob.filter(function (el) {
  return el != "";
});

    // console.log("I am the mobile", toMob);


// return;


    //     var myArray = toMobile.split(',');
    // var unique = myArray.filter((v, i, a) => a.indexOf(v) === i);
    // console.log("i AM UNIQUER" , unique)
    // return ;
    var response = {
      city: city.toUpperCase(),
      category: selTag,
      mobileList: toMob,
      message: message,
      from: fromMobile
    }




    // console.log("I am the response here : ", response)


    setIsSending(true);
    Promise.resolve(agent.Tags.sendSMS(response)).then(function (value) {
      // console.log("I am the success >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", value)
      if (value === null) {

        setCity('');
        setSelTag('OXYGEN');
        setMessage('');
        setFromMobile('');
        setToMobile('');
        setShow(false)

        setIsSending(false);


        alert("Messages Sent");





      }
    })


    // var isValid = agent.Tags.sendSMS(response);
    // if (isValid) {
    //   alert("Successfully sent SMS");
    // }

  }


  const handleDelete = (i) => {
    // const { tags } = this.state;

    setTg(tg.filter((tag, index) => index !== i))
    // this.setState({
    //   tags: tg.filter((tag, index) => index !== i),
    // });
  }

  const handleAddition = (tag) => {
    //  this.setState(state => ({ tags: [...state.tags, tag] }));
    setTg([...tg, tg])
  }

  const handleDrag = (tag, currPos, newPos) => {
    const taggs = [tg];
    const newTaggs = taggs.slice();

    newTaggs.splice(currPos, 1);
    newTaggs.splice(newPos, 0, tag);

    // re-render
    // this.setState({ tags: newTags });
    setTg(newTaggs)
  }

  const handleTagClick = (index) => {
    // console.log('The tag at index ' + index + ' was clicked');
  }



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

  // console.log("I AM THE PROPS--------------------------------------->>>>>>>>>>>>>>", props);

  const options = [];
  (props.cityArray && props.cityArray.length > 0) && props.cityArray.map((ct) => { options.push({ value: ct, label: ct }); })

  // const options = [

  //   // { value: 'GOA', label: 'GOA' }
  // ];
  // console.log(options);
  const customStyles = {
    // container: () => ({
    //   width: 200,
    // }),
    option: (provided, state) => ({
      ...provided,
      // borderBottom: '1px dotted pink',
      color: '#000000',
      padding: '10px',
      // background: '#fa9234'
    }),
    // control: () => ({
    //   // none of react-select's styles are passed to <Control />
    //   width: 200,
    // }),
    // singleValue: (provided, state) => {
    //   const opacity = state.isDisabled ? 0.5 : 1;
    //   const transition = 'opacity 300ms';

    //   return { ...provided, opacity, transition };
    // }

  }
  const handleChange = ev => {
    // ev.preventDefault();
    // console.log("I am the chan", ev);
    props.onClickTag(props.tag, ev, page => agent.Articles.byTag(props.tag, ev.value, page), agent.Articles.byTag(props.tag, ev.value));
  };
  return (
    <div className="col-md-12">


<div className={'d-flex align-items-start justify-content-end flex-column mb-2'}>
  
<div className={'mb-2'}>
              Got <span style={{fontSize: 22, color: '#000', fontWeight: 500}}>~100</span> numbers to contact!<br/>
              Reach them using single click</div>

            <Button variant="primary" onClick={handleShow} className={'sendMessageBtn'}>Single Click WhatsApp Sending</Button>


            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Single Click WhatsApp Sending</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {/* Enter Below details to send message... */}

                <div className="form-group row">
                  <label htmlFor="txtCity" className={'col-sm-2 col-form-label'}>City</label>
                  <div className={'col-sm-5'}>
                    <input type="text" className="form-control" id="txtCity" aria-describedby="Enter City" placeholder={'Enter City'} value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>

                </div>
                <div className="form-group row">
                  <label htmlFor="selTag" className={'col-sm-2 col-form-label'}>Category</label>
                  <div className={'col-sm-5'}>
                    {/* <input type="text" className="form-control" id="txtCity" aria-describedby="Enter City" placeholder={'Enter City'} /> */}
                    <select onChange={(e) => {


                      let targetValue = e.target.value;
                      setSelTag(targetValue);
                      Promise.resolve(agent.Tags.getMessages(targetValue)).then(function (value) {
                        // console.log("I am the message >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", value)
                        setMessage(value.data);
                        if (targetValue === 'BED') {
                          setMessage('Need plain bed. Request your help urgently🙏🙏🙏');
                        }
                        if (targetValue === 'PLASMA') {
                          setMessage('Do you have PLASMA for O- bloodgroup available? Need Urgent help Please 🙏🙏🙏')
                        }
                        if (targetValue === 'MEDICINE') {
                          setMessage('Do you have Remdesivir medicine available? Need urgent help please 🙏🙏🙏')
                        }
                      })



                    }} value={selTag} className="form-control" name={'selTag'} id={'selTag'}>
                      {(props.tags && props.tags.length > 0) && props.tags.map((tg) => {
                        if (tg !== 'CUSTOM') { return (<option key={tg} value={tg}>{tg}</option>); }
                      })}
                    </select>
                  </div>
                </div>

                {(selTag === 'BED') &&
                  <div className="form-group row">
                    <div className={'col-sm-2'}></div>
                    <div className={'col-sm-10'}>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="bedOptions" id="plainBed" value="plainBed" checked={bedOption === 'plainBed'}
                          onChange={() => {
                            setBedOption('plainBed');
                            setMessage('Need plain bed. Request your help urgently🙏🙏🙏');
                          }} />
                        <label className="form-check-label" htmlFor="plainBed">Plain</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="bedOptions" id="o2Bed" value="o2Bed" checked={bedOption === 'o2Bed'}
                          onChange={() => {
                            setBedOption('o2Bed');
                            setMessage('Need O2 bed urgently. Request your help urgently🙏🙏🙏');
                          }} />
                        <label className="form-check-label" htmlFor="o2Bed">O2</label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input className="form-check-input" type="radio" name="bedOptions" id="ventilatorBed" value="ventilatorBed" checked={bedOption === 'ventilatorBed'}
                          onChange={() => {
                            setBedOption('ventilatorBed');
                            setMessage('Need ventilator bed very urgently. Request your help urgently🙏🙏🙏');
                          }} />
                        <label className="form-check-label" htmlFor="ventilatorBed">Ventilator</label>
                      </div>
                    </div>
                  </div>
                }



                {(selTag === 'PLASMA') &&
                  <div className="form-group row">
                    <label htmlFor="selBloodGroup" style={{ lineHeight: 1.2 }} className={'col-sm-2 mb-0'}>Blood Group</label>
                    <div className={'col-sm-5'}>
                      {/* <input type="text" className="form-control" id="txtCity" aria-describedby="Enter City" placeholder={'Enter City'} /> */}
                      <select onChange={(e) => {
                        let targetValue = e.target.value;
                        setBloodGroup(targetValue);
                        switch (targetValue) {
                          case 'O-':
                            setMessage('Do you have PLASMA for O- bloodgroup available? Need Urgent help Please 🙏🙏🙏')
                            break;
                          case 'O+':
                            setMessage('Do you have PLASMA for O+ bloodgroup available? Need Urgent help Please 🙏🙏🙏')
                            break;
                          case 'A-':
                            setMessage('Do you have PLASMA for A- bloodgroup available? Need Urgent help Please 🙏🙏🙏')
                            break;
                          case 'A+':
                            setMessage('Do you have PLASMA for A+ bloodgroup available? Need Urgent help Please 🙏🙏🙏')
                            break;
                          case 'B-':
                            setMessage('Do you have PLASMA for B- bloodgroup available? Need Urgent help Please 🙏🙏🙏')
                            break;
                          case 'B+':
                            setMessage('Do you have PLASMA for B+ bloodgroup available? Need Urgent help Please 🙏🙏🙏')
                            break;
                          case 'AB-':
                            setMessage('Do you have PLASMA for AB- bloodgroup available? Need Urgent help Please 🙏🙏🙏')
                            break;
                          case 'AB+':
                            setMessage('Do you have PLASMA for AB+ bloodgroup available? Need Urgent help Please 🙏🙏🙏')
                            break;
                          default:
                            setMessage('Do you have PLASMA for O- bloodgroup available? Need Urgent help Please 🙏🙏🙏')
                        }
                      }} value={bloodGroup} className="form-control" name={'selBloodGroup'} id={'selBloodGroup'}>
                        <option key={'O-'} value={'O-'}>{'O-'}</option>
                        <option key={'O+'} value={'O+'}>{'O+'}</option>
                        <option key={'A-'} value={'A-'}>{'A-'}</option>
                        <option key={'A+'} value={'A+'}>{'A+'}</option>
                        <option key={'B-'} value={'B-'}>{'B-'}</option>
                        <option key={'B+'} value={'B+'}>{'B+'}</option>
                        <option key={'AB-'} value={'AB-'}>{'AB-'}</option>
                        <option key={'AB+'} value={'AB+'}>{'AB+'}</option>

                      </select>
                    </div>
                  </div>
                }


                {(selTag === 'MEDICINE') &&
                  <React.Fragment>
                    <div className="form-group row">



                      {/* <div className="form-group row"> */}
                      <div className={'col-sm-2'}></div>
                      <div className={'col-sm-10'}>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="medicineName" id="Remdesivir" value="Remdesivir" checked={medicineName === 'Remdesivir'}
                            onChange={() => {
                              setMedicineName('Remdesivir');

                              setMessage('Do you have Remdesivir medicine available? Need urgent help please 🙏🙏🙏')
                            }} />
                          <label className="form-check-label" htmlFor="Remdesivir">Remdesivir</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="medicineName" id="Tocilizumab" value="Tocilizumab" checked={medicineName === 'Tocilizumab'}
                            onChange={() => {
                              setMedicineName('Tocilizumab');
                              setMessage('Do you have Tocilizumab medicine available? Need urgent help please 🙏🙏🙏')
                            }} />
                          <label className="form-check-label" htmlFor="Tocilizumab">Tocilizumab</label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input className="form-check-input" type="radio" name="medicineName" id="Other" value="Other" checked={medicineName === 'Other'}
                            onChange={() => {
                              setMedicineName('Other');
                              setOtherMedicine('');
                              setMessage('Do you have ____ medicine available? Need urgent help please 🙏🙏🙏')
                            }} />
                          <label className="form-check-label" htmlFor="Other">Other</label>
                        </div>
                      </div>
                      {/* </div> */}



                    </div>

                    {(medicineName === 'Other') &&
                      <div className="form-group row">
                        {/* <div className="col-sm-2"></div> */}
                        {/* <div className="col-sm-10"> */}
                        <label htmlFor="txtOtherMedicine" style={{ lineHeight: 1.2 }} className={'col-sm-2 mb-0'}>Other Medicine</label>
                        <div className={'col-sm-6'}>
                          <input maxLength="50" value={otherMedicine} onChange={(e) => {
                            setOtherMedicine(e.target.value);
                            if (e.target.value === '') {
                              setMessage(`Do you have ____ medicine available? Need urgent help please 🙏🙏🙏`)
                            }
                            else {
                              setMessage(`Do you have ${e.target.value} medicine available? Need urgent help please 🙏🙏🙏`)
                            }
                          }
                          } type="text"
                            className="form-control" id="txtOtherMedicine" aria-describedby="Enter Medicine Name" placeholder={'Enter Medicine Name'} />
                        </div>
                        {/* </div> */}
                      </div>}

                  </React.Fragment>
                }



                <div className="form-group">
                  <label htmlFor="txtmessage">Message <small>(messages cannot be edited because of security reasons)</small></label>
                  <textarea readonly="true" rows={3} minlength="1" value={message} onChange={(e) => setMessage(e.target.value)} className="form-control"
                    placeholder={''} id={'txtmessage'}></textarea>
                  {/* <small id="emailHelp" class="form-text text-muted">Maximum 200 characters allowed</small> */}
                </div>


                <div className="form-group">
                  <label htmlFor="txtToMobile">To </label>
                  {/* (Maximum 20 Mobile Numbers Allowed) */}
                  {/* <ReactTags
                    tags={tg}
                    // suggestions={suggestions}
                    // delimiters={delimiters}
                    handleDelete={handleDelete}
                    handleAddition={handleAddition}
                    handleDrag={handleDrag}
                    handleTagClick={handleTagClick}
                  /> */}



                  <textarea style={{ fontSize: 14 }} value={toMobile} rows={4} onChange={(e) => setToMobile(e.target.value)} type="text" className="form-control" id="txtToMobile" aria-describedby="Enter Mobile Number"
                    placeholder={'List of mobile numbers separated by comma(,) (eg. 987654321, 978654321)'} ></textarea>
                  {/* <small id="emailHelp" class="form-text text-muted"></small> */}
                </div>





                <div className="form-group">
                  <div className={`form-check ${(fromOption === 'two') && 'd-flex align-items-start'}`}>
                    <input className="form-check-input" checked={fromOption === 'one' ? true : false} type="checkbox" onChange={() => { setFromOption('one');  }} value="one" id="chkone" />
                    <label className="form-check-label" for="chkone">I will see the results on the screen</label>
                  </div>

                  <div className={`form-check ${(fromOption === 'two') && 'd-flex align-items-center'}`}>
                    <input className="form-check-input" checked={fromOption === 'two' ? true : false} type="checkbox" onChange={() => { setFromOption('two'); setFromMobile('') }} value="two" id="chktwo" />
                    <label className="form-check-label d-flex align-items-center" for="chktwo">Please WhatsApp me the results (coming soon)
                    
                    {/* {(fromOption === 'two') && <input max="12" value={fromMobile} onChange={(e) => setFromMobile(e.target.value)} type="number" className="form-control col-sm-5 ml-2" id="txtFromMobile" aria-describedby="Your Mobile Number" placeholder={'Your Mobile Number'} />} */}
                    </label>
                  </div>
                </div>

                {/* {(fromOption === 'two') && */}
                  {/* <div className="form-group row"> */}
                    {/* <label htmlFor="txtFromMobile" className={'col-sm-2 col-form-label'}></label> */}
                    {/* <div className={'col-sm-7'}> */}
                      
                    {/* </div> */}
                  {/* </div> */}
                {/* } */}






              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="primary" disabled={(isSending) ? true : false} onClick={handleSubmit} className={'sendMessageBtn'}>Send</Button>
              </Modal.Footer>
            </Modal>



</div>



{/* <marquee style={{color: '#d20000'}}>Extract Phone Nos From Images 
(coming soon)</marquee> */}
      <div className={'mb-2'} style={{ background: '#f1f1f1', padding: 15, borderRadius: 5 }}>
        {/* <div className={'col-sm-9'}> */}

        <div className={'row'}>
          <div className={'col-sm-9'}>
            <div className={'row'}>
              <div className={'col-sm-6'}>

              <div className={'d-flex align-items-center justify-content-start w-100 col-sm-9 col-md-7 mb-4 p-0'}>
              <span className={'mr-2'}>City </span>
              <div className={'w-100'}>
                <Select
                  styles={customStyles}
                  name="form-field-name"
                  value={props.city}
                  options={options}
                  onChange={handleChange}
                  theme={theme => ({
                    ...theme,
                    borderRadius: 5,
                    colors: {
                      ...theme.colors,
                      primary25: '#fa9234',
                      primary: '#fa9234',
                    },
                  })}
                />
              </div>
            </div>
              </div>
              <div className={'col-sm-6'}>
{/* <a className={'btn btn-warning'}>Extract Phone Nos From Images(coming soon)</a> */}

              </div>
            
            </div>

            <div className={'mb-1'}>
              <h4 className="help-header">I want help in finding </h4>

              <Tags
                city={props.city}
                tag={props.tag}
                tags={props.tags}
                onClickTag={props.onClickTag} />
            </div>

          </div>
          <div className={'col-sm-3 d-flex align-items-start justify-content-end flex-column pl-0 text-left'}>



          </div>
        </div>


        {/* </div> */}
        {/* <div className={'col-sm-3'}>

        </div> */}
      </div>


      <div className={'row'}>
        <div className={'col-sm-10'}>
          <div className="feed-toggle">
            <ul className="nav nav-pills outline-active">

              {/*  
         <YourFeedTab
            token={props.token}
            tab={props.tab}
            onTabClick={props.onTabClick} />
*/
              }
              <GlobalFeedTab tab={props.tab} onTabClick={props.onTabClick} city={props.city} tag={props.tag} refreshDate={props.refreshDate} />
              {/*
        <TagFilterTab tag={props.tag} />
*/}
            </ul>
          </div>
        </div>
        <div className={'col-sm-2 d-flex align-items-end justify-content-end'}>
          {/* <button on className={'btn btn-dark mb-2'}>Valid Response</button> */}
          {/* <input type="checkbox" class="form-check-input" id="exampleCheck1"/> */}
          <div className="form-group form-check">
            <input type="checkbox" className="form-check-input" id="exampleCheck1" onChange={validResponseState} />
            <label className="form-check-label" htmlFor="exampleCheck1">Valid Response</label>
          </div>
        </div>
      </div>

      <ArticleList
        pager={props.pager}
        articles={props.articles}
        loading={props.loading}
        articlesCount={props.articlesCount}
        validResponse={validResponse}
        currentPage={props.currentPage} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
