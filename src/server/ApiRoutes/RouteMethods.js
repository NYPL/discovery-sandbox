import Bib from './Bib';
import Search from './Search';
import Hold from './Hold';
import Account from './Account';

// Configure the functions that get called to generate data for each type of route
// This should really be part of the `routes` object in dataLoaderUtil but can't be
// because of some packages required in these functions that are not available in the browser

export default {
  bib: Bib.bibSearch,
  search: Search.search,
  holdRequest: Hold.newHoldRequest,
  eddRequest: Hold.newHoldRequest,
  account: Account.fetchAccountPage,
};
