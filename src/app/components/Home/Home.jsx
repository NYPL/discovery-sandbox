import React from 'react';
import { Link } from 'react-router';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import Search from '../Search/Search.jsx';

const Home = ({ sortBy }) => (
  <div className="home" id="mainContent">
    <div className="page-header">
      <div className="content-wrapper">
        <Breadcrumbs />
        <h2>New York Public Library Research Catalog</h2>
      </div>
    </div>

    <div className="content-wrapper">
      <div className="nypl-column-three-quarters nypl-column-offset-one">
        <p className="lead">Search the New York Public Library Research Catalog
          for materials available to use in one of four research libraries located
          in New York City.
        </p>
        <div className="search home">
          <Search sortBy={sortBy} />
        </div>
      </div>
    </div>
  </div>
);

Home.propTypes = {
  sortBy: React.PropTypes.string,
};

export default Home;
