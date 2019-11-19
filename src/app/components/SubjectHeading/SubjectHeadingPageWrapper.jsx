import React from 'react'
import PropTypes from 'prop-types';
import SubjectHeadingShow from './SubjectHeadingShow';
import SubjectHeadingsContainer from './SubjectHeadingsContainer';
import SubjectHeadingSearch from './SubjectHeadingSearch';

const SubjectHeadingPageWrapper = (props) => {
  const containerKey = Object.keys(props.location.query)
    .map(key => `${key}=${props.location.query[key]}`)
    .join('&')

  const filter = props.location.query.filter;
  const index = !props.params.subjectHeadingUuid

  return (
    <div>
      <div className="subjectHeadingsBanner">
        Subject Heading{index ? 's ' : ':'}
        {filter ? <span>containing <em>{filter}</em></span> : ''}
        <SubjectHeadingSearch/>
      </div>
      {props.params.subjectHeadingUuid ?
        <SubjectHeadingShow {...props} key={props.params.subjectHeadingUuid}/>
        :
        <SubjectHeadingsContainer {...props} key={containerKey} />
      }
    </div>
  )
}

export default SubjectHeadingPageWrapper;
