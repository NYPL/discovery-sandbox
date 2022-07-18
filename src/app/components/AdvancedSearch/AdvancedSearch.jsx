import PropTypes from 'prop-types';
import { Checkbox, Label, Button, Select, TextInput } from '@nypl/design-system-react-components';
import appConfig from '@appConfig';
import React from 'react';
import { basicQuery } from '../../utils/utils';
import { buildQueryDataFromForm } from '../../utils/advancedSearchUtils';
import SccContainer from '../SccContainer/SccContainer';

const aggregations = require('../../../../advancedSearchAggregations.json');

const materialTypes = aggregations.materialType.sort((a, b) => (a.label > b.label ? 1 : -1));
const languages = [
  {
    value: '',
    label: '-- Any -- ',
  },
].concat(aggregations.language.sort((a, b) => (a.label > b.label ? 1 : -1)));

const leftInputs = [
  'searchKeywords',
  'title',
  'contributor',
  'subject',
];

const rightInputs = [
  'dateAfter',
  'dateBefore',
];

const labelsForFields = {
  searchKeywords: 'Keyword',
  contributor: 'Author',
  subject: 'Subject',
  title: 'Title',
  language: 'Language',
  dateAfter: 'From',
  dateBefore: 'To',
  materialType: 'Format',
};

const clearFields = (e) => {
  e.preventDefault();

  Array.from(document.getElementsByTagName('input')).forEach((input) => {
    input.value = '';
    input.checked = false;
  });

  Array.from(document.getElementsByTagName('select')).forEach((select) => {
    select.value = '';
  });
};

const createAPIQuery = basicQuery({});

class AdvancedSearch extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      alarm: false,
    };

    this.alarm = this.alarm.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  alarm() {
    this.setState({ alarm: true });
  }

  submitForm(e) {
    e.preventDefault();
    const form = document.getElementsByTagName('form')[0];
    const formData = new FormData(form);
    const queryData = buildQueryDataFromForm(Array.from(formData.entries()));

    if (!Object.keys(queryData).length) return this.alarm();

    const apiQuery = createAPIQuery(queryData);
    return this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
  }


  render() {
    return (
      <SccContainer
        activeSection="search"
        pageTitle="Advanced Search"
        className="advancedSearchContainer"
      >
        { this.state.alarm &&
          (
            <aside
              id="advancedSearchAside"
              aria-label="alert-enter-at-least-one-field"
            >
              <img src="./src/client/assets/Alert_Icon.svg" alt="Exclamation mark in a triangle" />
              Please enter at least one field to submit an advanced search.
            </aside>
          )
        }
        <h2 id="advancedSearchHeading" className="page-title">Advanced Search</h2>
        <form id="advancedSearchForm" onSubmit={this.submitForm} method="POST" action={`${appConfig.baseUrl}/search`}>
          <div id="fields">
            <div className="advancedSearchColumnLeft">
              <ul>
                {
                  leftInputs.map(key =>
                    (
                      <li key={key}>
                        <TextInput
                          id={key}
                          labelText={labelsForFields[key]}
                          type="text"
                          name={key}
                        />
                      </li>
                    ),
                  )
                }
                <li>
                  <Select
                    id="languageSelect"
                    name="language"
                    labelText="Language"
                    aria-labelledby="languageSelect-label"
                  >
                    {
                      languages.map((language) => {
                        return (
                          <option value={language.value} key={language.value}>
                            {language.label}
                          </option>
                        );
                      })
                    }
                  </Select>
                </li>
              </ul>
            </div>
            <div className="advancedSearchColumnRight">
              <ul>
                <Label htmlFor="dates" id="dates-label">
                  Date
                </Label>
                <li id="dates" aria-labelledby="dates-label">
                  <ul id="dateList">
                    {
                      rightInputs.map(key =>
                        (
                          <li key={key} id={`${key}-li`}>
                            <TextInput
                              ariaLabelledBy={`${key}-li-label`}
                              id={key}
                              labelText={labelsForFields[key]}
                              name={key}
                              type="text"
                            />
                          </li>
                        ),
                      )
                    }
                  </ul>
                </li>
                <li>
                  <Label htmlFor="formats" id="formats-label">
                    Format
                  </Label>
                  <fieldset id="formats" aria-labelledby="formats-label">
                    <ul id="formatListLeft">
                      {
                        materialTypes.slice(0, 4).map((materialType) => {
                          return (
                            <Checkbox
                              id={materialType.value}
                              labelText={materialType.label}
                              value={materialType.value}
                              key={materialType.value}
                              name={materialType.value}
                            />
                          );
                        })
                      }
                    </ul>
                    <ul id="formatListRight">
                      {
                        materialTypes.slice(4).map((materialType) => {
                          return (
                            <Checkbox
                              id={materialType.value}
                              labelText={materialType.label}
                              showLabel
                              value={materialType.value}
                              key={materialType.value}
                              name={materialType.value}
                            />
                          );
                        })
                      }
                    </ul>
                  </fieldset>
                </li>
              </ul>
              <input type="hidden" name="advancedSearch" value="true" />
            </div>
          </div>
          <hr />
          <div id="advancedSearchButtons">
            <Button
              buttonType="primary"
              id="advancedSearchSubmit"
              type="submit"
            >
              Submit
            </Button>
            <Button
              buttonType="secondary"
              className="clearButton"
              id="advancedSearchClear"
              type="button"
              onClick={clearFields}
            >
              Clear
            </Button>
          </div>
        </form>
      </SccContainer>
    );
  }
}

AdvancedSearch.contextTypes = {
  router: PropTypes.object,
};

export default AdvancedSearch;
