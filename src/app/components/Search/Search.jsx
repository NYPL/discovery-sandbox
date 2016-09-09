import React from 'react';
import cx from 'classnames';
import axios from 'axios';

import Actions from '../../actions/Actions.js';
import Store from '../../stores/Store.js';

import {
  isEmpty as _isEmpty,
  extend as _extend,
} from 'underscore';

/**
 * The main container for the top Search section of the New Arrivals app.
 */
class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({
        searchKeywords: '',
        searchOption: 'catalog',
        placeholder: 'Search the catalog',
        placeholderAnimation: null,
        noAnimationBefore: true,
      }, Store.getState());

    this.inputChange = this.inputChange.bind(this);
    this.submitSearchRequest = this.submitSearchRequest.bind(this);
    this.triggerSubmit = this.triggerSubmit.bind(this);
    this.animationTimer = this.animationTimer.bind(this);
    this.onChange = this.onChange.bind(this);
  }


  componentDidMount() {
    Store.listen(this.onChange);
  }

  componentDidUnMount() {
    Store.unlisten(this.onChange);
  }

  onChange() {
    this.setState(_extend(this.state, Store.getState()));
  }

  /**
   * animationTimer(element)
   * Add the CSS animation to the placeholder of the keywords Input.
   * It adds the proper class to the html element to trigger the animation,
   * and then removes the class to stop it.
   *
   * @param {DOM Element} element
   */
  animationTimer(element) {
    let frame = 0;
    const animation = setInterval(() => {
      frame ++;
      // Remove the class to stop the animation after 0.1s
      if (frame > 1) {
        clearInterval(animation);
        this.setState({ placeholderAnimation: null });
        // Set animation to be sequential
        this.setState({ noAnimationBefore: false });
      }
    }, 100);

    // Decide which CSS animation is going to perform
    // by adding different classes to the element.
    // It is based on if it is the first time the validation to be triggered.
    if (this.state.noAnimationBefore) {
      this.setState({ placeholderAnimation: 'initial' });
    } else {
      this.setState({ placeholderAnimation: 'sequential' });
    }
  }

  /**
   * submitSearchRequest()
   */
  submitSearchRequest() {
    // Store the data that the user entered
    const keyword = this.state.searchKeywords.trim();
    let inputKeywords;

    // This portion is for the interactions if the user doesn't enter any input
    if (!keyword) {
      // The selector for inputKeywords DOM element
      inputKeywords = this.refs.keywords;
      // The new placeholder that tells users there's no keywords input
      this.setState({ placeholder: 'Please enter a search term.' });
      // Trigger the validation animation
      this.animationTimer(inputKeywords);
    } else {
      axios
        .get(`/api?q=${keyword}`)
        .then(response => {
          // console.log(response.data);
          Actions.updateEbscoData(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  /**
   * triggerSubmit(event)
   * The fuction listens to the event of enter key.
   * Submit search request if enter is pressed.
   *
   * @param {Event} event
   */
  triggerSubmit(event) {
    if (event && event.charCode === 13) {
      this.submitSearchRequest(null);
    }
  }

  /**
   *  inputChange(field, event)
   * Listen to the changes on keywords input field and option input fields.
   * Grab the event value, and change the state.
   *
   * @param {Event Object} event - Passing event as the argument here
   * as FireFox doesn't accept event as a global variable.
   */
  inputChange(event) {
    this.setState({ searchKeywords: event.target.value });
  }

  render() {
    const pulseAnimation = cx({
      'keywords-pulse-fade-in': this.state.placeholderAnimation === 'initial',
      'keywords-pulse': this.state.placeholderAnimation === 'sequential',
    });

    let results = null;
    let hits = null;
    let ebscodata = this.state.ebscodata;
console.log(ebscodata);
    if (!_isEmpty(ebscodata)) {
      hits = (
        <div>
          <p>
            {ebscodata.SearchResult &&
             ebscodata.SearchResult.Statistics &&
             ebscodata.SearchResult.Statistics.TotalHits ?
              `Found ${ebscodata.SearchResult.Statistics.TotalHits} results` +
              `with keywords \"${this.state.searchKeywords}\".` : ''}
          </p>
          <div>
            Found results in the following databases
            <ul>
              {
                ebscodata.SearchResult.Statistics.Databases ?
                ebscodata.SearchResult.Statistics.Databases.map((d, i) => {
                  return <li key={i}>{d.Label}</li>;
                })
                : null
              }
            </ul>
          </div>
        </div>
      );
      results = ebscodata.SearchResult.Data.Records.map((d, i) => {
        const bibEntity = d.RecordInfo.BibRecord.BibEntity;
        const bibRelationShips = d.RecordInfo.BibRecord.BibRelationships;
        return (
          <li key={i}>
            <hr />
            <h3>{d.RecordInfo.BibRecord.BibEntity.Titles[0].TitleFull}</h3>
            <p>PubType: {d.Header.PubType}, Relevancy Score: {d.Header.RelevancyScore}</p>
            <p><a href={d.PLink}>PLink</a></p>
            <p>Availability: {d.FullText.Text.Availability}</p>
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
      <div className="search-container">
        <div className="search-form" onKeyPress={this.triggerSubmit}>
          <input
            placeholder={this.state.placeholder}
            className={`search-field ${pulseAnimation}`}
            onChange={this.inputChange}
            ref="keywords"
          />
          <button
            className="search-button"
            onClick={() => this.submitSearchRequest()}
          >
            <span className="nypl-icon-magnifier-fat"></span>
            Search
          </button>
        </div>
        <div>
          {hits}
          <ul className="results">
            {results}
          </ul>
        </div>
      </div>
    );
  }
}

export default Search;
