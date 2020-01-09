import axios from 'axios';
// import { connect } from 'react-redux'

import appConfig from '../data/appConfig';

export function fetchForSubjectHeadingIndex(query) {
  console.log(dispatch);
  let {
    fromLabel,
    fromComparator,
    filter,
    sortBy,
    fromAttributeValue,
  } = query;

  if (!fromComparator) fromComparator = filter ? null : 'start';
  if (!fromLabel) fromLabel = filter ? null : 'Aac';

  const apiParamHash = {
    from_comparator: fromComparator,
    from_label: fromLabel,
    filter,
    sort_by: sortBy,
    from_attribute_value: fromAttributeValue,
  };

  const apiParamString = Object
    .entries(apiParamHash)
    .map(([key, value]) => (value ? `${key}=${value}` : null))
    .filter(pair => pair)
    .join('&');

  return axios({
    method: 'GET',
    url: `${appConfig.shepApi}/subject_headings?${apiParamString}`,
  },
  ).then(
    (res) => {
      console.log('done fetching');
      return {
        previousUrl: res.data.previous_url,
        nextUrl: res.data.next_url,
        subjectHeadings: res.data.subject_headings,
        error: res.data.subject_headings.length === 0,
        loading: false,
      };
    },
  ).catch(
    (err) => {
      console.log('error: ', err);
      if (!this.state.subjectHeadings || this.state.subjectHeadings.length === 0) {
        Actions.updateSubjectHeadingIndex({ error: true });
      }
    },
  );
}

export default {
  fetchForSubjectHeadingIndex
};
