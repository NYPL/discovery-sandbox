import { Text, Card, CardHeading, CardActions, CardContent, Link as DSLink } from '@nypl/design-system-react-components';
import React from 'react';
import PropTypes from 'prop-types';
import {
  isEmpty as _isEmpty,
  isArray as _isArray,
} from 'underscore';
import { useSelector, useDispatch } from 'react-redux';

import LibraryItem from '../../utils/item';
import SearchResultsItems from '../Item/SearchResultsItems';
import appConfig from '../../data/appConfig';
import { searchResultItemsListLimit as itemTableLimit } from '../../data/constants';
import ItemSorter from '../../utils/itemSorter';
import ElectronicResourcesResultsItem from '../ElectronicResourcesResultsItem/ElectronicResourcesResultsItem';
import {
  RightWedgeIcon,
} from '@nypl/dgx-svg-icons';


export const getBibTitle = (bib) => {
  if (!bib.titleDisplay || !bib.titleDisplay.length) {
    const author = bib.creatorLiteral && bib.creatorLiteral.length ?
      ` / ${bib.creatorLiteral[0]}` : '';
    return bib.title && bib.title.length ? `${bib.title[0]}${author}` : '';
  }
  return bib.titleDisplay[0];
};

export const getYearDisplay = (bib) => {
  if (_isEmpty(bib)) return null;

  let dateStartYear = bib.dateStartYear;
  let dateEndYear = bib.dateEndYear;

  dateStartYear = dateStartYear === 999 ? 'unknown' : dateStartYear;
  dateEndYear = dateEndYear === 9999 ? 'present' : dateEndYear;

  if (dateStartYear && dateEndYear) {
    return (<li className="nypl-results-date">{dateStartYear}-{dateEndYear}</li>);
  } else if (dateStartYear) {
    return (<li className="nypl-results-date">{dateStartYear}</li>);
  }
  return null;
};

const ResultsList = ({
  results,
  subjectHeadingShow,
  searchKeywords,
}, { router }) => {

  const { features, loading } = useSelector(state => ({
    features: state.features,
    loading: state.loading,
  }));

  const dispatch = useDispatch();
  const updateResultSelection = data => dispatch({
    type: 'UPDATE_RESULT_SELECTION',
    payload: data,
  });

  const {
    pathname,
    search,
  } = router.location;

  const includeDrbb = features.includes('drb-integration');

  if (!results || !_isArray(results) || !results.length) {
    return null;
  }

  const generateBibLi = (bib, i) => {
    // eslint-disable-next-line no-mixed-operators
    if (_isEmpty(bib) || bib.result && (_isEmpty(bib.result) || !bib.result.title)) {
      return null;
    }

    const result = bib.result || bib;
    const bibTitle = getBibTitle(result);
    const bibId = result && result['@id'] ? result['@id'].substring(4) : '';
    const materialType = result && result.materialType && result.materialType[0] ?
      result.materialType[0].prefLabel : null;
    const yearPublished = getYearDisplay(result);
    const publicationStatement = result.publicationStatement && result.publicationStatement.length ?
      result.publicationStatement[0] : '';
    const items = ItemSorter.sortItems(LibraryItem.getItems(result));
    const hasRequestTable = items.length > 0;
    const { baseUrl } = appConfig;
    const bibUrl = `${baseUrl}/bib/${bibId}`;
    const resourcesOnClick = () => {
      updateResultSelection({
        fromUrl: `${pathname}${search}`,
        bibId,
      })
    }

    const eResources = result.electronicResources
    const totalPhysicalItems = result.numItemsTotal
    const hasPhysicalItems = totalPhysicalItems > 0;
    const numElectronicResources = eResources?.length || 0;
    const itemCount = hasPhysicalItems ? totalPhysicalItems : numElectronicResources;
    const resourceType = hasPhysicalItems ? 'Item' : 'Resource';
    const itemMessage = `${itemCount} ${resourceType}${itemCount !== 1 ? 's' : ''}`;
    return (
      <li key={i} className={`nypl-results-item ${hasRequestTable ? 'has-request' : ''}`}>
        <Card className="search-results-bib-card">
          <CardHeading level="three">
            <DSLink onClick={
              () => {
                updateResultSelection({
                  fromUrl: `${pathname}${search}`,
                  bibId,
                });
              }
            }
              href={bibUrl}
              className="title">
              {bibTitle}
            </DSLink>
          </CardHeading>
          <CardContent className="nypl-results-item-description">
            <ul>
              <li className="nypl-results-media">{materialType}</li>
              <li className="nypl-results-publication">{publicationStatement}</li>
              {yearPublished}
              {
                totalPhysicalItems > 0 || numElectronicResources > 0 ?
                  <li className="nypl-results-info">
                    {itemMessage}
                  </li>
                  : ''
              }
            </ul>
            {eResources && (
              <ElectronicResourcesResultsItem
                resources={eResources}
                onClick={resourcesOnClick}
                bibUrl={bibUrl}
              />
            )}
            {
              hasRequestTable &&
              <>
                <SearchResultsItems
                  items={items.slice(0, itemTableLimit)}
                  bibId={bibId}
                  id={null}
                  searchKeywords={searchKeywords}
                  page="SearchResults"
                />
                {
                  totalPhysicalItems > 3 ?
                    (<CardActions className="results-items-element">
                      <DSLink
                        onClick={resourcesOnClick}
                        href={`${bibUrl}#items-table`}
                        className="search-results-list-link"
                        id="physical-items-link"
                      >
                        <Text isBold size="caption">
                          {`View All ${itemMessage}`} <RightWedgeIcon />
                        </Text>
                      </DSLink>
                    </CardActions>
                    ) :
                    null
                }
              </>
            }
          </CardContent>
        </Card>
      </li>
    );
  };

  const resultsElm = results.map((bib, i) => generateBibLi(bib, i));
  return (
    <ul
      id="nypl-results-list"
      className={
        `nypl-results-list${loading ? ' hide-results-list' : ''}${includeDrbb && !subjectHeadingShow ? ' drbb-integration' : ''}`
      }
    >
      {resultsElm}
    </ul>
  );
};

ResultsList.propTypes = {
  results: PropTypes.array,
  searchKeywords: PropTypes.string,
  subjectHeadingShow: PropTypes.bool,
};

ResultsList.contextTypes = {
  router: PropTypes.object,
};

export default ResultsList;
