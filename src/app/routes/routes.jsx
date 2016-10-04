import React from 'react';

import { IndexRoute, Route } from 'react-router';

/*
 * Components
 */
import Application from '../components/Application/Application';
import SearchResultsPage from '../components/SearchResultsPage/SearchResultsPage';
import ItemPage from '../components/ItemPage/ItemPage.jsx';

const routes = (
  <Route path="/" component={Application}>
    <Route path="/search/:query" component={SearchResultsPage} />
    <Route path="/item" component={ItemPage} />
  </Route>
);

export default routes;
