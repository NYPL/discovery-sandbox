import React, {useContext} from 'react';
import PropTypes from 'prop-types';

import SortButton from './SortButton';
import TableContainerContext from './TableContainerContext';

const SubjectHeadingsTableHeader = (props) => {
  const {
    updateSort,
    selected,
  } = props;

  return (
    <thead>
      <tr>
        <th className={`headingColumnHeader ${selected === 'alphabetical' ? 'selectedColumn' : ''}`}>
          <SortButton handler={updateSort} type="alphabetical" />
        </th>
        <th className={`subjectHeadingAttribute narrower ${selected === 'descendants' ? 'selectedColumn' : ''}`}>
          <SortButton handler={updateSort} type="descendants" />
        </th>
        <th className={`subjectHeadingAttribute titles ${selected === 'bibs' ? 'selectedColumn' : ''}`}>
          <SortButton handler={updateSort} type="bibs" />
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
