import React, { useState } from 'react'
import PropTypes from 'prop-types';
import SubjectHeadingShow from './SubjectHeadingShow';
import SubjectHeadingsContainer from './SubjectHeadingsContainer';
import SubjectHeadingSearch from './Search/SubjectHeadingSearch';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';

const SubjectHeadingPageWrapper = (props) => {
  const {
    location: {
      query,
      query: {
        filter,
      },
    },
    params: {
      subjectHeadingUuid,
    }
  } = props;

  const containerKey = Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');

  const [label, setLabel] = useState('');

  return (
    <div>
      <div className="subjectHeadingsBanner">
        <div className="subjectHeadingBannerNav">
          <Breadcrumbs type="subjectHeading" headingDetails={!!subjectHeadingUuid}/>
          <SubjectHeadingSearch />
        </div>
        <div className="subjectHeadingsBannerInner">
          <h2>
            { subjectHeadingUuid
              ? label
              : ['Subject Headings ', filter ? <span key='bannerText'>containing <em>{filter}</em></span>: '']
            }
          </h2>
        </div>
      </div>
      {subjectHeadingUuid ?
        <SubjectHeadingShow
          {...props}
          key={subjectHeadingUuid}
          setBannerText={setLabel}
        />
        :
        <SubjectHeadingsContainer {...props} key={containerKey} />
      }
    </div>
  );
};

export default SubjectHeadingPageWrapper;
