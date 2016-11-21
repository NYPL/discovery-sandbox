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
import HoldConfirmation from '../components/HoldPage/HoldConfirmation.jsx';
import HoldRequest from '../components/HoldRequest/HoldRequest.jsx';
import AdvancedSearch from '../components/AdvancedSearch/AdvancedSearch.jsx';
import Account from '../components/Account/Account.jsx';
import AccountHolds from '../components/Account/AccountHolds.jsx';

const routes = (
  <Route path="/" component={Application}>
    <IndexRoute component={Home} />
    <Route path="/search" component={SearchResultsPage} />
    <Route path="/advanced" component={AdvancedSearch} />
    <Route path="/item/:id" component={ItemPage} />
    <Route path="/hold/request/:id" component={HoldRequest} />
    <Route path="/hold/:id" component={HoldPage} />
    <Route path="/hold/confirmation/:id" component={HoldConfirmation} />
    <Route path="/account" component={Account} />
    <Route path="/account/holds" component={AccountHolds} />
    <Route path="/account/holds/:id" component={AccountHolds} />
  </Route>
);

export default routes;
