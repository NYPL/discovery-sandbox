import React from 'react';
import PropTypes from 'prop-types';
import calculateDirection from '@calculateDirection';

import SortButton from './SortButton';

const NestedTableHeader = (props) => {
  const {
    indentation,
    sortBy,
    direction,
    parentUuid,
    updateSort,
    numberOpen,
    interactive
  } = props;

  const positionStyle = { marginLeft: 30 * ((indentation || 0) + 1) };
  const calculateDirectionForType = calculateDirection(sortBy, direction);

  return (
    <tr
      className="nestedTableHeader"
    >
      <th className={`subjectHeadingsTableCell subjectHeadingLabel ${sortBy === 'alphabetical' ? 'selected' : ''}`} >
        <div className="subjectHeadingLabelInner" style={positionStyle}>
          <SortButton
            handler={updateSort}
            type="alphabetical"
            direction={calculateDirectionForType('alphabetical')}
            interactive={interactive}
            numberOpen={numberOpen}
          />
        </div>
      </th>
      <th className={`subjectHeadingsTableCell subjectHeadingAttribute narrower ${sortBy === 'descendants' ? 'selected' : ''}`}>
        <SortButton
          handler={updateSort}
          type="descendants"
          direction={calculateDirectionForType('descendants')}
          interactive={interactive}
          numberOpen={numberOpen}
        />
      </th>
      <th className={`subjectHeadingsTableCell subjectHeadingAttribute titles ${sortBy === 'bibs' ? 'selected' : ''}`}>
        <SortButton
          handler={updateSort}
          type="bibs"
          direction={calculateDirectionForType('bibs')}
          interactive={interactive}
          numberOpen={numberOpen}
        />
      </th>
    </tr>
  );
};

NestedTableHeader.propTypes = {
  indentation: PropTypes.number,
  sortBy: PropTypes.string,
  direction: PropTypes.string,
  parentUuid: PropTypes.string,
  updateSort: PropTypes.func,
  interactive: PropTypes.bool,
};

export default NestedTableHeader;
