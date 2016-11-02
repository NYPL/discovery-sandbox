import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';

import Actions from '../../actions/Actions.js';

class ResultsList extends React.Component {
  constructor(props) {
    super(props);

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

  getItems(items, result) {
    return items.map((item, i) => {
      const availability = item.availability[0].substring(7);
      const available = availability === 'AVAILABLE';
      const id = item['@id'].substring(4);

      return (
        <div className="sub-item" key={i}>
          <div>
            <span className="status available">{availability}</span>
            {
              available ? ' to use in ' : ''
            }
            <a href="#">{item.location.length ? item.location[0][0].prefLabel : null}</a>
            {
              result.idCallNum ? 
              (<span className="call-no"> with call no. {result.idCallNum[0]}</span>)
              : null
            }
          </div>
          <div>
            {
              available ?
                (
                  <Link
                    className="button"
                    to={`/hold/${id}`}
                    onClick={(e) => this.getRecord(e, id, 'hold')}
                  >
                    Place a hold
                  </Link>
                )
                : null
            }
          </div>
        </div>
      );
    });
  }

  render() {
    const results = this.props.results;
    let resultsElm = null;

    if (results.length) {
      resultsElm = results.map((item, i) => {
        const result = item.result;
        const itemTitle = result.title[0];
        const itemImage = result.btCover ? (
          <div className="result-image">
            <img src={result.btCover} />
          </div>
          ) : null;
        const authors = result.contributor && result.contributor.length ? 
          result.contributor.map((author) => `${author}; ` )
          : null;
        const id = result.idBnum;
        const items = result.items;

        return (
          <li key={i} className="result-item">
            <div className="result-text">
              <div className="type">{result.type ? result.type[0].prefLabel : null}</div>
              <Link
                onClick={(e) => this.getRecord(e, id, 'item')}
                href={`/item/${id}`}
                className="title"
              >
                {itemTitle}
              </Link>
              <div className="description author">
                {authors} {result.created}
              </div>
              <div className="description">
              </div>
              <div className="sub-items">
                {this.getItems(items, result)}
              </div>
            </div>
          </li>
        );
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
