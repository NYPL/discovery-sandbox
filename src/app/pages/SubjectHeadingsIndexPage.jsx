import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { Heading } from '@nypl/design-system-react-components';

import SccContainer from '../components/SccContainer/SccContainer';
import SubjectHeadingsIndex from '../components/SubjectHeading/SubjectHeadingsIndex';
import SubjectHeadingSearch from '../components/SubjectHeading/Search/SubjectHeadingSearch';
import { basicQuery } from '../utils/utils';

const SubjectHeadingsIndexPage = (props) => {
  const {
    location: {
      search,
      query: { filter },
    },
  } = props;

  const componentKey = `subjectHeadingIndex${search}`;
  const breadcrumbUrls = {};
  const searchUrl = basicQuery(props)({});
  if (searchUrl) breadcrumbUrls.searchUrl = searchUrl;
  if (props.bib && props.bib.uri)
    breadcrumbUrls.bibUrl = `/bib/${props.bib.uri}`;

  const bannerInnerHtml = filter ? (
    <span key='bannerText'>
      Subject Headings containing <em>{filter}</em>
    </span>
  ) : (
    <span key='bannerText'>Subject Headings</span>
  );

  const [contentPrimaryStyle, setContentPrimaryStyle] = useState({});

  return (
    <SccContainer
      key={componentKey}
      useLoadingLayer={false}
      activeSection='shep'
      pageTitle='Subject Headings'
      className='subject-heading-page'
      contentPrimaryStyle={contentPrimaryStyle}
      primaryId='subject-heading-content-primary'
    >
      <div className='subject-heading-page-header'>
        <Heading level={2} className='page-title'>
          {filter
            ? `Subject Headings matching "${filter}"`
            : 'Subject Heading Index'}
        </Heading>
        <SubjectHeadingSearch setContentPrimaryStyle={setContentPrimaryStyle} />
      </div>
      <SubjectHeadingsIndex {...props} />
    </SccContainer>
  );
};

SubjectHeadingsIndexPage.propTypes = {
  location: PropTypes.object,
};

export default SubjectHeadingsIndexPage;
