import React from 'react';
import PropTypes from 'prop-types';

import SortButton from './SortButton';

const SubjectHeadingsTableHeader = (props) => {
  const {
    updateSort,
    selected,
    container,
    tableHeaderText,
  } = props;

  return (
    <thead>
      {
        ['related', 'context'].includes(container) ?
          <tr
            className="subjectHeadingRow"
          >
            <td className="subjectHeadingsTableCell" colSpan="4">
              <h4 className="sideBarContentHeading">
                {tableHeaderText}
              </h4>
            </td>
          </tr>
          : null
      }
      <tr className="subjectHeadingRow">
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
