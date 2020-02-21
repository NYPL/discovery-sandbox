import React from 'react';
import PropTypes from 'prop-types';

import SortButton from './SortButton';

const NestedTableColumnHeading = (props) => {
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
  }

  const positionStyle = container === 'narrower' ? null : { marginLeft: 30 * ((indentation || 0) + 1) };

  return (
    <tr
      data={`${subjectHeading.uuid}, ${container}`}
      className={`
        subjectHeadingRow
        selectedColumnStyle
        ${(indentation || 0) === 0 ? 'topLevel' : ''}
        ${(indentation || 0) !== 0 ? 'nestedSubjectHeading' : ''}
        `}
    >
      <td className={`subjectHeadingsTableCell subjectHeadingLabel ${sortBy === 'alphabetical' ? 'selected' : ''}`} >
        <div className="subjectHeadingLabelInner" style={positionStyle}>
          { updateSort
            ? <SortButton handler={updateSort} type="alphabetical" direction={calculateDirection('alphabetical')} />
            : null
          }
          <span className="emph"><span className="noEmph">Heading</span></span>
        </div>
      </td>
      <td className={`subjectHeadingsTableCell subjectHeadingAttribute titles ${sortBy === 'bibs' ? 'selected' : ''}`}>
        <div className="subjectHeadingAttributeInner">
          { updateSort
            ? <SortButton handler={updateSort} type="bibs" direction={calculateDirection('bibs')} />
            : null
          }
        Title Count
        </div>
      </td>
      <td className={`subjectHeadingsTableCell subjectHeadingAttribute narrower ${sortBy === 'descendants' ? 'selected' : ''}`}>
        <div className="subjectHeadingAttributeInner">
          { updateSort
            ? <SortButton handler={updateSort} type="descendants" direction={calculateDirection('descendants')} />
            : null
          }
      Subheading Count
        </div>
      </td>
    </tr>
  );
};

NestedTableColumnHeading.propTypes = {
  subjectHeading: PropTypes.object,
  indentation: PropTypes.number,
  sortBy: PropTypes.string,
  container: PropTypes.string,
};

export default NestedTableColumnHeading;
