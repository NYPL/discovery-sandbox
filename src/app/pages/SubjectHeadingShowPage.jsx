import { Heading } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import SccContainer from '../components/SccContainer/SccContainer';
import SubjectHeadingSearch from '../components/SubjectHeading/Search/SubjectHeadingSearch';
import SubjectHeadingShow from '../components/SubjectHeading/SubjectHeadingShow';

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
      className="subject-heading-page"
    >
      <div
        className="subject-heading-page-header"
      >
        <Heading
          level={2}
          className="page-title"
        >
          { `Subject Heading "${label}"` }
        </Heading>
        <SubjectHeadingSearch />
      </div>
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
