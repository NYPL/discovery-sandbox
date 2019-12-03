import React from 'react'
import PropTypes from 'prop-types';
import SubjectHeadingShow from './SubjectHeadingShow';
import SubjectHeadingsContainer from './SubjectHeadingsContainer';
import SubjectHeadingSearch from './Search/SubjectHeadingSearch';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
// import Store from '../../stores/Store';

const SubjectHeadingPageWrapper = (props) => {
  const {
    location: {
      query,
      query: {
        filter,
      },
    },
    subjectHeading,
    params: {
      subjectHeadingUuid,
    }
  } = props;

  // console.log('uuid', props.params.subjectHeadingUuid);
  const containerKey = Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');

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
              ? subjectHeading
              : ['Subject Headings ', filter ? <span>containing <em>{filter}</em></span>: '']
            }
          </h2>
        </div>
      </div>
      {subjectHeadingUuid ?
        <SubjectHeadingShow {...props} key={subjectHeadingUuid} />
        :
        <SubjectHeadingsContainer {...props} key={containerKey} />
      }
    </div>
  );
};

export default SubjectHeadingPageWrapper;
