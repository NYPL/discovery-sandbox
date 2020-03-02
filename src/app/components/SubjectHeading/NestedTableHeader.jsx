import React from 'react';
import PropTypes from 'prop-types';

import SortButton from './SortButton';

const NestedTableHeader = (props) => {
  const {
    subjectHeading,
    indentation,
    container,
    sortBy,
    direction,
  } = props;

  const {
    updateSort,
  } = subjectHeading;

  const calculateDirection = (sortType) => {
    if (sortType === sortBy) return (direction === 'ASC' ? 'DESC' : 'ASC');
    return {
      alphabetical: 'ASC',
      bibs: 'DESC',
      descendants: 'DESC',
    }[sortType];
  };

  const positionStyle = container === 'narrower' ? null : { marginLeft: 30 * ((indentation || 0) + 1) };

  return (
    <tr
      data={`${subjectHeading.uuid}, ${container}`}
      style={{ backgroundColor: props.backgroundColor }}
      className="nestedTableHeader"
    >
      <th className={`subjectHeadingsTableCell subjectHeadingLabel ${sortBy === 'alphabetical' ? 'selected' : ''}`} >
        <div className="subjectHeadingLabelInner" style={positionStyle}>
          <SortButton
            handler={updateSort}
            type="alphabetical"
            direction={calculateDirection('alphabetical')}
          />
        </div>
      </th>
      <th className={`subjectHeadingsTableCell subjectHeadingAttribute narrower ${sortBy === 'descendants' ? 'selected' : ''}`}>
        <SortButton
          handler={updateSort}
          type="descendants"
          direction={calculateDirection('descendants')}
        />
      </th>
      <th className={`subjectHeadingsTableCell subjectHeadingAttribute titles ${sortBy === 'bibs' ? 'selected' : ''}`}>
        <SortButton
          handler={updateSort}
          type="bibs"
          direction={calculateDirection('bibs')}
        />
      </th>
    </tr>
  );
};

NestedTableHeader.propTypes = {
  subjectHeading: PropTypes.object,
  indentation: PropTypes.number,
  sortBy: PropTypes.string,
  container: PropTypes.string,
  direction: PropTypes.string,
  backgroundColor: PropTypes.string,
};

export default NestedTableHeader;
