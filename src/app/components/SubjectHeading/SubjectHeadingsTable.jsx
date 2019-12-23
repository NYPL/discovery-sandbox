/* globals document */
import React from 'react';
import SubjectHeadingsTableHeader from './SubjectHeadingsTableHeader';
import SubjectHeadingsTableBody from './SubjectHeadingsTableBody';


export default (props) => {
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

  return (
    <div className="subjectHeadingsTable">
      <SubjectHeadingsTableHeader sortButton={sortButton}/>
      <SubjectHeadingsTableBody
        subjectHeadings={subjectHeadings}
        linked={linked}
        location={location}
        sortBy={sortBy}
        showId={showId}
        keyId={keyId}
        container={container}
      />
    </div>
  );
};
