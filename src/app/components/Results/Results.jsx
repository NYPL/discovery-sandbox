import React from 'react';
import { Link } from 'react-router';

import {
  isEmpty as _isEmpty,
} from 'underscore';

class Results extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const ebscodata = this.props.ebscodata;
    const itemTotalResults = ebscodata.SearchResult ? ebscodata.SearchResult.Statistics.TotalHits : '';
    let results = null;

    if (!_isEmpty(ebscodata)) {
      results = ebscodata.SearchResult.Data.Records.map((d, i) => {
        const bibEntity = d.RecordInfo.BibRecord.BibEntity;
        const bibRelationShips = d.RecordInfo.BibRecord.BibRelationships;
        const an = d.Header['An'];
        const dbid = d.Header['DbId'];

        const itemImage = null;
        const itemTitle = d.RecordInfo.BibRecord.BibEntity.Titles[0].TitleFull

        return (
          <li key={i} className="result-item">
            {itemImage}
            <div className="result-text">
              <div className="type">{d.Header.PubType}</div>
              <Link to={`/item/${an}`} className="title">{itemTitle}</Link>
              <div className="description">
                  {
                    bibRelationShips.HasContributorRelationships ?
                    bibRelationShips.HasContributorRelationships.map((contributor, j) => {
                      return contributor.PersonEntity ?
                        `${contributor.PersonEntity.Name.NameFull}; `
                        :null;
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
                  <a href={d.PLink} className="view-online">View online</a>
                </div>
              </div>
            </div>
            <div className="result-actions">
              <div>
                <Link className="button" to={`/hold/${an}`}>Place hold</Link>
              </div>
            </div>
          </li>
        )
      });
    }

    return (
      <div>
        <div className="results-nav">
          <div className="pagination">
            <span className="pagination-total">1-10 of {itemTotalResults}</span>
            <a href="#" className="paginate next">Next Page</a>
          </div>

          <div className="sort">
            <form className="sort-form">
              <label htmlFor="sort-by">Sort by</label>
              <select id="sort-by" name="sort">
                <option value="relevance">Relevance</option>
                <option value="title_asc">Title (a - z)</option>
                <option value="title_desc">Title (z - a)</option>
                <option value="author_asc">Author (a - z)</option>
                <option value="author_desc">Author (z - a)</option>
                <option value="date_asc">Date (old to new)</option>
                <option value="date_desc">Date (new to old)</option>
              </select>
            </form>
          </div>
        </div>

        <ul className="results-list">
          {results}
        </ul>
      </div>
    );
  }
}

Results.propTypes = {
  ebscodata: React.PropTypes.object,
};

export default Results;
