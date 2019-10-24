/* globals document */
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import SubjectHeading from './SubjectHeading';
import AdditionalSubjectHeadingsButton from './AdditionalSubjectHeadingsButton';

class SubjectHeadingsList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mainHeading: {
        uuid: '',
        label: ''
      }
    }
  }

  render() {
    const {
      indentation,
      subjectHeadings,
      nested,
      related
    } = this.props

    return (
      <ul className={nested ? 'subjectHeadingList nestedSubjectHeadingList' : 'subjectHeadingList'}>
      {
        subjectHeadings ?
        subjectHeadings
        .map(subjectHeading => (subjectHeading.button ?
          <AdditionalSubjectHeadingsButton
            data={subjectHeading}
            key={subjectHeading.uuid}
            nested={nested}
            indentation={indentation}
          />
          : <SubjectHeading
            subjectHeading={subjectHeading}
            key={subjectHeading.uuid}
            nested={nested}
            indentation={indentation}
          />
        ),) :
        null
      }
      </ul>
    )
  }
};

SubjectHeadingsList.propTypes = {
  nested: PropTypes.string,
  subjectHeadings: PropTypes.array,
};

export default SubjectHeadingsList;
