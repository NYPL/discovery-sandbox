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
    <tbody>
      {props.subjectHeadings.map((heading, i) => <SubjectHeading subjectHeading={heading} subjectHeadings={props.subjectHeadings} />)}
    </tbody>
  </table>
);

export default SubjectHeadingsTable
