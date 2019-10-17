/* globals document */
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import SubjectHeading from './SubjectHeading';
import SubjectHeadingMoreButton from './SubjectHeadingMoreButton';

class SubjectHeadingsTable extends React.Component {
  constructor(props) {
    super(props);
    this.flatten = this.flatten.bind(this);
  }

  flatten(forest, inset = 0) {
    if (forest.constructor === [].constructor) {
      return forest.reduce((acc, el) => acc.concat(this.flatten(el, inset)), []);
    }
    forest.inset = inset;
    let flattened = [forest];
    if (forest.open && forest.narrower) {
      flattened = flattened.concat(this.flatten(forest.narrower, inset + 1));
    }
    if (forest.more) {
      flattened = flattened.concat([{ more: forest.more, parent: forest, inset: inset, isButton: true }]);
    }
    return flattened;
  }

  render() {
    const {
      subjectHeadings,
    } = this.props;
    return (
      <table>
        <thead>
          <tr>
            <th />
            <th>Subject Heading</th>
            <th>Titles</th>
            <th>Narrower</th>
          </tr>
        </thead>
        <tbody>
          {this.flatten(subjectHeadings).map(
            (heading, i) =>
              (heading.isButton
                ? <SubjectHeadingMoreButton more={heading.more} parent={heading.parent} inset={heading.inset} subjectHeadings={subjectHeadings} />
                : <SubjectHeading subjectHeading={heading} subjectHeadings={subjectHeadings} />
              ),
            )
          }
        </tbody>
      </table>
    );
  }
}

export default SubjectHeadingsTable;
