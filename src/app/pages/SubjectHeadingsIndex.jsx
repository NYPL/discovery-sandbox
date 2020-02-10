import React from 'react';
import PropTypes from 'prop-types';

import ShepContainer from '../components/ShepContainer/ShepContainer';
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
    <ShepContainer
      mainContent={<SubjectHeadingsContainer {...props} />}
      bannerOptions={
        {
          text: ['Subject Headings', filter ? <span key="bannerText"> containing <em>{filter}</em></span> : ''],
        }
      }
      extraBannerElement={<SubjectHeadingSearch />}
      loadingLayerText={`Subject Headings ${filter ? `containing ${filter}` : ''}`}
      breadcrumbsType="subjectHeadings"
      key={componentKey}
    />
  );
};

SubjectHeadingsIndex.propTypes = {
  location: PropTypes.object,
};

export default SubjectHeadingsIndex;
