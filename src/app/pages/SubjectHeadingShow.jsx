import React, { useState } from 'react'
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import SccContainer from '../SccContainer/SccContainer'
import SubjectHeadingShow from './SubjectHeadingShow';
import SubjectHeadingsContainer from './SubjectHeadingsContainer';
import SubjectHeadingSearch from './Search/SubjectHeadingSearch';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const SubjectHeadingShowPage = (props) => {
  const {
    params: {
      subjectHeadingUuid,
    }
  } = props;

  const [label, setLabel] = useState('');

  console.log(label);

  return (
    <SccContainer
      mainContent={
        <SubjectHeadingShow
          {...props}
          key={subjectHeadingUuid}
          setBannerText={setLabel}
        />
      }
      bannerText={label}
      bannerRightElement={<SubjectHeadingSearch />}
    />
  )
};

export default SubjectHeadingShowPage;
