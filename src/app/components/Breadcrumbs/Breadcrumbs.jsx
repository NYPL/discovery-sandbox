import React from 'react';
import { Link } from 'react-router';

const Breadcrumbs = ({ query, type, title, url }) => {
  let currentPageText = 'Research Catalog';
  let crumbs = (
    <span>
      <Link to="https://nypl.org">Home</Link> &gt;&nbsp;
      <Link to="https://nypl.org/research">Research</Link> &gt;&nbsp;
      <span className="currentPage">{currentPageText}</span>
    </span>
  );

  if (type === 'search') {
    currentPageText = query ? `Search Results for "${query}"` : 'Search Results';
    crumbs = (
      <span>
        <Link to="https://nypl.org">Home</Link> &gt;&nbsp;
        <Link to="https://nypl.org/research">Research</Link> &gt;&nbsp;
        <Link to="/">Research Catalog</Link> &gt;&nbsp;
        <span className="currentPage">{currentPageText}</span>
      </span>
    );
  }

  // Arbitary value for now.
  currentPageText = title.length > 50 ? `${title.substring(0, 50)}...` : title;

  if (type === 'item') {
    crumbs = (
      <span>
        <Link to="https://nypl.org">Home</Link> &gt;&nbsp;
        <Link to="https://nypl.org/research">Research</Link> &gt;&nbsp;
        <Link to="/">Research Catalog</Link> &gt;&nbsp;
        {
          query ?
          (<span><Link title={`${query}`} to={`/search?q=${query}`}>Items</Link> &gt;&nbsp;</span>)
          : null
        }
        <span className="currentPage">{currentPageText}</span>
      </span>
    );
  }

  if (type === 'hold') {
    crumbs = (
      <span>
        <Link to="https://nypl.org">Home</Link> &gt;&nbsp;
        <Link to="https://nypl.org/research">Research</Link> &gt;&nbsp;
        <Link to="/">Research Catalog</Link> &gt;&nbsp;
        {
          query ?
          (<span><Link title={`${query}`} to={`/search?q=${query}`}>Items</Link> &gt;&nbsp;</span>)
          : null
        }
        <Link to={`/item/${url}`}>{currentPageText}</Link> &gt;&nbsp;
        <span className="currentPage">Place a hold</span>
      </span>
    );
  }

  if (type === 'holdConfirmation') {
    crumbs = (
      <span>
        <Link to="https://nypl.org">Home</Link> &gt;&nbsp;
        <Link to="https://nypl.org/research">Research</Link> &gt;&nbsp;
        <Link to="/">Research Catalog</Link> &gt;&nbsp;
        {
          query ?
          (<span><Link title={`${query}`} to={`/search?q=${query}`}>Items</Link> &gt;&nbsp;</span>)
          : null
        }
        <Link to={`/item/${url}`}>{currentPageText}</Link> &gt;&nbsp;
        <span className="currentPage">Hold confirmation</span>
      </span>
    );
  }

  return (
    <ol className="nypl-breadcrumbs">
      {crumbs}
    </ol>
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
