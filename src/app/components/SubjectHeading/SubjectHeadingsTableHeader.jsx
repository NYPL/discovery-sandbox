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
        <th className={`headingColumnHeader ${selected === 'alphabetical' ? 'selectedColumn' : ''}`}>
          {updateSort && <SortButton handler={updateSort} type="alphabetical" />}
          Heading
        </th>
        <th className={`subjectHeadingAttribute narrower ${selected === 'descendants' ? 'selectedColumn' : ''}`}>
          {updateSort && <SortButton handler={updateSort} type="descendants" />}
          Subheadings
        </th>
        <th className={`subjectHeadingAttribute titles ${selected === 'bibs' ? 'selectedColumn' : ''}`}>
          {updateSort && <SortButton handler={updateSort} type="bibs" />}
          Titles
        </th>
      </tr>
    </thead>
  );
};

SubjectHeadingsTableHeader.propTypes = {
  updateSort: PropTypes.func,
  selected: PropTypes.string,
};

export default SubjectHeadingsTableHeader;
