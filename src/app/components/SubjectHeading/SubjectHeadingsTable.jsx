import React from 'react';
import PropTypes from 'prop-types';

import SubjectHeadingsTableHeader from './SubjectHeadingsTableHeader';
import SubjectHeadingsTableBody from './SubjectHeadingsTableBody';

class SubjectHeadingsTable extends React.Component {
  getChildContext() {
    const { container } = this.props;
    return { container };
  }

  render() {
    const {
      subjectHeadings,
      location,
      sortBy,
      showId,
      keyId,
      updateSort,
      seeMoreText,
      seeMoreLinkUrl,
      container,
      tfootContent,
      direction,
      preOpen,
    } = this.props;

    return (
      <table className={
        `subjectHeadingsTable
        ${container}
        ${['context', 'related'].includes(container) ? ' nypl-column-half subjectHeadingInfoBox' : ''}`}
      >
        <SubjectHeadingsTableHeader
          updateSort={updateSort}
          selected={sortBy}
          container={container}
          tableHeaderText={this.props.tableHeaderText}
        />
        <tbody data={`${seeMoreText}-${seeMoreLinkUrl}`}>
          <SubjectHeadingsTableBody
            subjectHeadings={subjectHeadings}
            linked={location.query.linked}
            location={location}
            sortBy={sortBy}
            showId={showId}
            keyId={keyId}
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
  }
}

SubjectHeadingsTable.propTypes = {
  subjectHeadings: PropTypes.array,
  location: PropTypes.object,
  sortBy: PropTypes.string,
  showId: PropTypes.string,
  keyId: PropTypes.string,
  container: PropTypes.string,
  updateSort: PropTypes.func,
  seeMoreText: PropTypes.string,
  seeMoreLinkUrl: PropTypes.string,
};

SubjectHeadingsTable.childContextTypes = {
  container: PropTypes.string,
};

export default SubjectHeadingsTable;
