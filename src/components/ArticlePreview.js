import React from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import { ARTICLE_FAVORITED, ARTICLE_UNFAVORITED } from '../constants/actionTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faCoffee, faUser } from '@fortawesome/free-solid-svg-icons';
import { Media } from 'react-bootstrap';
import moment from 'moment';

const FAVORITED_CLASS = 'btn btn-sm btn-primary';
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary';

const mapDispatchToProps = dispatch => ({
  favorite: slug => dispatch({
    type: ARTICLE_FAVORITED,
    payload: agent.Articles.favorite(slug)
  }),
  unfavorite: slug => dispatch({
    type: ARTICLE_UNFAVORITED,
    payload: agent.Articles.unfavorite(slug)
  })
});

const ArticlePreview = props => {
  const article = props.article;
  const favoriteButtonClass = article.favorited ?
    FAVORITED_CLASS :
    NOT_FAVORITED_CLASS;

  const handleClick = ev => {
    ev.preventDefault();
    if (article.favorited) {
      props.unfavorite(article.slug);
    } else {
      props.favorite(article.slug);
    }
  };
  const getDate = (time) => {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(time);
    // console.log("I am the time : ", d)
    d = moment(d).format("DD/MM/YYYY \xa0 hh:mm a")
    return d;
  }
  return (
    <div className="article-preview">
      <div className="article-meta">



        <Media>
          {/* {
            (article.author && article.author.image) ? <img src={article.author.image} className="mr-3" alt={article.author.username} /> : <FontAwesomeIcon className="mr-3 fa-3x" icon={faUser} />
          } */}
          {/* <img
            width={64}
            height={64}
            className="mr-3"
            src="holder.js/64x64"
            alt="Generic placeholder"
          /> */}
          <Media.Body>
            {/* <h5 className={'mb-0'}>{article.chatIdMobileNumber}</h5> */}

            <p className={'mb-0'}>
              <small className="date" style={{display: ' inline-block', minWidth: 135}}>
                {getDate(article.time)}
              </small>
              <FontAwesomeIcon className="mx-3" style={{ color: '#fa9234' }} icon={faChevronRight} />
              {article.body}
            </p>
          </Media.Body>
        </Media>



        {/* <Link to={`#`}> */}


        {/* </Link> */}

        {/* <div className="info"> */}
        {/* <Link className="author" to={article.chatIdMobileNumber}> */}
        {/* {article.chatIdMobileNumber} */}
        {/* </Link> */}

        {/* </div> */}
      </div>

      {/* <Link to={`#`} className="preview-link"> */}
      {/* <h4 style={{ fontWeight: 300 }}>{article.body}</h4> */}
      {/* </Link> */}
    </div>
  );
}

export default connect(() => ({}), mapDispatchToProps)(ArticlePreview);
