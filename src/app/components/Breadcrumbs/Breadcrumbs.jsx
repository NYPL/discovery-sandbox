import React from 'react';

const Breadcrumbs = ({ query }) => (
  <div className={`breadcrumbs`}>
    <a href="/">Home</a> &gt;&gt; Search Results for "{query}"
  </div>
);

Breadcrumbs.propTypes = {
  query: React.PropTypes.string,
};

export default Breadcrumbs;
