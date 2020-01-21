import React, { useState } from 'react';
import PropTypes from 'prop-types';

import SccContainer from '../components/SccContainer/SccContainer';
import SubjectHeadingShow from '../components/SubjectHeading/SubjectHeadingShow';
import SubjectHeadingSearch from '../components/SubjectHeading/Search/SubjectHeadingSearch';

const SubjectHeadingShowPage = (props) => {
  const {
    params: {
      subjectHeadingUuid,
    },
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
  );
};

SubjectHeadingShowPage.propTypes = {
  params: PropTypes.object,
};

export default SubjectHeadingShowPage;
