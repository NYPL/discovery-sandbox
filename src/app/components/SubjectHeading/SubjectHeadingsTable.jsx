/* globals document */
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import SubjectHeading from './SubjectHeading';

const SubjectHeadingsTable = props => (
  <table>
    <thead>
      <tr>
        <th></th>
        <th>Subject Heading</th>
        <th>Titles</th>
        <th>Narrower</th>
      </tr>
    </thead>
    {props.subjectHeadings.map((heading, i) => <SubjectHeading subjectHeading={heading}/>)}
  </table>
);

export default SubjectHeadingsTable
