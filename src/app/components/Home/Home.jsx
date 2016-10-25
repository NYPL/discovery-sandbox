import React from 'react';
import { Link } from 'react-router';

import {
  map as _map,
} from 'underscore';

import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx';
import Search from '../Search/Search.jsx';

class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <div className="page-header">
          <div className="container">
            <Breadcrumbs />
            <h2>New York Public Library Research Catalog</h2>
          </div>
        </div>

        <div className="container item-container">

          <div className="row primary">
            <div className="col span-1-2">
              <p className="lead">Search the New York Public Library Research Catalog
                for materials available to use in one of four research libraries located
                in New York City.
              </p>
            </div>
            <div className="col span-1-2">
              <div className="search home">
                <Search />
                <p><Link to="/advanced">Use advanced search</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
