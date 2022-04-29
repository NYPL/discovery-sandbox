import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import appConfig from '../../data/appConfig';

const SubjectHeadings = ({ headings, idx }) => {
  if (!headings) return null;

  return (
    <>
      <dt key={`term-${idx}`}>
        {headings.length > 1 ? 'Subjects' : 'Subject'}
      </dt>
      <dd data={`definition-${idx}`} key={`definition-${idx}`}>
        <ul>
          {headings.map((heading, idx) => {
            return (
              <li key={heading.uuid}>
                {constructSubjectHeading(heading, idx)}
              </li>
            );
          })}
        </ul>
      </dd>
    </>
  );
};

SubjectHeadings.propTypes = {
  headings: PropTypes.array,
  idx: PropTypes.number,
};

SubjectHeadings.defaultProps = {
  idx: 0,
};

export default SubjectHeadings;

function constructSubjectHeading({ uuid, parent, label }, idx) {
  let subjectComponent;

  if (label) subjectComponent = label.split(' -- ').pop();

  return [
    // If Parent is undefined, undefined is set in index position
    parent && constructSubjectHeading(parent),
    parent && <span key={`${uuid} ${idx}`}> {'>'} </span>,
    <Link
      key={uuid}
      to={`${
        appConfig.baseUrl
      }/subject_headings/${uuid}?label=${encodeURIComponent(label)}`}
    >
      {subjectComponent}
    </Link>,
  ].filter(Boolean); // Remove all undefineds
}
