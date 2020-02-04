import React from 'react';
import PropTypes from 'prop-types';

import SortButton from './SortButton';

const NestedTableColumnHeading = (props) => {
  const {
    subjectHeading,
    indentation,
    container,
    sortBy,
  } = props;

  const {
    updateSort,
  } = subjectHeading;

  const positionStyle = container === 'narrower' ? null : { marginLeft: 30 * ((indentation || 0) + 1) };

  return (
    <tr
      data={`${subjectHeading.uuid}, ${container}`}
      className={`
        subjectHeadingRow
        ${(indentation || 0) === 0 ? 'topLevel' : ''}
        ${(indentation || 0) !== 0 ? 'nestedSubjectHeading' : ''}
        headingStyle
        `}
    >
      <td className={`subjectHeadingsTableCell subjectHeadingLabel ${sortBy === 'alphabetical' ? 'selected' : ''}`} >
        <div className="subjectHeadingLabelInner" style={positionStyle}>
          { updateSort
            ? <SortButton handler={updateSort} type="alphabetical" selected={sortBy} />
            : null
          }
          <span className="emph"><span className="noEmph">Heading</span></span>
        </div>
      </td>
      <td className={`subjectHeadingsTableCell subjectHeadingAttribute titles ${sortBy === 'bibs' ? 'selected' : ''}`}>
        <div className="subjectHeadingAttributeInner">
          { updateSort
            ? <SortButton handler={updateSort} type="bibs" />
            : null
          }
        Title Count
        </div>
      </td>
      <td className={`subjectHeadingsTableCell subjectHeadingAttribute narrower ${sortBy === 'descendants' ? 'selected' : ''}`}>
        <div className="subjectHeadingAttributeInner">
          { updateSort
            ? <SortButton handler={updateSort} type="descendants" />
            : null
          }
      Subheading Count
        </div>
      </td>
    </tr>
  );
};

NestedTableColumnHeading.PropTypes = {
  subjectHeadings: PropTypes.array,
  indentation: PropTypes.number,
  sortBy: PropTypes.string,
  container: PropTypes.string,
};

export default NestedTableColumnHeading;
