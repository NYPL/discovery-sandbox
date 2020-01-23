import React from 'react';
import PropTypes from 'prop-types';

import SccContainer from '../components/SccContainer/SccContainer';
import SubjectHeadingsContainer from '../components/SubjectHeading/SubjectHeadingsContainer';
import SubjectHeadingSearch from '../components/SubjectHeading/Search/SubjectHeadingSearch';

const SubjectHeadingsIndex = (props) => {
  const {
    location: {
      search,
      query: {
        filter,
      },
    },
  } = props;

  const componentKey = `subjectHeadingIndex${search}`;

  return (
    <SccContainer
      mainContent={<SubjectHeadingsContainer {...props} />}
      bannerOptions={
        {
          text: ['Subject Headings', filter ? <span key="bannerText"> containing <em>{filter}</em></span> : ''],
        }
      }
      extraBannerElement={<SubjectHeadingSearch />}
      loadingLayerText="Subject Headings"
      breadcrumbsType="subjectHeadings"
      key={componentKey}
    />
  );
};

SubjectHeadingsIndex.propTypes = {
  location: PropTypes.object,
};

export default SubjectHeadingsIndex;
