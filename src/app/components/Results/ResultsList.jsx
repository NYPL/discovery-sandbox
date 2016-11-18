import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';

import Actions from '../../actions/Actions.js';
import LibraryItem from '../../utils/item.js';

class ResultsList extends React.Component {
  constructor(props) {
    super(props);

    this.state ={
      expandedItems: []
    };

    this.routeHandler = this.routeHandler.bind(this);
    this.getRecord = this.getRecord.bind(this);
    this.getItems = this.getItems.bind(this);
  }

  getRecord(e, id, path) {
    e.preventDefault();

    axios
      .get(`/api/retrieve?q=${id}`)
      .then(response => {
        // console.log(response.data);
        Actions.updateItem(response.data);
        this.routeHandler(`/${path}/${id}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  routeHandler(route) {
    this.context.router.push(route);
  }

  showMoreItems(e, id){
    e.preventDefault();

    // This is a makeshift way of doing it; we should probably have the sub-items as another component that tracks its own expanded/collapsed state
    const expandedItems = this.state.expandedItems;
    expandedItems.push(id);
    this.setState({ expandedItems: expandedItems });
  }

  getItems(items, result) {
    const itemCount = items.length;
    const maxDisplay = 5;
    const moreCount = itemCount - maxDisplay;
    const expandedItems = this.state.expandedItems;
    const resultId = result.idBnum;

    return items.map((item, i) => {
      const status = item.status;
      const availability = item.availability;
      const available = item.available;
      const id = item.id;
      const collapsed = expandedItems.indexOf(resultId) < 0;

      return (
        <div key={i}>
          <div className={`sub-item ${i>=maxDisplay && collapsed ? 'more' : ''}`}>
            <div>
              <span className={`status ${availability}`}>{status}</span>
              {
                available ? ' to use in ' : ' at location '
              }
              <span>{item.location}</span>
              {
                item.callNumber.length ?
                (<span className="call-no"> with call no. {item.callNumber}</span>)
                : null
              }
            </div>
            <div>
              {item.url && item.url.length ?
                <a
                  href={item.url}
                  className="button">
                  {item.actionLabel}
                </a>
              : null}
            </div>
          </div>
          {
            i >= itemCount - 1 && moreCount > 0 && collapsed ?
              (
                <Link
                  onClick={(e) => this.showMoreItems(e, resultId)}
                  href="#"
                  className="see-more-link">
                  See {moreCount} more item{moreCount > 1 ? 's' : ''}
                </Link>
              )
              : null
          }
        </div>
      );
    });
  }

  getCollapsedBibs(collapsedBibs) {
    if (!collapsedBibs.length) return null;

    const bibs = collapsedBibs.map((bib, i) => {
      return this.getBib(bib, false, i);
    });

    return (
      <div className="related-items">
        <h4>Related formats and editions</h4>
        <ul>
          {bibs}
        </ul>
      </div>
    );
  }

  getBib(bib, author, i) {
    if (!bib.result) return null;

    const result = bib.result;
    const collapsedBibs = bib.collapsedBibs && bib.collapsedBibs.length ?
      bib.collapsedBibs : [];
    const collapsedBibsElements = this.getCollapsedBibs(collapsedBibs);
    const itemTitle = result.title[0];
    const itemImage = result.btCover ? (
      <div className="result-image">
        <img src={result.btCover} />
      </div>
      ) : null;
    const authors = author && result.contributor && result.contributor.length ?
      result.contributor.map((author) => `${author}; ` )
      : null;
    const id = result['@id'].substring(4);
    const items = LibraryItem.getItems(result);
    const hathiAvailable = result.hathiVols && result.hathiVols.length;

    return (
      <li key={i} className="result-item">
        <div className="result-text">
          {/*<div className="type">{result.type ? result.type[0].prefLabel : null}</div>*/}
          <Link
            onClick={(e) => this.getRecord(e, id, 'item')}
            href={`/item/${id}`}
            className="title"
          >
            {itemTitle}
          </Link>
          {
            author &&
            (<div className="description author">
              {authors} {result.created}
            </div>)
          }
          {
            hathiAvailable &&
            (<div className="description">
              <em>Available to view on this website</em>
            </div>)
          }
          <div className="sub-items">
            {this.getItems(items, result)}
          </div>
          {collapsedBibsElements}
        </div>
      </li>
    );
  }

  render() {
    const results = this.props.results;
    let resultsElm = null;

    if (results && results.length) {
      resultsElm = results.map((bib, i) => {
        return this.getBib(bib, true, i);
      });
    }

    return (
      <ul className="results-list">
        {resultsElm}
      </ul>
    );
  }
}

ResultsList.propTypes = {
  results: React.PropTypes.array,
};

ResultsList.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default ResultsList;
