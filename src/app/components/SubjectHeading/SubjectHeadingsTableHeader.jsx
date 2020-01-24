import React from 'react';
import PropTypes from 'prop-types';

const SubjectHeadingsTableHeader = ({index, revealSortColumn}) => {
  return (
      <thead>
        <tr>
          <th className="subjectHeadingsTableCell subjectHeadingLabel">
            <div className="subjectHeadingToggle"></div>
            <div className="subjectHeadingLabelInner">Heading</div>
          </th>
          <th className="subjectHeadingsTableCell subjectHeadingAttribute titles">Title Count</th>
          <th className="subjectHeadingsTableCell subjectHeadingAttribute narrower">Subheading Count</th>
          {(index) ? <th className="subjectHeadingsTableCell sort">
            {revealSortColumn ? "Sort By:" : ""}
          </th>
          : null
          }
        </tr>
      </thead>
  );
};

SubjectHeadingsTableHeader.propTypes = {
  index: PropTypes.bool,
  revealSortColumn: PropTypes.bool,
};

SubjectHeadingsTableHeader.defaultProps = {
  // safer to not have an extra column or column heading
  index: false,
  revealSortColumn: false,
};

export default SubjectHeadingsTableHeader;
