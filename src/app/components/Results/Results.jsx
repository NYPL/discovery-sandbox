import React from 'react';

import {
  isEmpty as _isEmpty,
  extend as _extend,
  keys as _keys,
} from 'underscore';

/**
 * The main container for the top Search section of the New Arrivals app.
 */
class Results extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const ebscodata = this.props.ebscodata;
    let results = null;

    if (!_isEmpty(ebscodata)) {
      results = ebscodata.SearchResult.Data.Records.map((d, i) => {
        const bibEntity = d.RecordInfo.BibRecord.BibEntity;
        const bibRelationShips = d.RecordInfo.BibRecord.BibRelationships;
        const an = d.Header['An'];
        const dbid = d.Header['DbId'];

        return (
          <li key={i}>
            <a href="#" onClick={() => this.getRecord(dbid, an)}>
              {d.RecordInfo.BibRecord.BibEntity.Titles[0].TitleFull}
            </a>
            <div>PubType: {d.Header.PubType}, Relevancy Score: {d.Header.RelevancyScore}</div>
            <div><a href={d.PLink}>PLink</a></div>
            <div>Availability: {d.FullText.Text.Availability}</div>
            <h4>Record Info</h4>
            <div>Identifiers
              <ul>
                {bibEntity.Identifiers ? bibEntity.Identifiers.map((identifier, j) => {
                  return <li key={j}>Type: {identifier.Type}, Value: {identifier.Value}</li>
                }) : null}
              </ul>
            </div>
            <div>Languages
              <ul>
                {bibEntity.Languages ? bibEntity.Languages.map((languages, j) => {
                  return <li key={j}>Code: {languages.Code}, Text: {languages.Text}</li>
                }) : null}
              </ul>
            </div>
            {
              bibEntity.PhysicalDescription ? (
                <div>Physical Description - 
                    Page Count: {bibEntity.PhysicalDescription.Pagination.PageCount}, 
                    Page Count: {bibEntity.PhysicalDescription.Pagination.StartPage}
                </div>
              ) : null
            }
            <div>Subjects:
              <ul>
                {bibEntity.Subjects ? bibEntity.Subjects.map((subject, j) => {
                  return <li key={j}>{subject.SubjectFull}</li>
                }) : null}
              </ul>
            </div>

            <h4>Contributor Relationships</h4>
            <ul>
              {
                bibRelationShips.HasContributorRelationships ?
                bibRelationShips.HasContributorRelationships.map((contributor, j) => {
                  return contributor.PersonEntity ?
                    <li key={j}>Contributor: {contributor.PersonEntity.Name.NameFull}</li>
                    :null;
                }) : null
              }
            </ul>

            <h4>Is Part of Relationships</h4>
            <ul>
              {
                bibRelationShips.IsPartOfRelationships ?
                bibRelationShips.IsPartOfRelationships.map((relationship, j) => {
                  if (relationship.BibEntity) {
                    const dates = relationship.BibEntity.Dates;
                    const identifiers = relationship.BibEntity.Identifiers;
                    const numbering = relationship.BibEntity.Numbering;
                    const titles = relationship.BibEntity.Titles;
                    return (
                      <li key={j}>
                        Titles:
                        {
                          titles ? titles.map((d, k) => {
                            return <span key={k}> {d.Type}, {d.TitleFull}</span>;
                          }) : null
                        }
                        <br />
                        Numbering: 
                        {
                          numbering ? numbering.map((d, k) => {
                            return <span key={k}> {d.Type}, {d.Value}</span>;
                          }) : null
                        }
                        <br />
                        Dates:
                        {
                          dates ? dates.map((d, k) => {
                            return <span key={k}> {d.Text} {d.Type}</span>;
                          }) : null
                        }
                        <br />
                        Identifiers: 
                        {
                          identifiers ? identifiers.map((d, k) => {
                            return <span key={k}> {d.Type}, {d.Value}</span>;
                          }) : null
                        }
                      </li>
                    );
                  }

                  return null;
                }) : null
              }
            </ul>
          </li>
        )
      });
    }

    return (
      <div>
        <div className="results-nav">

          <div className="pagination">
            <span className="pagination-total">1-100 of {ebscodata.SearchResult.Statistics.TotalHits}</span>
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
