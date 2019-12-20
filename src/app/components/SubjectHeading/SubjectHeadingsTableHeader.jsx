import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const SubjectHeadingsTableHeader = () => {
  return (
      <div className="subjectHeadingRow tableHeadings">
        <span className="subjectHeadingsTableCell subjectHeadingLabel">
          <span className="subjectHeadingToggle"></span>
          <span className="subjectHeadingLabelInner">Subject Heading</span>
        </span>
        <span className="subjectHeadingsTableCell subjectHeadingAttribute titles">Titles</span>
        <span className="subjectHeadingsTableCell subjectHeadingAttribute narrower">Narrower</span>
      </div>
  );
};

export default SubjectHeadingsTableHeader
