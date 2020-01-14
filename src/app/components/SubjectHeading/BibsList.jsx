import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  isEmpty as _isEmpty,
  isArray as _isArray,
} from 'underscore';

import Actions from '../../actions/Actions';
import LibraryItem from '../../utils/item';
import {
  ajaxCall,
  trackDiscovery,
} from '../../utils/utils';
import ItemTable from '../Item/ItemTable';
import appConfig from '../../data/appConfig';
import Pagination from '../Pagination/Pagination';

class BibsList extends React.Component {
  constructor(props) {
    super()
    this.state = {
      bibs: props.shepBibs,
      loading: false,
      bibPage: 1,
      lastBib: props.shepBibs.length - 1,
      nextUrl: props.nextUrl,
    }
    this.updateBibPage = this.updateBibPage.bind(this);
    this.getBibRecord = this.getBibRecord.bind(this);
  }

  // from here down until render() is copied and only slightly modifed from '../Results/ResultsList'

  /*
   * getBibRecord(e, bibId)
   * @description Get updated information for a bib and route the patron to the bib page.
   * @param {object} e Event object.
   * @param {string} bibId The bib's id.
   * @param {string} bibTitle The bib's title.
   */
  getBibRecord(e, bibId, bibTitle) {
    e.preventDefault();

    trackDiscovery('Bib', bibTitle);
    ajaxCall(`${appConfig.baseUrl}/api/bib?bibId=${bibId}`,
      (response) => {
        Actions.updateBib(response.data);
        setTimeout(() => {
          this.context.router.push(`${appConfig.baseUrl}/bib/${bibId}`);
        }, 500);
      },
      (error) => {
        console.error(
          'Error attempting to make an ajax request to fetch a bib record from BibsList',
          error,
        );
      },
    );
  }

  getBibTitle(bib) {
    if (!bib.titleDisplay || !bib.titleDisplay.length) {
      const author = bib.creatorLiteral && bib.creatorLiteral.length ?
        ` / ${bib.creatorLiteral[0]}` : '';
      return bib.title && bib.title.length ? `${bib.title[0]}${author}` : '';
    }
    return bib.titleDisplay[0];
  }

  getYearDisplay(bib) {
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
  }

  generateBibLi(bib) {

    // If bib was not successfully converted to a Discovery (json-ld) resource,
    // display minimal properties from SHEP API:
    if (!bib['@id']) {
      return <li className="nypl-results-item not-in-discovery" key={bib.bnumber}>{bib.title} <br/> bib id: {bib.bnumber} <br/> [circ title; for proto only]</li>;
    }

    const result = bib;
    const bibTitle = this.getBibTitle(result);
    const bibId = result && result['@id'] ? result['@id'].substring(4) : '';
    const materialType = result && result.materialType && result.materialType[0] ?
      result.materialType[0].prefLabel : null;
    const yearPublished = this.getYearDisplay(result);
    const publicationStatement = result.publicationStatement && result.publicationStatement.length ?
      result.publicationStatement[0] : '';
    const items = LibraryItem.getItems(result);
    const totalItems = items.length;
    const hasRequestTable = items.length === 1;

    return (
      <li key={bibId} className={`nypl-results-item ${hasRequestTable ? 'has-request' : ''}`}>
        <h3>
          <Link
            onClick={e => this.getBibRecord(e, bibId, bibTitle)}
            to={`${appConfig.baseUrl}/bib/${bibId}`}
            className="title"
          >
            {bibTitle}
          </Link>
        </h3>
        <div className="nypl-results-item-description">
          <ul>
            <li className="nypl-results-media">{materialType}</li>
            <li className="nypl-results-publication">{publicationStatement}</li>
            {yearPublished}
            <li className="nypl-results-info">
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </li>
          </ul>
        </div>
        {
          hasRequestTable &&
            <ItemTable
              items={items}
              bibId={bibId}
              getRecord={this.getItemRecord}
              id={null}
              searchKeywords={this.props.searchKeywords}
            />
        }
      </li>
    );
  }



  updateBibPage(page, type) {
    const {
      bibs,
      lastBib,
      nextUrl,
      bibPage,
    } = this.state;

    if (type === 'Previous') {
      // FIXME: The following sometimes produces a bad `lastBib` value.
      // e.g. If there are a total of 18 bibs, navigating to page "2" will
      // set lastBib to 17. On clicking "Previous", lastBib will be set
      // hereafter to 17-10=7. That will lead to the following call in render:
      //   this.state.bibs.slice(7 - 9, 8)
      // which is not a valid range.
      if (lastBib > 9) this.setState({ lastBib: lastBib - 10, bibPage: bibPage - 1 });
    } else {
      if (lastBib + 10 < bibs.length) {
        this.setState({ lastBib: lastBib + 10, bibPage: bibPage + 1 });
      } else {
        this.setState({ loading: true }, () => {
          axios({
            method: 'GET',
            url: nextUrl,
            crossDomain: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          })
            .then((res) => {
              const newNextUrl = res.data.next_url;
              const newBibs = this.state.bibs.concat(res.data.bibs);
              const newLast = newBibs.length - 1;
              this.setState({
                bibs: newBibs,
                loading: false,
                lastBib: newLast,
                nextUrl: newNextUrl,
                bibPage: this.state.bibPage + 1,
              });
            })
            .catch(
              (err) => {
                console.log('error: ', err);
                this.setState({ loading: false });
              },
            );
        });
      }
    }
  }


  render() {
    const {
      bibPage,
      lastBib,
      loading,
    } = this.state;
    const pagination = (
      <Pagination
        updatePage={this.updateBibPage}
        page={bibPage}
        subjectShowPage
        ariaControls="nypl-results-list"
      />
    );
    return (
      <div
        className="bibs-list"
        tabIndex='0'
        aria-label='Titles related to this Subject Heading'
      >
        <h4>Titles</h4>
        {
          !loading ?
            <ul>
              {
                this.state.bibs.length > 0
                ? this.state.bibs.slice(lastBib - 9, lastBib + 1).map(
                  bib => this.generateBibLi(bib)
                )
                : null
              }
            </ul>
          :
            <div className="subjectHeadingShowLoadingWrapper">
              <div className="loadingLayer-texts subjectHeadingShow">
                <span id="loading-animation" className="loadingLayer-texts-loadingWord subjectHeadingShow">
                  Loading More Titles
                </span>
                <div className="loadingDots">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
        }
        {pagination}
      </div>
    );
  }
}

BibsList.contextTypes = {
  router: PropTypes.object,
};

export default BibsList;
