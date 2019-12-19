/* globals document */
import React from 'react';
import SubjectHeadingsTableBody from './SubjectHeadingsTableBody';


export default (props) => {
  const {
    subjectHeadings,
    linked,
    location,
    sortBy
  } = props;

  return (
    <div className="subjectHeadingsTable">
      <SubjectHeadingsTableBody
        subjectHeadings={subjectHeadings}
        linked={linked}
        location={location}
        sortBy={sortBy}
      />
    </div>
  );
};
