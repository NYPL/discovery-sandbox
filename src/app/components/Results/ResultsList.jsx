import React from 'react';
import { Link } from 'react-router';
import {
  isEmpty as _isEmpty,
  chain as _chain,
} from 'underscore';

import Actions from '../../actions/Actions';
import LibraryItem from '../../utils/item';
import { ajaxCall } from '../../utils/utils';

class ResultsList extends React.Component {
  constructor(props) {
    super(props);

    this.routeHandler = this.routeHandler.bind(this);
    this.getRecord = this.getRecord.bind(this);
  }

  getRecord(e, id) {
    e.preventDefault();

    ajaxCall(`/api/retrieve?q=${id}`, (response) => {
      Actions.updateBib(response.data);
      this.routeHandler(`/item/${id}`);
    });
  }

  getCollapsedBibs(collapsedBibs) {
    if (!collapsedBibs.length) return null;

    const bibs = collapsedBibs.map((bib, i) => this.getBib(bib, false, i));

    return (
      <div className="related-items">
        <h4>Related formats and editions</h4>
        <ul>
          {bibs}
        </ul>
      </div>
    );
  }

  getBibTitle(bib) {
    if (!bib.titleDisplay) {
      const author = bib.creatorLiteral && bib.creatorLiteral.length ?
        ` / ${bib.creatorLiteral[0]}` : '';
      return bib.title && bib.title.length ? `${bib.title[0]}${author}` : '';
    }
    return bib.titleDisplay;
  }

  getBib(bib, author, i) {
    if (!bib.result || _isEmpty(bib.result) || !bib.result.title) return null;

    const result = bib.result;
    const itemTitle = this.getBibTitle(result);
    const id = result['@id'].substring(4);
    const items = LibraryItem.getItems(result);
    // Just displaying information for the first item for now, unless if the first item
    // is displays a HathiTrust viewer, in that case display the second item.
    const firstItem = items.length && items[0].actionLabel !== 'View online' ?
      items[0] : (items[1] ? items[1] : null);
    const materialType = result && result.materialType && result.materialType[0] ?
      result.materialType[0].prefLabel : null;
    const yearPublished = result && result.dateStartYear ? result.dateStartYear : null;
    const usageType = firstItem ? firstItem.actionLabel : null;
    const location = _chain(items)
      .pluck('location')
      .uniq()
      .value()
      .join(', ');

    return (
      <li key={i} className="nypl-results-item">
        <h2>
          <Link
            onClick={(e) => this.getRecord(e, id)}
            href={`/item/${id}`}
            className="title"
          >
            {itemTitle}
          </Link>
        </h2>
        <div className="nypl-results-item-description">
          <span className="nypl-results-media">{materialType}</span>
          <span className="nypl-results-date">{yearPublished}</span>
          <span className="nypl-results-room">{location}</span>
          <span className="nypl-results-use">{usageType}</span>
        </div>
      </li>
    );
  }

  routeHandler(route) {
    this.context.router.push(route);
  }

  render() {
    const results = this.props.results;
    let resultsElm = null;

    if (results && results.length) {
      resultsElm = results.map((bib, i) => this.getBib(bib, true, i));
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
