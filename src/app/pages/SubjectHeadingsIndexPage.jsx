import React from 'react';
import PropTypes from 'prop-types';

import SccContainer from '../components/SccContainer/SccContainer';
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
  if (props.bib && props.bib.uri) breadcrumbUrls.bibUrl = `/bib/${props.bib.uri}`;

  const bannerInnerHtml = filter ? <span key="bannerText">Subject Headings containing <em>{filter}</em></span> : <span key="bannerText">Subject Headings</span>

  return (
    <SccContainer
      key={componentKey}
      useLoadingLayer={false}
      activeSection="shep"
      pageTitle="Subject Headings"
    >
      <SubjectHeadingsIndex {...props} />
    </SccContainer>
  );
};

SubjectHeadingsIndexPage.propTypes = {
  location: PropTypes.object,
};

export default SubjectHeadingsIndexPage;
