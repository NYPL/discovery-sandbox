import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const SubjectHeadingTableHeader = () => {
  return (
      <div className="subjectHeadingRow tableHeadings">
        <span className="subjectHeadingToggle"></span>
        <span className="subjectHeadingLabelAndToggle">
          <span className="subjectHeadingLabel">Subject Heading</span>
        </span>
        <span className="subjectHeadingAttribute titles">Titles</span>
        <span className="subjectHeadingAttribute narrower">Narrower</span>
      </div>
  );
};

export default SubjectHeadingTableHeader
