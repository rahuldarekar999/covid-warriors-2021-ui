import React from "react";
import agent from "../../agent";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
// import { faRefresh } from '@fortawesome/fontawesome-svg-core';

const Tags = (props) => {
  const tags = props.tags;
  // console.log("I am the props:::in the tags here _______________________________", props);
  if (tags) {
    return (
      <div className="tag-list">
        {tags.map((tag) => {
          const handleClick = (ev) => {
            ev.preventDefault();
            props.showLoading();
            // console.log("I have fired api call here++++++++++++++++++++++++++++++++++++")
            props.onClickTag(
              tag,
              props.city,
              (page) => agent.Articles.byTag(tag, props.city.value, page),
              agent.Articles.byTag(tag, props.city.value)
            );
          };

          if (tag !== "CUSTOM") {
            return (
              <a
                href=""
                className={`tag-default tag-pill ${
                  tag === props.tag ? "active" : null
                }`}
                key={tag}
                onClick={handleClick}
              >
                {tag}
              </a>
            );
          }
        })}
        <a
          href=""
          className={`tag-default tag-pill ml-4 sendMessageBtn`}
          key={"refresh"}
          onClick={(ev) => {
            ev.preventDefault();
            props.showLoading();
            props.onClickTag(
              props.tag,
              props.city,
              (page) => agent.Articles.byTag(props.tag, props.city.value, page),
              agent.Articles.byTag(props.tag, props.city.value)
            );
          }}
        >
          <FontAwesomeIcon icon={faSyncAlt} style={{ color: "#ffffff" }} /> Reload
        </a>

        {/* <a className={'btn btn-warning btn-coming-soon'} style={{fontSize: 12}}>Extract phone nos from images (coming soon)</a> */}
      </div>
    );
  } else {
    return <div>Loading Categories...</div>;
  }
};

export default Tags;
