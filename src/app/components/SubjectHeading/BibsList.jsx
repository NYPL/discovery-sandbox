import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import LibraryItem from '../../utils/item';
import axios from 'axios';
import appConfig from '../../../../appConfig';
import {
  isEmpty as _isEmpty,
  isArray as _isArray,
} from 'underscore';
import ItemTable from '../Item/ItemTable';

class BibsList extends React.Component {
  constructor() {
    super()
    this.state = {
      bibs: []
    }
    this.fetchBib = this.fetchBib.bind(this)
  }

  componentDidMount() {
    Promise.all(this.props.bibIds.map(bib => this.fetchBib(bib)))
    .then(bibs => this.setState({
      bibs
    }))
    .then(() => {
      console.log(this.state.bibs);
    })
  }

  fetchBib(bibId) {
    console.log("fetching bib");
    return axios({
      method: 'GET',
      url: `${appConfig.baseUrl}/api/bib?bibId=b${bibId}`,
      crossDomain: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
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
    if (!bib.data || _isEmpty(bib.data) || !bib.data.title) return null;

    const result = bib.data;
    console.log(result);
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
            to={`${appConfig.baseUrl}/bib/${bibId}?searchKeywords=${this.props.searchKeywords}`}
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


  render() {
    return (
      <div className="bibs-list">
        <h4>Titles</h4>
        <ul>
        {this.state.bibs.map((bib) => this.generateBibLi(bib))}
        </ul>
      </div>
    )
  }
}

export default BibsList;
