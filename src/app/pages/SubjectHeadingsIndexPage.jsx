import React from 'react';
import PropTypes from 'prop-types';

import ShepContainer from '../components/ShepContainer/ShepContainer';
import SubjectHeadingsIndex from '../components/SubjectHeading/SubjectHeadingsIndex';
import SubjectHeadingSearch from '../components/SubjectHeading/Search/SubjectHeadingSearch';

const SubjectHeadingsIndexPage = (props) => {
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
      mainContent={<SubjectHeadingsIndex {...props} />}
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

SubjectHeadingsIndexPage.propTypes = {
  location: PropTypes.object,
};

export default SubjectHeadingsIndexPage;
