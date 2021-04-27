import ArticlePreview from './ArticlePreview';
import ListPagination from './ListPagination';
import React from 'react';

const ArticleList = props => {
  console.log("I am the props in the articles: ", props.articles)
  if (!props.articles) {
    return (
      <div className="article-preview">Loading...</div>
    );
  }

  if (!props.articles) {
    return (
      <div className="article-preview">
        No Response for this Category.
      </div>
    );
  }

  return (
    <div>
      {
        Object.keys(props.articles).map(article => {
          console.log("I am the article", article);
          if(article && article.length>0){
            return props.articles[article].map((art)=>{
              console.log("ai am tha art: ", art)
              return (
                  <ArticlePreview article={art} key={art.slug} />
                );
            })


          }
          // return (
          //   <ArticlePreview article={article} key={article.slug} />
          // );
        })
      }

      <ListPagination
        pager={props.pager}
        articlesCount={props.articlesCount}
        currentPage={props.currentPage} />
    </div>
  );
};

export default ArticleList;
