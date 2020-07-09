import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ShepContainer from '../components/ShepContainer/ShepContainer';
import SubjectHeadingShow from '../components/SubjectHeading/SubjectHeadingShow';
import SubjectHeadingSearch from '../components/SubjectHeading/Search/SubjectHeadingSearch';
import { basicQuery } from '../utils/utils';

const SubjectHeadingShowPage = (props) => {
  const {
    params: {
      subjectHeadingUuid,
    },
  } = props;

  let [label, setLabel] = useState('');
  label = label || decodeURIComponent(props.location.query.label) || '';
  const breadcrumbUrls = {};
  const searchUrl = basicQuery(props)({});
  if (searchUrl) breadcrumbUrls.searchUrl = searchUrl;
  if (props.bib.uri) breadcrumbUrls.bibUrl = `/bib/${props.bib.uri}`;

  return (
    <ShepContainer
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
      breadcrumbProps={{
        type: 'subjectHeading',
        urls: breadcrumbUrls,
      }}
    />
  );
};

SubjectHeadingShowPage.propTypes = {
  params: PropTypes.object,
  bib: PropTypes.object,
};

SubjectHeadingShowPage.defaultProps = {
  bib: {},
};

SubjectHeadingShowPage.contextTypes = {
  router: PropTypes.object,
};

export default SubjectHeadingShowPage;
