import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

const Breadcrumbs = ({ query, type, title, url }) => {
  let currentPageText = 'Research Catalog';
  let crumbs = (
    <ol role="navigation" aria-label="breadcrumbs" className="nypl-breadcrumbs">
      <li><a href="https://nypl.org">Home</a></li>
      <li><a href="https://nypl.org/research">Research</a></li>
      <li>{currentPageText}</li>
    </ol>
  );

  if (type === 'search') {
    currentPageText = query ? `Search Results for "${query}"` : 'Search Results';
    crumbs = (
      <ol role="navigation" aria-label="breadcrumbs" className="nypl-breadcrumbs">
        <li><a href="https://nypl.org">Home</a></li>
        <li><a href="https://nypl.org/research">Research</a></li>
        <li><Link to="/">Research Catalog</Link></li>
        <li>{currentPageText}</li>
      </ol>
    );
  }

  currentPageText = title;

  if (type === 'item') {
    crumbs = (
      <ol role="navigation" aria-label="breadcrumbs" className="nypl-breadcrumbs">
        <li><a href="https://nypl.org">Home</a></li>
        <li><a href="https://nypl.org/research">Research</a></li>
        <li><Link to="/">Research Catalog</Link></li>
        {
          query ?
          (<li>
            <Link
              title={`Make a new search for ${query}`}
              to={`/search?q=${query}`}
            >Items</Link></li>)
          : null
        }
        <li>{currentPageText}</li>
      </ol>
    );
  }

  return (
    <span>
      <span className="nypl-screenreader-only">You are here:</span>
      {crumbs}
    </span>
  );
};

Breadcrumbs.propTypes = {
  query: PropTypes.string,
  type: PropTypes.string,
  title: PropTypes.string,
  url: PropTypes.string,
};

Breadcrumbs.defaultProps = {
  query: '',
  type: '',
  title: '',
  url: '',
};

export default Breadcrumbs;
