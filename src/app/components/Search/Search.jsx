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

    if (!_isEmpty(ebscodata)) {
      hits = (
        <div>
          {ebscodata.SearchResult &&
           ebscodata.SearchResult.Statistics &&
           ebscodata.SearchResult.Statistics.TotalHits ?
            `Results ${ebscodata.SearchResult.Statistics.TotalHits}` : ''}
        </div>
      );
      results = ebscodata.SearchResult.Data.Records.map((d, i) => {
        return (
          <div>
            <hr />
            <p>PubType: {d.Header.PubType}</p>
            <p><a href={d.PLink}>PLink</a></p>
            <h3>Record Info</h3>
            <p>Title: {d.RecordInfo.BibRecord.BibEntity.Titles[0].TitleFull}</p>
            <div>Subjects:
              <ul>
                {d.RecordInfo.BibRecord.BibEntity.Subjects.map((subject, i) => {
                  return <li key={i}>{subject.SubjectFull}</li>
                })}
              </ul>
            </div>
          </div>
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
          {results}
        </div>
      </div>
    );
  }
}

export default Search;
