import appConfig from '@appConfig';
import Bib from './Bib';
import Search from './Search';
import Hold from './Hold';

export default {
  bib: Bib.bibSearch,
  search: Search.searchAjax,
  holdRequest: Hold.newHoldRequest,
};
