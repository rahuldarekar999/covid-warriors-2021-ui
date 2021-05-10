// import Banner from "./Banner";
import MainView from "./MainView";
import React from "react";
// import Tags from "./Tags";
import agent from "../../agent";
import { connect } from "react-redux";
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER,
  LOADING_ARTICLES
} from "../../constants/actionTypes";

const Promise = global.Promise;

const mapStateToProps = (state) => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token,
});

const mapDispatchToProps = (dispatch) => ({
  onClickTag: (tag, city, pager, payload) => {


    if (payload) {
      // console.log("I received some payload here:::", payload)
      Promise.resolve(payload).then((result) => {
        // if(result && Object.keys(result).length>0){
          dispatch({ type: LOADING_ARTICLES, loadingState: false });
        // }
        // console.log("I am the results:::", result);
      }, function (e) {
        dispatch({ type: LOADING_ARTICLES, loadingState: false });
      })
    }
    // dispatch(type:LOADING_ARTICLES,  );
    // console.log("I am here in the on click tag here:::::::::::::::::::::::::::::::")
    dispatch({ type: APPLY_TAG_FILTER, tag, city, pager, payload });
    // dispatch({ type: LOADING_ARTICLES, loadingState: false });
  },
  showLoading: () => {
    // console.log("))))))))))))))))))))))))))))))Showing loader")
    dispatch({ type: LOADING_ARTICLES, loadingState: true });
  },
  // changeCity: (option) => {
  //   console.log("I am the option::", option);
  //   var optionValue = option.value;
  //   // var page = agent.Articles.byTag(tag, page);
  //   // var payload = agent.Articles.byTag(tag);
  //   dispatch({ type: APPLY_CITY_FILTER, optionValue, page, payload })
  // },
  // dispatch({ type: APPLY_TAG_FILTER, tag, pager, payload }),
  // loadCity: () =>
  //   dispatch({ type: CIT, tab, pager, payload }),
  // getCities: () => dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),
  onLoad: (tab, pager, payload) =>
    dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),

  // onValidResponse: () =>
  //   dispatch({type:VALID_RESPONSE , payload})
  onUnload: () => dispatch({ type: HOME_PAGE_UNLOADED }),
});

class Home extends React.Component {
  componentWillMount() {
    var array = new Array();
    const tab = array; //this.props.token ? 'feed' : 'all';
    const articlesPromise = this.props.token
      ? agent.Articles.feed
      : agent.Articles.all;
    // console.log("I am the response to be made so the code is ghere :L:::");
    this.props.onLoad(
      tab,
      articlesPromise,
      Promise.all([
        agent.Tags.getAll(),
        agent.Tags.getCities(),
        agent.Tags.getRefreshTime(),
      ])
    );
    // agent.Articles.byTag('BED', 'PUNE')

    // Promise.resolve(agent.Articles.byTag('BED', 'PUNE')).then(function(value){
    //   console.log("I am the success in the form of some result???????????????????????????", value)
    //   // if(value===null){
    //   //   alert("Successfully sent SMS");
    //   // }
    // })
    // dispatch({ type: LOADING_ARTICLES, loadingState: true });
    this.props.showLoading();
    this.props.onClickTag(
      "BED",
      { value: "PUNE", label: "PUNE" },
      (page) => agent.Articles.byTag("BED", "PUNE", page),
      agent.Articles.byTag("BED", "PUNE")
    );
    // this.props.onLoad(tab, articlesPromise, Promise.all([agent.Tags.getAllBeds()]))
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  // geoFindMe() {

  //   const status = document.querySelector('#status');
  //   const mapLink = document.querySelector('#map-link');

  //   mapLink.href = '';
  //   mapLink.textContent = '';

  //   function success(position) {
  //     const latitude  = position.coords.latitude;
  //     const longitude = position.coords.longitude;

  //     status.textContent = '';
  //     mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
  //     mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
  //   }

  //   function error() {
  //     status.textContent = 'Unable to retrieve your location';
  //   }

  //   if(!navigator.geolocation) {
  //     status.textContent = 'Geolocation is not supported by your browser';
  //   } else {
  //     status.textContent = 'Locating…';
  //     navigator.geolocation.getCurrentPosition(success, error);
  //   }

  // }

  render() {
    return (
      <div className="container">
        {/* <span id={'status'}></span> */}
        {/* <span id={'map-link'}></span> */}
        {/* <button onClick={this.geoFindMe}>Find My Location</button> */}
        {/* <Banner token={this.props.token} appName={this.props.appName} /> */}

        <div className="container page mt-2">
          <div className="row">
            <MainView
              tags={this.props.tags}
              onClickTag={this.props.onClickTag}
              changeCity={this.props.changeCity}
              showLoading={this.props.showLoading}
            />

            {/* <div className="col-md-3">
              <div className="sidebar">

                <p>Help On</p>

                <Tags
                  tags={this.props.tags}
                  onClickTag={this.props.onClickTag} />

              </div>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
