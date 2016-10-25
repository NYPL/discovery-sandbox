import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';

import Actions from '../../actions/Actions.js';

class EResourceResults extends React.Component {
  constructor(props) {
    super(props);

    this.routeHandler = this.routeHandler.bind(this);
    this.getRecord = this.getRecord.bind(this);
  }

  getRecord(e, dbid, an) {
    e.preventDefault();

    axios
      .get(`/api/retrieve?dbid=${dbid}&an=${an}`)
      .then(response => {
        console.log(response.data);
        Actions.updateItem(response.data);
        this.routeHandler(`/item?an=${an}&dbid=${dbid}&q=${this.props.query}`);
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
      resultsElm = results.map((d, i) => {
        const bibEntity = d.RecordInfo.BibRecord.BibEntity;
        const bibRelationShips = d.RecordInfo.BibRecord.BibRelationships;
        const an = d.Header['An'];
        const dbid = d.Header['DbId'];

        const itemImage = null;
        const itemTitle = bibEntity.Titles[0].TitleFull;

        return (
          <li key={i} className="result-item">
            {itemImage}
            <div className="result-text">
              <div className="type">{d.Header.PubType}</div>
              <Link
                onClick={(e) => this.getRecord(e, dbid, an)}
                href={`/item?an=${an}&dbid=${dbid}&q=${this.props.query}`}
                className="title"
              >
                {itemTitle}
              </Link>
              <div className="description">
                  {
                    bibRelationShips.HasContributorRelationships ?
                    bibRelationShips.HasContributorRelationships.map((contributor) => {
                      return contributor.PersonEntity ?
                        `${contributor.PersonEntity.Name.NameFull}; `
                        : null;
                    }) : null
                  }
                  {
                    bibRelationShips.IsPartOfRelationships[0].BibEntity ?
                    bibRelationShips.IsPartOfRelationships[0].BibEntity.Dates[0].Text
                    : null
                  }
              </div>
              <div className="description">
                {
                  bibRelationShips.IsPartOfRelationships ?
                  bibRelationShips.IsPartOfRelationships.map((relationship, j) => {
                    if (relationship.BibEntity) {
                      const dates = relationship.BibEntity.Dates;
                      const identifiers = relationship.BibEntity.Identifiers;
                      const numbering = relationship.BibEntity.Numbering;

                      return (
                        <div key={j}>
                          {
                            numbering ? numbering.map((number, k) => {
                              return <span key={k}> {number.Type}: {number.Value}</span>;
                            }) : null
                          }
                          <br />
                          {
                            identifiers ? identifiers.map((identifier, k) => {
                              return <span key={k}> {identifier.Type}: {identifier.Value}</span>;
                            }) : null
                          }
                        </div>
                      );
                    }

                    return null;
                  })
                  : null
                }
              </div>
              <div className="sub-items">
                <div className="sub-item">
                  <div><span className="status available">Available</span> to view online</div>
                  <div>
                    {/*<Link
                      className="view-online button"
                      to={`/item?an=${an}&dbid=${dbid}&q=${this.props.query}`}
                      onClick={(e) => this.getRecord(e, dbid, an)}
                    >
                      View online
                    </Link>*/}
                    <a href={d.PLink} className="button">View on EBSCO</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="result-actions">
              {/*<div>
                <a href={d.PLink} className="button">View on EBSCO</a>
              </div>*/}
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

EResourceResults.propTypes = {
  results: React.PropTypes.array,
};

EResourceResults.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default EResourceResults;
