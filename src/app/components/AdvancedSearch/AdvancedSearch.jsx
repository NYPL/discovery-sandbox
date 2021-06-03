import PropTypes from 'prop-types';
import appConfig from '@appConfig';
import React from 'react';
import { basicQuery } from '../../utils/utils';

class AdvancedSearch extends React.Component {
  constructor(props, context) {
    super(props);
    console.log('router? ', !!context.router);
    this.state = {
      keyword: null,
      author: null,
      title: null,
      subject: null,
      language: null,
      publicationDate: null,
      format: null,
    };
  }


  render() {
    const updateField = field => (e) => {
      console.log('updating: ', e);
      e.persist();
      e.preventDefault();
      const newState = {};
      newState[field] = e.target.value;
      this.setState(newState);
    };

    const createAPIQuery = basicQuery({});

    const gatherFields = () => {
      console.log('state: ', this.state);
      return Object.entries(this.state)
        .filter(([key, value]) => value)
        .map(([key, value]) => ({ [key]: value }))
        .reduce((acc, el) => ({ ...acc, ...el }), {});
    };

    const submitForm = (e) => {
      e.preventDefault();
      const apiQuery = createAPIQuery(gatherFields());
      return this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
    };

    return (
      <form>
        {
          Object.keys(this.state).map(key =>
            (
              <React.Fragment>
                <label htmlFor={key}>{key}</label>
                <input id={key} onChange={updateField(key)} />
              </React.Fragment>
            ),
          )
        }
        <label htmlFor="submit">Submit</label>
        <input id="sibmit" onClick={submitForm} />
      </form>
    );
  }
}

AdvancedSearch.contextTypes = {
  router: PropTypes.object,
};

export default AdvancedSearch;
