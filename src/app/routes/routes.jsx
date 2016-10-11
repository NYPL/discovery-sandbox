import React from 'react';

import { IndexRoute, Route } from 'react-router';

/*
 * Components
 */
import Application from '../components/Application/Application.jsx';
import Home from '../components/Home/Home.jsx';
import SearchResultsPage from '../components/SearchResultsPage/SearchResultsPage.jsx';
import ItemPage from '../components/ItemPage/ItemPage.jsx';
import HoldPage from '../components/HoldPage/HoldPage.jsx';

const routes = (
  <Route path="/" component={Application}>
    <IndexRoute component={Home} />
    <Route path="/search/:query" component={SearchResultsPage} />
    <Route path="/item/:id" component={ItemPage} />
    <Route path="/hold/:id" component={HoldPage} />
  </Route>
);

export default routes;
