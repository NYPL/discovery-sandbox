import React from 'react'
import PropTypes from 'prop-types';
import SubjectHeadingShow from './SubjectHeadingShow';

const SubjectHeadingShowWrapper = (props) => {
  return (
    <SubjectHeadingShow {...props} key={props.params.subjectHeadingUuid}/>
  )
}

export default SubjectHeadingShowWrapper;
