import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import appConfig from '../../../../appConfig';

const constructSubjectHeading = (heading, i) => {
  const { uuid, parent, label } = heading
  let subjectComponent
  if (label) subjectComponent = label.split(" -- ").pop()
  if (!parent) return (
    <Link
      key={`${uuid} ${i}`}
      to={`${appConfig.baseUrl}/subject_headings/${uuid}`}
    >
      {subjectComponent}
    </Link>
  );

  return([
    constructSubjectHeading(parent),
    <span key={i}> > </span>,
    <Link
      key={`${uuid} ${i}`}
      to={`${appConfig.baseUrl}/subject_headings/${uuid}`}
    >
      {subjectComponent}
    </Link>
  ])
}

const generateHeadingLi = (heading) => {
  return <li key={heading.uuid}>{constructSubjectHeading(heading)}</li>
}

const SubjectHeadings = (props) => {
  const { headings, i } = props

  if (!headings) return null;

  return (
    <div>
      <dt key={`term-${i}`}>{headings.length > 1 ? 'Subjects' : 'Subject'}</dt>
      <dd data={`definition-${i}`} key={`definition-${i}`}>
        <ul>
          {headings.map(generateHeadingLi)}
        </ul>
      </dd>
    </div>
  )
}

export default SubjectHeadings;
