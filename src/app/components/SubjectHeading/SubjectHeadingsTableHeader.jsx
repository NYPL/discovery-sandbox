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
          <div>
            {updateSort && <SortButton handler={updateSort} type="alphabetical" />}
            Heading
          </div>
        </th>
        <th className={`subjectHeadingAttribute narrower ${selected === 'descendants' ? 'selectedColumn' : ''}`}>
          <div>
            {updateSort && <SortButton handler={updateSort} type="descendants" />}
            Subheadings
          </div>
        </th>
        <th className={`subjectHeadingAttribute titles ${selected === 'bibs' ? 'selectedColumn' : ''}`}>
          <div>
            {updateSort && <SortButton handler={updateSort} type="bibs" />}
          </div>
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
