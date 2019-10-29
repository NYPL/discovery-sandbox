import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import LibraryItem from '../../utils/item';
import axios from 'axios';
import appConfig from '../../../../appConfig';

class BibsList extends React.Component {
  constructor() {
    super()
    this.getBibTitle = this.getBibTitle.bind(this)
    this.generateBibLi = this.generateBibLi.bind(this)
    this.fetchBib = this.fetchBib.bind(this)
  }

  componentDidMount() {
    Promise.all(this.props.bibs.map(bib => this.fetchBib(bib)))
    .then(console.log)
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
    const bibTitle = this.getBibTitle(bib);
    const bibId = bib['@id'] ? result['@id'].substring(4) : '';
    const materialType = bib && bib.materialType && bib.materialType[0] ?
      bib.materialType[0].prefLabel : null;
    const yearPublished = this.getYearDisplay(bib);
    const publicationStatement = bib.publicationStatement && bib.publicationStatement.length ?
      bib.publicationStatement[0] : '';
    const items = LibraryItem.getItems(result);
    const totalItems = items.length;
    const hasRequestTable = items.length === 1;

    return (
      <li key={i} className={`nypl-results-item ${hasRequestTable ? 'has-request' : ''}`}>
        <h3>
            {bibTitle}
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
    )
  }


  render() {
    console.log(this.props.bibs);
    return (
      <div className="bibs-list">
        <h4>Titles</h4>
        <ul>
        </ul>
      </div>
    )
  }
}

export default BibsList;
