import React from 'react';
import { Link } from 'react-router';

const Breadcrumbs = ({ query, type, title, url }) => {
  let currentPageText = 'Research Catalog';
  let crumbs = (
    <ol className="nypl-breadcrumbs">
      <li><a href="https://nypl.org">Home</a></li>
      <li><a href="https://nypl.org/research">Research</a></li>
      <li>{currentPageText}</li>
    </ol>
  );

  if (type === 'search') {
    currentPageText = query ? `Search Results for "${query}"` : 'Search Results';
    crumbs = (
      <ol className="nypl-breadcrumbs">
        <li><a href="https://nypl.org">Home</a></li>
        <li><a href="https://nypl.org/research">Research</a></li>
        <li><Link to="/">Research Catalog</Link></li>
        <li>{currentPageText}</li>
      </ol>
    );
  }

  // Arbitary value for now.
  currentPageText = title.length > 50 ? `${title.substring(0, 50)}...` : title;

  if (type === 'item') {
    crumbs = (
      <ol className="nypl-breadcrumbs">
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

  return (crumbs);
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
