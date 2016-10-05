import React from 'react';
import { Link } from 'react-router';

const Breadcrumbs = ({ query }) => (
  <div className={`breadcrumbs`}>
    <Link to="/">Home</Link> &gt;&gt; Search Results for "{query}"
  </div>
);

Breadcrumbs.propTypes = {
  query: React.PropTypes.string,
};

export default Breadcrumbs;
