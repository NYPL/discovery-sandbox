/* globals document */
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import SubjectHeading from './SubjectHeading';
import AdditionalSubjectHeadingsButton from './AdditionalSubjectHeadingsButton';

const SubjectHeadingsList = props => (
  <ul>
    {
      props.subjectHeadings ?
        props.subjectHeadings
          .map(subjectHeading => (subjectHeading.button ?
            <AdditionalSubjectHeadingsButton data={subjectHeading} /> :
            <SubjectHeading subjectHeading={subjectHeading} />)
          ) :
        null
    }
  </ul>
);
export default SubjectHeadingsList;
