import React from 'react'
import PropTypes from 'prop-types';
import SubjectHeadingShow from './SubjectHeadingShow';
import SubjectHeadingsContainer from './SubjectHeadingsContainer';
import SubjectHeadingSearch from './SubjectHeadingSearch';

const SubjectHeadingPageWrapper = (props) => {
  // let containerKey = props.location.query.filter || props.location.query.fromLabel || ""
  // if (props.location.query.sortBy) containerKey += `&sortBy${props.location.query.sortBy}`
  const containerKey = Object.entries(props.location.query)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  console.log('container key ', containerKey)
  return (
    <div>
      <div className="subjectHeadingsBanner">
        Subject Headings
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
