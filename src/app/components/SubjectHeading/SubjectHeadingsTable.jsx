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
    updateSort,
  } = props;

  return (
    <table className="subjectHeadingsTable">
      <SubjectHeadingsTableHeader updateSort={updateSort} selected={sortBy} />
      <tbody>
        <SubjectHeadingsTableBody
          subjectHeadings={subjectHeadings}
          linked={linked}
          location={location}
          sortBy={sortBy}
          showId={showId}
          keyId={keyId}
          container={container}
          top
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
  updateSort: PropTypes.func,
};

export default SubjectHeadingsTable;
