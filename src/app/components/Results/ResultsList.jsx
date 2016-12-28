import React from 'react';
import { Link } from 'react-router';
import { isEmpty as _isEmpty } from 'underscore';

import Actions from '../../actions/Actions.js';
import LibraryItem from '../../utils/item.js';
import ResultItems from './ResultItems.jsx';
import { ajaxCall } from '../../utils/utils.js';

class ResultsList extends React.Component {
  constructor(props) {
    super(props);

    this.routeHandler = this.routeHandler.bind(this);
    this.getRecord = this.getRecord.bind(this);
  }

  getRecord(e, id, path) {
    e.preventDefault();

    ajaxCall(`/api/retrieve?q=${id}`, (response) => {
      // console.log(response.data);
      Actions.updateItem(response.data);
      this.routeHandler(`/${path}/${id}`);
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
    if (!bib.result || _isEmpty(bib.result)) return null;

    const result = bib.result;
    const collapsedBibs = bib.collapsedBibs && bib.collapsedBibs.length ?
      bib.collapsedBibs : [];
    const collapsedBibsElements = this.getCollapsedBibs(collapsedBibs);
    const itemTitle = result.title ? result.title[0] : '';
    const itemImage = result.btCover ? (
      <div className="result-image">
        <img src={result.btCover} alt={itemTitle} />
      </div>
      ) : null;
    const authors = author && result.contributor && result.contributor.length ?
      result.contributor.map((contributor) => `${contributor}; `)
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
          {
            items.length ? <ResultItems items={items} itemTitle={itemTitle} /> : null
          }
          {collapsedBibsElements}
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
