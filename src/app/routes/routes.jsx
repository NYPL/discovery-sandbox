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
import HoldConfirmation from '../components/HoldConfirmation/HoldConfirmation.jsx';
import ElectronicDelivery from '../components/ElectronicDelivery/ElectronicDelivery.jsx';
import appConfig from '../../../appConfig.js';

const baseUrl = appConfig.baseUrl;
const routes = {
  client: (
    <Route path={'/'} component={Application}>
      <IndexRoute component={Home} />
      <Route path={'/search'} component={SearchResultsPage} />
      <Route path={'/bib/:bibId'} component={BibPage} />
      <Route path={'/bib/:bibId/all'} component={BibPage} />
      <Route path={'/hold/request/:bibId-:itemId'} component={HoldRequest} />
      <Route path={'/hold/request/:bibId-:itemId/edd'} component={ElectronicDelivery} />
      <Route path={'/hold/confirmation/:bibId-:itemId'} component={HoldConfirmation} />
    </Route>
  ),
  server: (
    <Route path={`${baseUrl}/`} component={Application}>
      <IndexRoute component={Home} />
      <Route path={`${baseUrl}/search`} component={SearchResultsPage} />
      <Route path={`${baseUrl}/bib/:bibId`} component={BibPage} />
      <Route path={`${baseUrl}/bib/:bibId/all`} component={BibPage} />
      <Route path={`${baseUrl}/hold/request/:bibId-:itemId`} component={HoldRequest} />
      <Route path={`${baseUrl}/hold/request/:bibId-:itemId/edd`} component={ElectronicDelivery} />
      <Route path={`${baseUrl}/hold/confirmation/:bibId-:itemId`} component={HoldConfirmation} />
    </Route>
  ),
};

export default routes;
