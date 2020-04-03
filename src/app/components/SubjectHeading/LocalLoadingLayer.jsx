import React from 'react';

export default props => (
  <div className="nypl-column-half bibsList subjectHeadingShowLoadingWrapper">
    <span
      id="loading-animation"
      className="loadingLayer-texts-loadingWord"
    >
      { props.message }
    </span>
    <div className="loadingDots">
      <span />
      <span />
      <span />
      <span />
    </div>
  </div>
);
