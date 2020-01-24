import React from 'react';

const SubjectHeadingsTableHeader = () => {
  return (
      <thead>
        <tr>
          <th className="subjectHeadingsTableCell subjectHeadingLabel">
            <div className="subjectHeadingToggle"></div>
            <div className="subjectHeadingLabelInner">Heading</div>
          </th>
          <th className="subjectHeadingsTableCell subjectHeadingAttribute titles">Title Count</th>
          <th className="subjectHeadingsTableCell subjectHeadingAttribute narrower">Subheading Count</th>
          {
              // <th className="subjectHeadingsTableCell sort">Sort</th>
          }
        </tr>
      </thead>
  );
};

export default SubjectHeadingsTableHeader;
