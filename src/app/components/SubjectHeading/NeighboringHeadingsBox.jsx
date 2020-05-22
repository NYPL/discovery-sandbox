import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import LocalLoadingLayer from './LocalLoadingLayer';
import SubjectHeadingsTable from './SubjectHeadingsTable';

class NeighboringHeadingsBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      contextHeadings,
      contextIsLoading,
      location,
      uuid,
      linkUrl,
      contextError,
    } = this.props;

    if (contextError) {
      return (<div>Error loading neighboring headings</div>);
    } else if (contextIsLoading) {
      return (<LocalLoadingLayer message="Loading More Subject Headings" />);
    }
    return (
      <SubjectHeadingsTable
        subjectHeadings={contextHeadings}
        location={location}
        showId={uuid}
        keyId="context"
        container="context"
        seeMoreText="More..."
        tableHeaderText="Neighboring Subject Headings"
        tfootContent={
          <tr>
            <td>
              <Link
                to={linkUrl}
                className="toIndex"
              >
                Explore more in Subject Heading index
              </Link>
            </td>
          </tr>
        }
      />
    );
  }
}

NeighboringHeadingsBox.propTypes = {
  location: PropTypes.object,
  uuid: PropTypes.string,
  linkUrl: PropTypes.string,
  contextHeadings: PropTypes.array,
  contextIsLoading: PropTypes.bool,
  contextError: PropTypes.bool,
};

export default NeighboringHeadingsBox;
