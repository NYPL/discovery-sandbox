import PropTypes from 'prop-types';
import { Checkbox, Input, Label, Button, ButtonTypes } from '@nypl/design-system-react-components'
import appConfig from '@appConfig';
import React from 'react';
import { basicQuery } from '../../utils/utils';

const aggregations = require('../../../../advancedSearchAggregations.json');


const inputs = [
  'searchKeywords',
  'contributor',
  'subject',
  'title',
  'dateAfter',
  'dateBefore',
];

const labelsForFields = {
  searchKeywords: 'Keyword',
  contributor: 'Author',
  subject: 'Subject',
  title: 'Title',
  language: 'Language',
  dateAfter: 'Date Range',
  dateBefore: 'To',
  materialType: 'Format',
};


class AdvancedSearch extends React.Component {
  constructor(props, context) {
    super(props);
    // console.log('router? ', !!context.router);
    // this.state = {
    //   searchKeywords: null,
    //   contributor: null,
    //   title: null,
    //   subject: null,
    //   language: null,
    //   dateAfter: null,
    //   dateBefore: null,
    //   materialType: null,
    // };
  }


  render() {
    // const updateField = field => (e) => {
    //   console.log('updating: ', e);
    //   e.persist();
    //   e.preventDefault();
    //   const newState = {};
    //   newState[field] = e.target.value;
    //   this.setState(newState);
    // };

    const createAPIQuery = basicQuery({});

    // const addFilters = (state) => {
    //   const selectedFilters = {
    //     dateAfter: state.dateAfter,
    //     dateBefore: state.dateBefore,
    //     materialType: state.materialType,
    //     language: state.language,
    //   };
    //
    //   return Object.assign({}, state, { selectedFilters });
    // };

    const buildQueryDataFromForm = (formData) => {
      console.log('using formData: ', JSON.stringify(formData, null, 2));
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

      console.log('built queryData: ', JSON.stringify(queryData, null, 2));
      return queryData;
    };

    const submitForm = (e) => {
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
      const apiQuery = createAPIQuery(queryData);
      return this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
    };

    const triggerFormSubmit = () => {
      window.form = document.getElementById('advancedSearchForm');
    };


    return (
      <form id="advancedSearchForm" onSubmit={submitForm} method="POST">
        {
          inputs.map(key =>
            (
              <React.Fragment key={key}>
                <Label htmlFor={key}>{labelsForFields[key]}</Label>
                <Input id={key} type="text" />
              </React.Fragment>
            ),
          )
        }
        <fieldset>
          Format
          <ul id="formatList">
            {
              aggregations.materialType.map((materialType) => {
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
                  />
                );
              })
            }
          </ul>
        </fieldset>
        <Label htmlFor="languageSelect">Language</Label>
        <select id="languageSelect">
          {
            aggregations.language.map((language) => {
              return (
                <option value={language.value} key={language.value}>
                  {language.label}
                </option>
              );
            })
          }
        </select>
        <Button
          buttonType={ButtonTypes.primary}
          type="submit"
        >
          Submit
        </Button>
        <Button
          buttonType={ButtonTypes.primary}
        >
          Clear
        </Button>
      </form>
    );
  }
}

AdvancedSearch.contextTypes = {
  router: PropTypes.object,
};

export default AdvancedSearch;
