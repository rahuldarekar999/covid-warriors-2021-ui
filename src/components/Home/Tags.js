import React from 'react';
import agent from '../../agent';

const Tags = props => {
  const tags = props.tags;
  console.log("I am the props:::", props);
  if (tags) {
    return (
      <div className="tag-list">
        {
          tags.map(tag => {
            const handleClick = ev => {
              ev.preventDefault();
              props.onClickTag(tag, props.city, page => agent.Articles.byTag(tag, props.city.value, page), agent.Articles.byTag(tag, props.city.value));
            };

            return (
              <a
                href=""
                className={`tag-default tag-pill ${tag===props.tag ? 'active' : null}`}
                key={tag}

                onClick={handleClick}>
                {tag}
              </a>
            );
          })
        }
      </div>
    );
  } else {
    return (
      <div>Loading Categories...</div>
    );
  }
};

export default Tags;
