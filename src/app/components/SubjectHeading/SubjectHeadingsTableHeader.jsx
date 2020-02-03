import React from 'react';
import PropTypes from 'prop-types';

import SortButton from './SortButton';

const SubjectHeadingsTableHeader = (props) => {
  const {
    updateSort,
    selected,
  } = props;

  return (
    <thead>
      <tr>
        <th className={`subjectHeadingsTableCell subjectHeadingLabel ${selected === 'alphabetical' ? 'selected' : ''}`}>
          <div className="subjectHeadingToggle" />
          <div className="subjectHeadingLabelInner">
            {<SortButton handler={updateSort} type="alphabetical" />}
            Heading
          </div>
        </th>
        <th className={`subjectHeadingsTableCell subjectHeadingAttribute titles ${selected === 'bibs' ? 'selected' : ''}`}>
          <div className="subjectHeadingAttributeInner">
            {<SortButton handler={updateSort} type="bibs" />}
          </div>
          Title Count
        </th>
        <th className={`subjectHeadingsTableCell subjectHeadingAttribute narrower ${selected === 'descendants' ? 'selected' : ''}`}>
          <div className="subjectHeadingAttributeInner">
            {<SortButton handler={updateSort} type="descendants" />}
            Subheading Count
          </div>
        </th>
      </tr>
    </thead>
  );
};

SubjectHeadingsTableHeader.propTypes = {
  updateSort: PropTypes.func,
  selected: PropTypes.String,
};

export default SubjectHeadingsTableHeader;
