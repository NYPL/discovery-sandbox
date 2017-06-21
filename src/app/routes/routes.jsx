import React from 'react';

import { IndexRoute, Route } from 'react-router';

/*
 * Components
 */
import Application from '../components/Application/Application.jsx';
import Home from '../components/Home/Home.jsx';
import SearchResultsPage from '../components/SearchResultsPage/SearchResultsPage.jsx';
import BibPage from '../components/BibPage/BibPage.jsx';
import HoldRequest from '../components/HoldRequest/HoldRequest.jsx';
import HoldConfirmation from '../components/HoldPage/HoldConfirmation.jsx';

const routes = (
  <Route path="/" component={Application}>
    <IndexRoute component={Home} />
    <Route path="/search" component={SearchResultsPage} />
    <Route path="/bib/:bibId" component={BibPage} />
    <Route path="/bib/:bibId/all" component={BibPage} />
    <Route path="/hold/request/:bibId-:itemId" component={HoldRequest} />
    <Route path="/hold/confirmation/:bibId-:itemId" component={HoldConfirmation} />
  </Route>
);

export default routes;
