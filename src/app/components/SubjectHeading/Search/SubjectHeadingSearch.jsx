import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import appConfig from '../../../data/appConfig';

import AutosuggestItem from './AutosuggestItem';

class SubjectHeadingSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSuggestion: 0,
      suggestions: [],
      userInput: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.resetAutosuggest = this.resetAutosuggest.bind(this);
    this.changeActiveSuggestion = this.changeActiveSuggestion.bind(this);
  }

  onSubmit(submitEvent) {
    submitEvent.preventDefault();
    const url = this.generatePath(this.state.suggestions[this.state.activeSuggestion]);
    this.resetAutosuggest();
    this.context.router.push(url);
  }

  onChange(inputEvent) {
    const userInput = inputEvent.currentTarget.value;

    this.setState({
      userInput,
    }, this.makeApiCallWithThrottle(userInput));
  }

  makeApiCallWithThrottle(userInput) {
    const apiCall = () => {
      return axios(`${appConfig.baseUrl}/api/subjectHeadings/autosuggest?query=${userInput}`)
        .then((res) => {
          if (res.data.request.query === this.state.userInput) this.setState({
            suggestions: res.data.autosuggest,
            activeSuggestion: 0,
          })
        });
    };

    let timerId;

    if (timerId || userInput.length === 0) return;
    timerId = setTimeout(() => {
      apiCall();
      timerId = undefined;
    }, 500);
  }

  changeActiveSuggestion(keyEvent) {
    const { suggestions, activeSuggestion } = this.state;
    if (suggestions.length > 0) {
      if (keyEvent.key === 'ArrowDown' && suggestions.length - 1 > activeSuggestion) {
        keyEvent.preventDefault();
        this.setState(prevState => ({
          activeSuggestion: prevState.activeSuggestion + 1,
        }));
      } else if (keyEvent.key === 'ArrowUp' && activeSuggestion > 0) {
        keyEvent.preventDefault();
        this.setState(prevState => ({
          activeSuggestion: prevState.activeSuggestion - 1,
        }));
      }
    }
  }

  resetAutosuggest() {
    this.setState({
      userInput: '',
      activeSuggestion: 0,
    });
  }

  generatePath(item) {
    const subfield = item.class === 'subfield';
    const base = appConfig.baseUrl;
    let path;

    if (subfield) {
      path = `${base}/subject_headings?filter=${item.label}`;
    } else if (item.uuid) {
      path = `${base}/subject_headings/${item.uuid}`;
    }

    return path;
  }

  render() {
    const {
      onChange,
      onSubmit,
      changeActiveSuggestion,
      state: {
        suggestions,
        activeSuggestion,
        userInput,
      },
    } = this;

    let suggestionsListComponent;

    if (userInput && suggestions.length) {
      suggestionsListComponent = (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <AutosuggestItem
              item={suggestion}
              path={this.generatePath(suggestion)}
              activeSuggestion={index === activeSuggestion}
              key={suggestion.uuid || suggestion.label}
              onClick={this.resetAutosuggest}
            />
          ))}
        </ul>
      );
    }

    return (
      <form
        className="autocomplete"
        autoComplete="off"
        onSubmit={onSubmit}
        onKeyDown={changeActiveSuggestion}
      >
        <div className="autocomplete-field">
          <label htmlFor="autosuggest">Subject Heading Search:</label>
          <input
            id="autosuggest"
            type="text"
            onChange={onChange}
            value={userInput}
            placeholder="Subject"
          />
          {suggestionsListComponent}
        </div>
      </form>
    );
  }
}

SubjectHeadingSearch.contextTypes = {
  router: PropTypes.object,
};

export default SubjectHeadingSearch;
