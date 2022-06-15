import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

import appConfig from '../../data/appConfig';

/**
 * React-router Link with href set to the appropriate subject_headings URL.
 */
const shepLink = (uuid, label, subjectComponent) => (
  <Link
    key={uuid}
    to={`${
      appConfig.baseUrl
    }/subject_headings/${uuid}?label=${encodeURIComponent(label)}`}
  >
    {subjectComponent}
  </Link>
);

/**
 * Recurvisely create a list of subject heading links.
 */
const constructSubjectHeading = (heading) => {
  const { uuid, parent, label } = heading;
  let subjectComponent;
  let subjectLink;

  if (label) {
    subjectComponent = label.split(' -- ').pop();
  }
  subjectLink = shepLink(uuid, label, subjectComponent);

  if (!parent) {
    return subjectLink;
  }

  return [
    constructSubjectHeading(parent),
    <span key={`${uuid}-span`}> &gt; </span>,
    subjectLink,
  ];
};

const generateHeadingLi = (heading) => (
  <li key={heading.uuid}>{constructSubjectHeading(heading)}</li>
);

/**
 * Returns the HTML description and definition elements for the
 * "Subject" term and its related list of links.
 */
const SubjectHeadings = ({ headings }) => {
  if (!headings || !headings.length > 0) return null;

  return (
    <>
      <dt>
        {headings.length > 1 ? 'Subjects' : 'Subject'}
      </dt>
      <dd>
        <ul>{headings.map(generateHeadingLi)}</ul>
      </dd>
    </>
  );
};

SubjectHeadings.propTypes = {
  headings: PropTypes.array,
};

export default SubjectHeadings;
