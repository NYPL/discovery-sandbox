import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const SubjectHeadingsTableHeader = (props) => {
  const {
    sortButton
  } = props;
  return (
      <thead>
        <tr>
          <th className="subjectHeadingsTableCell subjectHeadingLabel">
            <div className="subjectHeadingToggle"></div>
            <div className="subjectHeadingLabelInner">Subject Heading</div>
          </th>
          <th className="subjectHeadingsTableCell subjectHeadingAttribute titles">Titles</th>
          <th className="subjectHeadingsTableCell subjectHeadingAttribute narrower">Narrower</th>
          <th className="subjectHeadingsTableCell subjectHeadingAttribute">Sort</th>
        </tr>
      </thead>
  );
};

export default SubjectHeadingsTableHeader
