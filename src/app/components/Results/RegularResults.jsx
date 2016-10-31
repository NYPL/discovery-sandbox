import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';

import Actions from '../../actions/Actions.js';

class RegularResults extends React.Component {
  constructor(props) {
    super(props);

    this.routeHandler = this.routeHandler.bind(this);
    this.getRecord = this.getRecord.bind(this);
  }

  getRecord(e, id) {
    e.preventDefault();

    axios
      .get(`/api/retrieve?q=${id}`)
      .then(response => {
        console.log(response.data);
        Actions.updateItem(response.data);
        this.routeHandler(`/item/${id}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  routeHandler(route) {
    this.context.router.push(route);
  }

  render() {
    const results = this.props.results;
    let resultsElm = null;

    if (results.length) {
      resultsElm = results.map((item, i) => {
        const result = item.result;
        const itemTitle = result.title[0];
        const itemImage = result.depiction ? (
          <div className="result-image">
            <img src={result.depiction} />
          </div>
          ) : null;
        const authors = result.contributor && result.contributor.length ? 
          result.contributor.map((author) => `${author.prefLabel}; ` )
          : null;
        const id = result['@id'].substring(4);

        return (
          <li key={i} className="result-item">
            {itemImage}
            <div className="result-text">
              <div className="type">{result.type[0].prefLabel}</div>
              <Link
                onClick={(e) => this.getRecord(e, id)}
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
                <div className="sub-item">
                  <div>
                    <span className="status available">Available </span> to use in
                    <a href="#"> {result.owner.prefLabel}</a>
                    {
                      result.idCallNum ? 
                      (<span className="call-no"> with call no. {result.idCallNum[0]}</span>)
                      : null
                    }
                  </div>
                  <div>
                    <Link
                      className="button"
                      to={`/item/${id}}`}
                      onClick={(e) => this.getRecord(e, id)}
                    >
                      Place a hold
                    </Link>
                  </div>
                </div>
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

RegularResults.propTypes = {
  results: React.PropTypes.array,
};

RegularResults.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default RegularResults;
