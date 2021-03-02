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
    location: {
      query,
    },
  } = props;

  const [label, setLabel] = useState(decodeURIComponent(query.label) || '');

  return (
    <SccContainer
      useLoadingLayer={false}
      activeSection="shep"
      pageTitle="Subject Heading"
    >
      <SubjectHeadingShow
        {...props}
        key={subjectHeadingUuid}
        setBannerText={setLabel}
      />
    </SccContainer>
  );
};

SubjectHeadingShowPage.propTypes = {
  params: PropTypes.object,
  bib: PropTypes.object,
  location: PropTypes.object,
};

SubjectHeadingShowPage.defaultProps = {
  bib: {},
};

SubjectHeadingShowPage.contextTypes = {
  router: PropTypes.object,
};

export default SubjectHeadingShowPage;
