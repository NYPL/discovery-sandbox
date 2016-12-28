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
      <div className="half">
        <p className="lead">Search the New York Public Library Research Catalog
          for materials available to use in one of four research libraries located
          in New York City.
        </p>
      </div>
      <div className="half">
        <div className="search home">
          <Search sortBy={sortBy} />
          <p><Link to="/advanced">Use advanced search</Link></p>
        </div>
      </div>
    </div>
  </div>
);

Home.propTypes = {
  sortBy: React.PropTypes.string,
};

export default Home;
