import React from 'react';
import { Link } from 'react-router-dom';
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
          {sortButton}
        </tr>
      </thead>
  );
};

export default SubjectHeadingsTableHeader
