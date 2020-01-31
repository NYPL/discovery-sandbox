import React from 'react';
import PropTypes from 'prop-types';

const SubjectHeadingsTableHeader = () => (
    <thead>
      <tr>
        <th className="subjectHeadingsTableCell subjectHeadingLabel">
          <div className="subjectHeadingToggle"/>
          <div className="subjectHeadingLabelInner">Heading</div>
        </th>
        <th className="subjectHeadingsTableCell subjectHeadingAttribute titles">Title Count</th>
        <th className="subjectHeadingsTableCell subjectHeadingAttribute narrower">Subheading Count</th>
      </tr>
    </thead>
);

export default SubjectHeadingsTableHeader;
