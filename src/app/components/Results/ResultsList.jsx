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
    // Filter items that have a status, for now.
    const itemCount = items.filter(i => i.status).length;
    const maxDisplay = 5;
    const moreCount = itemCount - maxDisplay;
    const expandedItems = this.state.expandedItems;
    const resultId = result.idBnum;

    // available items first
    items.sort((a, b) => {
      const aAvailability = a.status && a.status[0].prefLabel.trim().toLowerCase() === 'available' ? -1 : 1;
      const bAvailability = b.status && b.status[0].prefLabel.trim().toLowerCase() === 'available' ? -1 : 1;
      return aAvailability - bAvailability;
    });

    return items.map((item, i) => {
      const availability = item.status && item.status[0].prefLabel ? item.status[0].prefLabel : '';
      const available = availability.trim().toLowerCase() === 'available';
      const id = item['@id'].substring(4);
      const availabilityClassname = availability.replace(/\W/g, '').toLowerCase();
      const collapsed = expandedItems.indexOf(resultId) < 0;

      return (
        <div key={i}>
          {
            item.status ?
            <div className={`sub-item ${i>=maxDisplay && collapsed ? 'more' : ''}`}>
              <div>
                <span className={`status ${availabilityClassname}`}>{availability}</span>
                {
                  available ? ' to use in ' : ' at location '
                }
                <span>{LibraryItem.getLocationLabel(item.location)}</span>
                {
                  item.shelfMark && item.shelfMark.length ?
                  (<span className="call-no"> with call no. {item.shelfMark[0]}</span>)
                  : null
                }
              </div>
              <div>
                {
                  available ?
                    (
                      <Link
                        className="button"
                        to={`/hold/request/${id}`}
                        onClick={(e) => this.getRecord(e, id, 'hold/request')}
                      >
                        Request a hold
                      </Link>
                    )
                    : null
                }
              </div>
            </div>
            : null
          }
          {
            i >= itemCount - 1 && moreCount > 0 && collapsed ?
              (
                <Link
                  onClick={(e) => this.showMoreItems(e, resultId)}
                  href="#see-more"
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
    const items = result.items;
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
