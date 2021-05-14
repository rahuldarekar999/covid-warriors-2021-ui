import ArticleList from "../ArticleList";
import React, { useState, useEffect } from "react";
import agent from "../../agent";
import { connect } from "react-redux";
import { CHANGE_TAB } from "../../constants/actionTypes";
import Tags from "./Tags";
import Select from "react-select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

import 'react-bootstrap-typeahead/css/Typeahead.css';
import ExtractNumbers from './ExtractNumbers';
import ReachTwitter from './ReachTwitter';
import OnClickWhatsApp from './OnClickWhatsApp';
import GetHelp from './GetHelp';



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

  const [validResponse, setValidResponse] = useState(false);
  const [options, setOptions] = useState([]);
  const [toNumbers, setToNumbers] = useState(false);
  


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

  return (
    <div className="col-md-12">
      <div className={"row"}>
        <GetHelp {...props} />
        <OnClickWhatsApp {...props} toNumbers={toNumbers} setToNumbers={setToNumbers} />
        <ReachTwitter {...props} />
        <ExtractNumbers setToNumbers={setToNumbers} {...props}/>
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
