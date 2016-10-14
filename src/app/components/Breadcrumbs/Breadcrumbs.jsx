import React from 'react';
import { Link } from 'react-router';

const Breadcrumbs = ({ query, type }) => {
  let str = `Search Results for "${query}"`;
  let crumbs = (<span><Link to="/">Home</Link> &gt;&gt; {str}</span>);

  if (type === 'item') {
    str = `Item page for "${query}"`;
    crumbs = (<span><Link to="/">Home</Link> &gt;&gt;&nbsp;
      <Link to="/item">Item</Link> &gt;&gt; {str}</span>);
  }

  return (
    <div className="breadcrumbs">
      {crumbs}
    </div>
  );
}

Breadcrumbs.propTypes = {
  query: React.PropTypes.string,
  type: React.PropTypes.string,
};

export default Breadcrumbs;
