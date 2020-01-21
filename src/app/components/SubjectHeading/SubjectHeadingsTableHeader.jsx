import React from 'react';

const SubjectHeadingsTableHeader = () => (
  <thead>
    <tr>
      <th className="subjectHeadingsTableCell subjectHeadingLabel">
        <div className="subjectHeadingToggle" />
        <div className="subjectHeadingLabelInner">Subject Heading</div>
      </th>
      <th className="subjectHeadingsTableCell subjectHeadingAttribute titles">Titles</th>
      <th className="subjectHeadingsTableCell subjectHeadingAttribute narrower">Narrower</th>
      <th className="subjectHeadingsTableCell sort">Sort</th>
    </tr>
  </thead>
);

export default SubjectHeadingsTableHeader;
