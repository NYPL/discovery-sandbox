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

  return (
    <div>
      <div className="subjectHeadingsBanner">
        {`Subject Headings${filter ? ` containing '${filter}'` : ''}`}
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
