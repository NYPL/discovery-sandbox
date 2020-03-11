import React from 'react';
import PropTypes from 'prop-types';

import SubjectHeadingsTableHeader from './SubjectHeadingsTableHeader';
import SubjectHeadingsTableBody from './SubjectHeadingsTableBody';


const SubjectHeadingsTable = (props) => {
  const {
    subjectHeadings,
    location,
    sortBy,
    showId,
    keyId,
    container,
    updateSort,
    tfootContent,
    direction,
    preOpen,
  } = props;

  return (
    <table className={`subjectHeadingsTable ${container}`}>
      <SubjectHeadingsTableHeader updateSort={updateSort} selected={sortBy} />
      <tbody>
        <SubjectHeadingsTableBody
          subjectHeadings={subjectHeadings}
          linked={location.query.linked}
          location={location}
          sortBy={sortBy}
          showId={showId}
          keyId={keyId}
          container={container}
          direction={direction}
          top
          preOpen={preOpen}
        />
      </tbody>
      { tfootContent ?
        <tfoot>
          {tfootContent}
        </tfoot>
        : null
      }
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
