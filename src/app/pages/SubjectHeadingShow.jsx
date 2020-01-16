import React, { useState } from 'react'
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import SccContainer from '../components/SccContainer/SccContainer'
import SubjectHeadingShow from '../components/SubjectHeading/SubjectHeadingShow';
import SubjectHeadingSearch from '../components/SubjectHeading/Search/SubjectHeadingSearch';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';

const SubjectHeadingShowPage = (props) => {
  const {
    params: {
      subjectHeadingUuid,
    }
  } = props;

  const [label, setLabel] = useState('');

  return (
    <SccContainer
      mainContent={
        <SubjectHeadingShow
          {...props}
          key={subjectHeadingUuid}
          setBannerText={setLabel}
        />
      }
      bannerOptions={
        {
          text: label,
        }
      }
      extraBannerElement={<SubjectHeadingSearch />}
      loadingLayerText="Subject Heading"
      breadcrumbsType="subjectHeading"
    />
  )
};

export default SubjectHeadingShowPage;
