import React from 'react';
import PropTypes from 'prop-types';

import SubjectHeadingsTableHeader from './SubjectHeadingsTableHeader';
import SubjectHeadingsTableBody from './SubjectHeadingsTableBody';


const SubjectHeadingsTable = (props) => {
  const {
    subjectHeadings,
    linked,
    location,
    sortBy,
    showId,
    keyId,
    container,
    sortButton,
  } = props;

  // sort column occupies space on all index pages
    // this relies on a boolean prop `index` originating in `SubjectHeadingsContainer`
  // sort column heading is only shown if a sort button local to a sort button is shown
    // exception would be a subject heading with 1 child or no children
  const revealSortColum = true

  return (
    <table className="subjectHeadingsTable">
      <SubjectHeadingsTableHeader
        index={props.index}

      />
      <tbody>
        <SubjectHeadingsTableBody
          subjectHeadings={subjectHeadings}
          linked={linked}
          location={location}
          sortBy={sortBy}
          showId={showId}
          keyId={keyId}
          container={container}
        />
      </tbody>
    </table>
  );
};

SubjectHeadingsTable.propTypes = {
  subjectHeadings: PropTypes.array,
  linked: PropTypes.string,
  location: PropTypes.object,
  sortBy: PropTypes.string,
  showId: PropTypes.string,
  keyId: PropTypes.string,
  container: PropTypes.string,
  sortButton: PropTypes.element,
  index: PropTypes.bool,
};

SubjectHeadingsTable.defaultProps = {
  index: false,
};

export default SubjectHeadingsTable;
