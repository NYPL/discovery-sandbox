/* globals document */
import React from 'react';
import SubjectHeadingsTableHeader from './SubjectHeadingsTableHeader';
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
      <SubjectHeadingsTableHeader />
      <SubjectHeadingsTableBody
        subjectHeadings={subjectHeadings}
        linked={linked}
        location={location}
        sortBy={sortBy}
      />
    </div>
  );
};
