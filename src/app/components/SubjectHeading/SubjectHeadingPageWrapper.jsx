import React, { useState } from 'react'
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import useSccContainer from '../SccContainer/SccContainer'
import SubjectHeadingShow from './SubjectHeadingShow';
import SubjectHeadingsContainer from './SubjectHeadingsContainer';
import SubjectHeadingSearch from './Search/SubjectHeadingSearch';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const SubjectHeadingPageContent = (props) => {
  const {
    location: {
      query,
      query: {
        filter,
      },
    },
    params: {
      subjectHeadingUuid,
    }
  } = props;

  const containerKey = Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');

  const [label, setLabel] = useState('');

  const bannerText = subjectHeadingUuid ?
      label
      : ['Subject Headings', filter ? <span key='bannerText'> containing <em>{filter}</em></span>: '']

  return (
    <React.Fragment>
      {subjectHeadingUuid ?
        <SubjectHeadingShow
          {...props}
          key={subjectHeadingUuid}
          setBannerText={setLabel}
        />
        :
        <SubjectHeadingsContainer {...props} key={containerKey}/>
      }
    </React.Fragment>
  )
};

const SubjectHeadingPageWrapper = useSccContainer(
  SubjectHeadingPageContent,
  "Subject Headings"
)

export default SubjectHeadingPageWrapper;
