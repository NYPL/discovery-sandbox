import React from 'react';
import { Link } from 'react-router';

const Breadcrumbs = ({ query, type, title, url }) => {
  let currentPageText = 'Research Catalog';
  let crumbs = (
    <span>
      <Link to="https://nypl.org">Home</Link> &gt;
      <Link to="https://nypl.org/research">Research</Link> &gt;
      <span className="currentPage">{currentPageText}</span>
    </span>
  );

  if (type === 'search') {
    currentPageText = query ? `Search Results for "${query}"` : 'Search Results';
    crumbs = (
      <span>
        <Link to="https://nypl.org">Home</Link> &gt;
        <Link to="https://nypl.org/research">Research</Link> &gt;
        <Link to="/">Research Catalog</Link> &gt;
        <span className="currentPage">{currentPageText}</span>
      </span>
    );
  }

  // Arbitary value for now.
  currentPageText = title.length > 50 ? `${title.substring(0, 50)}...` : title;

  if (type === 'item') {
    crumbs = (
      <span>
        <Link to="https://nypl.org">Home</Link> &gt;
        <Link to="https://nypl.org/research">Research</Link> &gt;
        <Link to="/">Research Catalog</Link> &gt;
        {
          query ?
          (<span><Link to={`/search?q=${query}`}>Items</Link> &gt;</span>)
          : null
        }
        <span className="currentPage">{currentPageText}</span>
      </span>
    );
  }

  if (type === 'hold') {
    crumbs = (
      <span>
        <Link to="https://nypl.org">Home</Link> &gt;
        <Link to="https://nypl.org/research">Research</Link> &gt;
        <Link to="/">Research Catalog</Link> &gt;
        {
          query ?
          (<span><Link to={`/search?q=${query}`}>Items</Link> &gt;</span>)
          : null
        }
        <Link to={`/item/${url}`}>{currentPageText}</Link> &gt;
        <span className="currentPage">Place a hold</span>
      </span>
    );
  }

  if (type === 'holdConfirmation') {
    crumbs = (
      <span>
        <Link to="https://nypl.org">Home</Link> &gt;
        <Link to="https://nypl.org/research">Research</Link> &gt;
        <Link to="/">Research Catalog</Link> &gt;
        {
          query ?
          (<span><Link to={`/search?q=${query}`}>Items</Link> &gt;</span>)
          : null
        }
        <Link to={`/item/${url}`}>{currentPageText}</Link> &gt;
        <span className="currentPage">Hold confirmation</span>
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

Breadcrumbs.defaultProps = {
  query: '',
  type: '',
  title: '',
  url: '',
};

export default Breadcrumbs;
