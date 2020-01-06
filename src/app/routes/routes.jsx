import React from 'react';

import { IndexRoute, Route, Redirect } from 'react-router';

/*
 * Components
 */
import Application from '../components/Application/Application';
import Home from '../components/Home/Home';
import SearchResultsPage from '../components/SearchResultsPage/SearchResultsPage';
import BibPage from '../components/BibPage/BibPage';
import HoldRequest from '../components/HoldRequest/HoldRequest';
import HoldConfirmation from '../components/HoldConfirmation/HoldConfirmation';
import ElectronicDelivery from '../components/ElectronicDelivery/ElectronicDelivery';
import SubjectHeadingsContainer from '../components/SubjectHeading/SubjectHeadingsContainer';
import SubjectHeadingPageWrapper from '../components/SubjectHeading/SubjectHeadingPageWrapper';
import NotFound404 from '../components/NotFound404/NotFound404';
import appConfig from '../appConfig';

const baseUrl = appConfig.baseUrl;
const routes = history => ({
  // Routes used in the Express server:
  server: (
    <Route path="/" component={Application} history={history}>
      <IndexRoute component={Home} />
      <Route path="/search" component={SearchResultsPage} />
      <Route path="/bib/:bibId" component={BibPage} />
      <Route path="/bib/:bibId/all" component={BibPage} />
      <Route path="/hold/request/:bibId-:itemId" component={HoldRequest} />
      <Route path="/hold/request/:bibId-:itemId/edd" component={ElectronicDelivery} />
      <Route path="/hold/confirmation/:bibId-:itemId" component={HoldConfirmation} />
      <Route path="/subject_headings/:subjectHeadingUuid" component={SubjectHeadingPageWrapper} />
      <Route path="/subject_headings" component={SubjectHeadingPageWrapper} />
      <Route path="/404" component={NotFound404} />
      <Redirect from="*" to="/404" />
    </Route>
  ),
  // Routes used in the client-side React-Router:
  client: (
    <Route path={`${baseUrl}/`} component={Application} history={history}>
      <IndexRoute component={Home} />
      <Route path={`${baseUrl}/search`} component={SearchResultsPage} />
      <Route path={`${baseUrl}/bib/:bibId`} component={BibPage} />
      <Route path={`${baseUrl}/bib/:bibId/all`} component={BibPage} />
      <Route path={`${baseUrl}/hold/request/:bibId-:itemId`} component={HoldRequest} />
      <Route path={`${baseUrl}/hold/request/:bibId-:itemId/edd`} component={ElectronicDelivery} />
      <Route path={`${baseUrl}/hold/confirmation/:bibId-:itemId`} component={HoldConfirmation} />
      <Route path={`${baseUrl}/subject_headings/:subjectHeadingUuid`} component={SubjectHeadingPageWrapper} />
      <Route path={`${baseUrl}/subject_headings`} component={SubjectHeadingPageWrapper} />
      <Route path={`${baseUrl}/404`} component={NotFound404} />
      <Redirect from="*" to={`${baseUrl}/404`} />
    </Route>
  ),
});

export default routes;
