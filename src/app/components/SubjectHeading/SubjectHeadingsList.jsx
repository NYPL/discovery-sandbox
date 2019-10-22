/* globals document */
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import SubjectHeading from './SubjectHeading';
import AdditionalSubjectHeadingsButton from './AdditionalSubjectHeadingsButton';

const SubjectHeadingsList = props => (
  <ul className={props.nested ? 'subjectHeadingList nestedSubjectHeadingList' : 'subjectHeadingList'}>
    {
      props.subjectHeadings ?
        props.subjectHeadings
          .map(subjectHeading => (subjectHeading.button ?
            <AdditionalSubjectHeadingsButton data={subjectHeading} key={subjectHeading.uuid} nested={props.nested} /> :
            <SubjectHeading subjectHeading={subjectHeading} key={subjectHeading.uuid} nested={props.nested} />),
          ) :
        null
    }
  </ul>
);

SubjectHeadingsList.propTypes = {
  nested: PropTypes.string,
  subjectHeadings: PropTypes.object,
};

export default SubjectHeadingsList;
