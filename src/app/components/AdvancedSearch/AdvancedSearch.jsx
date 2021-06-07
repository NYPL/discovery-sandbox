import PropTypes from 'prop-types';
import { Checkbox, Input, Label, Button, ButtonTypes, Select } from '@nypl/design-system-react-components'
import appConfig from '@appConfig';
import React from 'react';
import { basicQuery } from '../../utils/utils';
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

const buildQueryDataFromForm = (formData) => {
  const queryData = {};

  // Add advanced search params
  ['searchKeywords', 'contributor', 'title', 'subject'].forEach((inputType) => {
    const inputData = formData.find(entry => entry.id === inputType);
    if (inputData.value) queryData[inputType] = inputData.value;
  });

  // Add dates
  ['dateAfter', 'dateBefore'].forEach((inputType) => {
    const inputData = formData.find(entry => entry.id === inputType);
    if (inputData.value) {
      queryData.selectedFilters = queryData.selectedFilters || {};
      queryData.selectedFilters[inputType] = inputData.value;
    }
  });

  // Add formats
  formData.forEach((input) => {
    if (input.checked) {
      queryData.selectedFilters = queryData.selectedFilters || {};
      queryData.selectedFilters.materialType = queryData.selectedFilters.materialType || [];
      queryData.selectedFilters.materialType.push(input.id);
    }
  });

  // Add language
  const languageData = formData.find(entry => entry.id === 'languageSelect');
  if (languageData.value) {
    queryData.selectedFilters = queryData.selectedFilters || {};
    queryData.selectedFilters.language = [languageData.value];
  }

  return queryData;
};

const submitForm = router => (e) => {
  e.preventDefault();
  const formData = Array.from(document.getElementsByTagName('input')).map(input => ({
    id: input.id,
    value: input.value,
    checked: input.checked,
  })).concat(
    Array.from(document.getElementsByTagName('select')).map(select => ({
      id: select.id,
      value: select.value,
    })),
  );

  const queryData = buildQueryDataFromForm(formData);

  if (!Object.keys(queryData).length) return this.alarm();

  const apiQuery = createAPIQuery(queryData);
  return router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
};


class AdvancedSearch extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      alarm: false,
    };

    this.alarm = this.alarm.bind(this);
  }

  alarm() {
    this.setState({ alarm: true });
  }


  render() {
    return (
      <SccContainer
        activeSection="search"
        pageTitle="advancedSearch"
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
        <h1 id="advancedSearchHeading">Advanced Search</h1>
        <form id="advancedSearchForm" onSubmit={submitForm(this.context.router)} method="POST" action={`${appConfig.baseUrl}/search`}>
          <div id="fields">
            <div className="advancedSearchColumnLeft">
              <ul>
                {
                  leftInputs.map(key =>
                    (
                      <li key={key}>
                        <Label htmlFor={key} id={`${key}-input-label`}>{labelsForFields[key]}</Label>
                        <Input
                          id={key}
                          type="text"
                          attributes={{ name: key }}
                          aria-labelledby={`${key}-input-label`}
                        />
                      </li>
                    ),
                  )
                }
                <li>
                  <Label htmlFor="languageSelect" id="labguageSelect-label">Language</Label>
                  <Select id="languageSelect" name="language" aria-labelledby="languageSelect-label">
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
                            <Label htmlFor={key} id={`${key}-li-label`}>{labelsForFields[key]}</Label>
                            <Input id={key} type="text" attributes={{ name: key }} aria-labelledby={`${key}-li-label`} />
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
                              labelOptions={{
                                id: materialType.value,
                                labelContent: materialType.label,
                              }}
                              showLabel
                              checkboxId={materialType.value}
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
                              labelOptions={{
                                id: materialType.value,
                                labelContent: materialType.label,
                              }}
                              showLabel
                              checkboxId={materialType.value}
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
            </div>
          </div>
          <hr />
          <div id="advancedSearchButtons">
            <Button
              buttonType={ButtonTypes.Primary}
              type="submit"
            >
              Submit
            </Button>
            <Button
              buttonType={ButtonTypes.Secondary}
              className="clearButton"
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
