import React from 'react'
import PropTypes from 'prop-types';
import SubjectHeadingShow from './SubjectHeadingShow';
import SubjectHeadingsContainer from './SubjectHeadingsContainer';
import SubjectHeadingSearch from './SubjectHeadingSearch';
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

  const containerKey = Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&');
    const filter = props.location.query.filter;
    const index = !props.params.subjectHeadingUuid

  return (
    <div>
      <div className="subjectHeadingsBanner">
        { subjectHeading
          ? ['Subject Heading: ', React.createElement('em', null, subjectHeading)]
          : Subject Heading{index ? 's ' : ':'}
            {filter ? <span>containing <em>{filter}</em></span> : ''}
        }
        <SubjectHeadingSearch />
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
