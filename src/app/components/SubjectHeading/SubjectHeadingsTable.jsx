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
    seeMoreText,
    seeMoreLinkUrl,
    tfootContent,
    direction,
    preOpen,
  } = props;

  return (
    <table className={`subjectHeadingsTable ${container}`}>
      <SubjectHeadingsTableHeader updateSort={updateSort} selected={sortBy} />
      <tbody data={`${seeMoreText}-${seeMoreLinkUrl}`}>
        <SubjectHeadingsTableBody
          subjectHeadings={subjectHeadings}
          linked={location.query.linked}
          location={location}
          sortBy={sortBy}
          showId={showId}
          keyId={keyId}
          container={container}
          seeMoreText={seeMoreText}
          seeMoreLinkUrl={seeMoreLinkUrl}
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
  seeMoreText: PropTypes.string,
  seeMoreLinkUrl: PropTypes.string,
};

export default SubjectHeadingsTable;
