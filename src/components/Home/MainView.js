import ArticleList from '../ArticleList';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import { CHANGE_TAB } from '../../constants/actionTypes';
import Tags from './Tags';
import Select from 'react-select';
// import agent from '../../agent';

const YourFeedTab = props => {
  if (props.token) {
    const clickHandler = ev => {
      ev.preventDefault();
      props.onTabClick('feed', agent.Articles.feed, agent.Articles.feed());
    }

    return (
      <li className="nav-item">
        <a href=""
          className={props.tab === 'feed' ? 'nav-link active' : 'nav-link'}
          onClick={clickHandler}>
          Your Feed
        </a>
      </li>
    );
  }
  return null;
};

const GlobalFeedTab = props => {
  const clickHandler = ev => {
    ev.preventDefault();
    props.onTabClick('all', agent.Articles.all, agent.Articles.all());
  };
  return (
    <li className="nav-item">
      <a
        href=""
        className={props.tab === 'all' ? 'nav-link active' : 'nav-link'}
        onClick={clickHandler}>
        Showing results for '{(props.city) && props.tag}' & '{(props.city) && props.city.value}'
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
  token: state.common.token
});

const mapDispatchToProps = dispatch => ({
  onTabClick: (tab, pager, payload) => dispatch({ type: CHANGE_TAB, tab, pager, payload }),
});


const MainView = props => {
  console.log("I AM THE PROPS", props);

  const options = [
    { value: 'PUNE', label: 'PUNE' },
    { value: 'GOA', label: 'GOA' }
  ];
  const customStyles = {
    // container: () => ({
    //   width: 200,
    // }),
    // option: (provided, state) => ({
    //   ...provided,
    //   borderBottom: '1px dotted pink',
    //   color: state.isSelected ? 'red' : 'blue',
    //   padding: 20,
    // }),
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
    console.log("I am the chan", ev);
    props.onClickTag(props.tag, ev, page => agent.Articles.byTag(props.tag, ev.value, page), agent.Articles.byTag(props.tag, ev.value));
  };
  return (
    <div className="col-md-12">


      <div className="row">
        <div className={'col-sm-9'}>
          <div className={'mb-4'}>
            <p>I want help in finding: </p>

            <Tags
              city={props.city}
              tag={props.tag}
              tags={props.tags}
              onClickTag={props.onClickTag} />
          </div>
        </div>
        <div className={'col-sm-3'}>
          <div className={'d-flex align-items-center justify-content-start w-100'}>
            <span className={'mr-2'}>City: </span>
            <div className={'w-100'}>
              <Select
                styles={customStyles}
                name="form-field-name"
                value={props.city}
                options={options}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>
      </div>

      <div className="feed-toggle">
        <ul className="nav nav-pills outline-active">

          {/*  
         <YourFeedTab
            token={props.token}
            tab={props.tab}
            onTabClick={props.onTabClick} />
*/
          }
          <GlobalFeedTab tab={props.tab} onTabClick={props.onTabClick} city={props.city} tag={props.tag} />
          {/*
        <TagFilterTab tag={props.tag} />
*/}
        </ul>
      </div>

      <ArticleList
        pager={props.pager}
        articles={props.articles}
        loading={props.loading}
        articlesCount={props.articlesCount}
        currentPage={props.currentPage} />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
