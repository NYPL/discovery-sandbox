import React from 'react';
import PropTypes from 'prop-types';

import ShepContainer from '../components/ShepContainer/ShepContainer';
import SubjectHeadingsIndex from '../components/SubjectHeading/SubjectHeadingsIndex';
import SubjectHeadingSearch from '../components/SubjectHeading/Search/SubjectHeadingSearch';
import { basicQuery } from '../utils/utils';

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
  const breadcrumbUrls = {}
  const searchUrl = basicQuery(props)({});
  if (searchUrl) breadcrumbUrls.searchUrl = searchUrl;
  if (props.bib.uri) breadcrumbUrls.bibUrl = `/bib/${props.bib.uri}`;

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
      breadcrumbProps={{
        type: 'subjectHeadings',
        urls: breadcrumbUrls,
      }}
      key={componentKey}
    />
  );
};

SubjectHeadingsIndexPage.propTypes = {
  location: PropTypes.object,
};

export default SubjectHeadingsIndexPage;
