import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isEmpty as _isEmpty } from 'underscore';
import { updateBibPage } from '../actions/Actions';
import BibContainer from '../components/BibPage/BibContainer';
import BibNotFound404 from '../components/BibPage/BibNotFound404';
import LoadingLayer from '../components/LoadingLayer/LoadingLayer';
import SccContainer from '../components/SccContainer/SccContainer';
import BibProvider from '../context/Bib.Provider';
import appConfig from '../data/appConfig';
import { itemBatchSize } from '../data/constants';
import { ajaxCall } from '../utils/utils';

const checkForMoreItems = (bib, dispatch) => {
  // No Need to check if Bib Exists sine useEffect does that for us.
  if (!bib.items || !bib.items.length) {
    // nothing to do
  } else if (bib.items.length < itemBatchSize) {
    // done
    // TODO: Do we need a new obj or can we Ref.
    dispatch(updateBibPage({ bib: Object.assign({}, bib, { done: true }) }));
  } else {
    // need to fetch more items
    const baseUrl = appConfig.baseUrl;
    const itemFrom = bib.itemFrom || itemBatchSize;
    const bibApi = `${window.location.pathname.replace(
      baseUrl,
      `${baseUrl}/api`,
    )}?itemFrom=${itemFrom}`;
    ajaxCall(
      bibApi,
      (resp) => {
        // put items in
        const bibResp = resp.data.bib;
        const done =
          !bibResp || !bibResp.items || bibResp.items.length < itemBatchSize;
        dispatch(
          updateBibPage({
            bib: Object.assign({}, bib, {
              items: bib.items.concat((bibResp && bibResp.items) || []),
              done,
              itemFrom: parseInt(itemFrom, 10) + parseInt(itemBatchSize, 10),
            }),
          }),
        );
      },
      (error) => {
        console.error(error);
      },
    );
  }
};

export const BibPage = (
  { bib, location, searchKeywords, dispatch, resultSelection },
  context,
) => {
  useEffect(() => {
    // Server or Client render based on if 'window' is defined.
    if (typeof window !== 'undefined') {
      if (!_isEmpty(bib) && !bib.done) {
        //  After first render on Client check for more items <-- why?
        checkForMoreItems(bib, dispatch);
      }
    }
  }, [bib, dispatch]);

  if (!bib || parseInt(bib.status, 10) === 404) {
    return <BibNotFound404 context={context} />;
  }

  if (_isEmpty(bib)) {
    return <LoadingLayer loading />;
  }

  return (
    <BibProvider bib={bib}>
      <SccContainer
        useLoadingLayer
        className='nypl-item-details'
        pageTitle='Item Details'
      >
        <BibContainer
          location={location}
          searched={resultSelection}
          search={searchKeywords}
        />
      </SccContainer>
    </BibProvider>
  );
};

BibPage.propTypes = {
  searchKeywords: PropTypes.string,
  location: PropTypes.object,
  bib: PropTypes.object,
  dispatch: PropTypes.func,
  resultSelection: PropTypes.object,
};

BibPage.contextTypes = {
  router: PropTypes.object,
};

const mapStateToProps = ({
  bib,
  searchKeywords,
  field,
  selectedFilters,
  page,
  sortBy,
  resultSelection,
}) => ({
  bib,
  searchKeywords,
  field,
  selectedFilters,
  page,
  sortBy,
  resultSelection,
});

export default withRouter(connect(mapStateToProps)(BibPage));
