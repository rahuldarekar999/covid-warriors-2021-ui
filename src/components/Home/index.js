import Banner from './Banner';
import MainView from './MainView';
import React from 'react';
import Tags from './Tags';
import agent from '../../agent';
import { connect } from 'react-redux';
import {
  HOME_PAGE_LOADED,
  HOME_PAGE_UNLOADED,
  APPLY_TAG_FILTER
} from '../../constants/actionTypes';

const Promise = global.Promise;

const mapStateToProps = state => ({
  ...state.home,
  appName: state.common.appName,
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onClickTag: (tag, city, pager, payload) =>
    dispatch({ type: APPLY_TAG_FILTER, tag, city, pager, payload }),
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
  onLoad: (tab, pager, payload) =>
    dispatch({ type: HOME_PAGE_LOADED, tab, pager, payload }),

  // onValidResponse: () => 
  //   dispatch({type:VALID_RESPONSE , payload})
  onUnload: () =>
    dispatch({ type: HOME_PAGE_UNLOADED })
});

class Home extends React.Component {


  componentWillMount() {
    var array = new Array();
    const tab = array;//this.props.token ? 'feed' : 'all';
    const articlesPromise = this.props.token ?
      agent.Articles.feed :
      agent.Articles.all;
    // console.log("I am the response to be made so the code is ghere :L:::");
    this.props.onLoad(tab, articlesPromise, Promise.all([agent.Tags.getAll(), agent.Tags.getCities(), agent.Tags.getRefreshTime()]));
    // agent.Articles.byTag('BED', 'HYDERABAD')


    // Promise.resolve(agent.Articles.byTag('BED', 'HYDERABAD')).then(function(value){
    //   console.log("I am the success in the form of some result???????????????????????????", value)
    //   // if(value===null){
    //   //   alert("Successfully sent SMS");
    //   // }
    // })



    this.props.onClickTag('BED', {value: "HYDERABAD", label: "HYDERABAD"}, page => agent.Articles.byTag('BED', 'HYDERABAD', page), agent.Articles.byTag('BED', 'HYDERABAD'));
    // this.props.onLoad(tab, articlesPromise, Promise.all([agent.Tags.getAllBeds()]))

  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    return (
      <div className="home-page">

        {/* <Banner token={this.props.token} appName={this.props.appName} /> */}

        <div className="container page mt-2">
          <div className="row">
            <MainView 

            tags={this.props.tags}
              onClickTag={this.props.onClickTag} 
              changeCity={this.props.changeCity} 

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
