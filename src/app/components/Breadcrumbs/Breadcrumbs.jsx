import React from 'react';
import { Link } from 'react-router';

const Breadcrumbs = ({ query, type }) => (
  <div className={`breadcrumbs`}>
    { type === 'item' ?
      (<span><Link to="/">Home</Link> &gt;&gt;&nbsp;
        <Link to="/item">Item</Link> &gt;&gt; Item page for "{query}"</span>)
      : (<span><Link to="/">Home</Link> &gt;&gt; Search Results for "{query}"</span>)
    }
  </div>
);

Breadcrumbs.propTypes = {
  query: React.PropTypes.string,
  type: React.PropTypes.string,
};

export default Breadcrumbs;
