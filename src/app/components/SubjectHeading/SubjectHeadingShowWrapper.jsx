import React from 'react';
import PropTypes from 'prop-types';
import SubjectHeadingShow from './SubjectHeadingShow';

const SubjectHeadingShowWrapper = (props) => {
  return (
    <SubjectHeadingShow {...props} key={props.params.subjectHeadingUuid} />
  );
};

SubjectHeadingShowWrapper.propTypes = {
  params: PropTypes.object,
};

export default SubjectHeadingShowWrapper;
