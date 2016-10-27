import React from 'react';
import { Link } from 'react-router';

const Breadcrumbs = ({ query, type, title = '', url }) => {
  let str = 'Research Catalog';
  let crumbs = (
    <span>
      <Link to="https://nypl.org">Home</Link> &gt;&gt;
      <Link to="https://nypl.org/research">Research</Link> &gt;&gt;
      {str}
    </span>
  );

  if (type === 'search') {
    str = `Search Results for "${query}"`;
    crumbs = (
      <span>
        <Link to="https://nypl.org">Home</Link> &gt;&gt;
        <Link to="https://nypl.org/research">Research</Link> &gt;&gt;
        <Link to="/">Research catalog</Link> &gt;&gt;
        {str}
      </span>
    );
  }

  str = `${title.substring(0, 50)}...`;

  if (type === 'item') {
    crumbs = (
      <span>
        <Link to="https://nypl.org">Home</Link> &gt;&gt;
        <Link to="https://nypl.org/research">Research</Link> &gt;&gt;
        <Link to="/">Research catalog</Link> &gt;&gt;
        <Link to={`/search/${query}`}>Items</Link> &gt;&gt;
        {str}
      </span>
    );
  }

  if (type === 'hold') {
    crumbs = (
      <span>
        <Link to="https://nypl.org">Home</Link> &gt;&gt;
        <Link to="https://nypl.org/research">Research</Link> &gt;&gt;
        <Link to="/">Research catalog</Link> &gt;&gt;
        <Link to={`/search/${query}`}>Items</Link> &gt;&gt;
        <Link to={`/item${url}`}>{str}</Link> &gt;&gt;
        Place a hold
      </span>
    );
  }

  if (type === 'holdConfirmation') {
    crumbs = (
      <span>
        <Link to="https://nypl.org">Home</Link> &gt;&gt;
        <Link to="https://nypl.org/research">Research</Link> &gt;&gt;
        <Link to="/">Research catalog</Link> &gt;&gt;
        <Link to={`/search/${query}`}>Items</Link> &gt;&gt;
        <Link to={`/item${url}`}>{str}</Link> &gt;&gt;
        Hold confirmation
      </span>
    );
  }

  return (
    <div className="breadcrumbs">
      {crumbs}
    </div>
  );
};

Breadcrumbs.propTypes = {
  query: React.PropTypes.string,
  type: React.PropTypes.string,
  title: React.PropTypes.string,
  url: React.PropTypes.string,
};

export default Breadcrumbs;
