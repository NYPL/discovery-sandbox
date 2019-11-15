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
import Pagination from '../Pagination/Pagination';

class BibsList extends React.Component {
  constructor(props) {
    super()
    this.state = {
      bibs: [],
      loading: true,
      bibPage: 1,
      lastBib: null,
      nextUrl: props.nextUrl,
    }
    this.fetchBib = this.fetchBib.bind(this);
    this.updateBibPage = this.updateBibPage.bind(this);
  }

  componentDidMount() {
    Promise.all(this.props.shepBibs.map(bib => this.fetchBib(bib)))
      .then(bibs => {
        this.setState({
        bibs,
        loading: false,
        lastBib: bibs.length - 1,
      })})
      .catch(
        (err) => {
          console.log('error: ', err);
          this.setState({ error: true });
        },
      );
  }

  fetchBib(bib) {
    let instutionCode
    switch (bib.institution) {
      case "recap-cul":
        instutionCode = 'cb'
        break;
      case "recap-pul":
        instutionCode = 'pb'
        break;
      default:
        instutionCode = 'b';
    }

    return axios({
      method: 'GET',
      url: `${appConfig.baseUrl}/api/bib?bibId=${instutionCode}${bib.bnumber}`,
      crossDomain: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
    .then(resp => (resp.data.status === 404 ? bib : resp))
  }

  // from here down until render() is copied and only slightly modifed from '../Results/ResultsList'

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
    if (!bib.data || _isEmpty(bib.data) || !bib.data.title) return <li className="nypl-results-item not-in-discovery" key={bib.bnumber}>{bib.title} bib id: {bib.bnumber}</li>;

    const result = bib.data;
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



  updateBibPage(page, type) {
    const {
      bibs,
      lastBib,
      nextUrl,
      bibPage,
    } = this.state;

    if (type === 'Previous') {
      if (lastBib > 9) this.setState({ lastBib: lastBib - 10, bibPage: bibPage - 1 });
    } else {
      if (lastBib + 10 < bibs.length) {
        this.setState({ lastBib: lastBib + 10, bibPage: bibPage + 1 });
      } else {
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
            Promise.all(res.data.bibs.map(bib => this.fetchBib(bib)))
              .then((respBibs) => {
                const newBibs = this.state.bibs.concat(respBibs);
                const newLast = newBibs.length - 1;
                this.setState({
                  bibs: newBibs,
                  loading: false,
                  lastBib: newLast,
                  nextUrl: newNextUrl,
                  bibPage: this.state.bibPage + 1,
                });
              },
              );
          })
          .catch(
            (err) => {
              console.log('error: ', err);
            },
          );
      }
    }
  }


  render() {
    const {
      bibPage,
      lastBib,
    } = this.state;

    const pagination = (
      <Pagination
        updatePage={this.updateBibPage}
        page={bibPage}
        subjectShowPage
      />
    );

    return (
      <div className="bibs-list">
        {pagination}
        <h4>Titles</h4>
        <ul>
          {
            this.state.bibs.length > 0
            ? this.state.bibs.slice(lastBib - 9, lastBib + 1).map(
              bib => this.generateBibLi(bib),
            )
            : null
          }
        </ul>
        {pagination}
      </div>
    );
  }
}

export default BibsList;
