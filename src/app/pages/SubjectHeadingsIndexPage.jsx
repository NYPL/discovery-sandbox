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

  const bannerInnerHtml = filter ? <span key="bannerText">Subject Headings containing <em>{filter}</em></span> : <span key="bannerText">Subject Headings</span>

  return (
    <ShepContainer
      mainContent={<SubjectHeadingsIndex {...props} />}
      bannerOptions={
        {
          text: bannerInnerHtml,
          ariaLabel: filter ? `Subject Headings containing ${filter}` : 'Subject Headings'
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
