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
          <span className="emph"><span className="noEmph">Heading</span></span>
          { updateSort
            ? <SortButton handler={updateSort} type="alphabetical" direction={calculateDirection('alphabetical')} />
            : null
          }
        </div>
      </th>
      <th className={`subjectHeadingsTableCell subjectHeadingAttribute narrower ${sortBy === 'descendants' ? 'selected' : ''}`}>
        <span className="emph"><span className="noEmph">Subheadings</span></span>
        { updateSort
          ? <SortButton handler={updateSort} type="descendants" direction={calculateDirection('descendants')} />
          : null
        }
      </th>
      <th className={`subjectHeadingsTableCell subjectHeadingAttribute titles ${sortBy === 'bibs' ? 'selected' : ''}`}>
        <span className="emph"><span className="noEmph">Titles</span></span>
        { updateSort
          ? <SortButton handler={updateSort} type="bibs" direction={calculateDirection('bibs')} />
          : null
        }
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
