/* globals document */
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeading from './SubjectHeading';
import AdditionalSubjectHeadingsButton from './AdditionalSubjectHeadingsButton';
import Range from '../../models/Range';
import appConfig from '../../../../appConfig';

class SubjectHeadingsTableBody extends React.Component {
  constructor(props) {
    super(props);
    const {
      subjectHeadings,
      container,
      location,
      parentUuid,
    } = props;
    this.state = {
      subjectHeadings: subjectHeadings,
      range: this.initialRange(props),
      interactive: !(container === 'context') || location.pathname.includes(parentUuid),
    };
    this.updateRange = this.updateRange.bind(this);
    this.listItemsInRange = this.listItemsInRange.bind(this);
    this.listItemsInInterval = this.listItemsInInterval.bind(this);
  }

  componentDidMount() {
    window.lists = window.lists || [];
    window.lists.push(this);
  }

  componentDidUpdate() {
    if (!this.state.subjectHeadings && this.props.subjectHeadings) {
      const newSubjectHeadings = this.props.subjectHeadings
      this.setState(
        { subjectHeadings: newSubjectHeadings,
          range: this.initialRange({ subjectHeadings: newSubjectHeadings }),
        }, () => {
          const { linked } = this.props;
          if (linked) {
            axios({
              method: 'GET',
              url: `${appConfig.shepApi}/subject_headings/${linked}/context?type=relatives`,
              crossDomain: true,
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
              },
            })
              .then(
                (res) => {
                  this.mergeSubjectHeadings(res.data.subject_headings, linked);
                },
              );
          }
        });
    }
  }

  mergeSubjectHeadings(subjectHeadings, linked) {
    const responseSubjectHeading = subjectHeadings[0];
    Range.addRangeData(responseSubjectHeading, linked);
    const existingSubjectHeadingIndex = this.state.subjectHeadings.findIndex(
      heading => heading.uuid === responseSubjectHeading.uuid,
    );
    this.state.subjectHeadings[existingSubjectHeadingIndex] = responseSubjectHeading;
    this.setState(prevState => prevState);
  }

  initialRange(props) {
    if (props.range) return props.range;
    if (props.subjectHeadings) return new Range(0, Infinity, [{ start: 0, end: Infinity }]);
    return null;
  }

  updateRange(rangeElement, intervalElement, endpoint, increment) {
    intervalElement[endpoint] += increment;
    rangeElement.normalize();
    this.setState(prevState => prevState);
  }

  listItemsInRange() {
    const {
      range,
      subjectHeadings,
    } = this.state;
    return range.intervals.reduce((acc, el) =>
      acc.concat(this.listItemsInInterval(el))
      , []);
  }

  listItemsInInterval(interval) {
    const { indentation } = this.props;
    const { subjectHeadings, range } = this.state;
    const { start, end } = interval;
    const subjectHeadingsInInterval = subjectHeadings.filter((el, i) => i >= start && i <= end);
    if (subjectHeadings[start - 1]) {
      subjectHeadingsInInterval.unshift({
        button: 'previous',
        indentation,
        updateParent: element => this.updateRange(range, interval, 'start', -10),
      });
    };
    if (end !== Infinity && subjectHeadings[end + 1]) {
      subjectHeadingsInInterval.push({
        button: 'next',
        indentation,
        updateParent: element => this.updateRange(range, interval, 'end', 10),
      });
    }
    return subjectHeadingsInInterval;
  }

  render() {
    const {
      indentation,
      nested,
      related,
      location,
      container,
      sortBy,
      topLevel,
    } = this.props;

    const {
      subjectHeadings,
      interactive,
    } = this.state;
    // className={nested ? 'subjectHeadingList nestedSubjectHeadingList' : 'subjectHeadingList'}

    return (
      <React.Fragment>
        {
          subjectHeadings ?
          this.listItemsInRange(subjectHeadings)
          .map((listItem, index) => (listItem.button ?
            // A listItem will either be a subject heading or a place holder for a button
            null
            // <AdditionalSubjectHeadingsButton
            //   indentation={listItem.indentation}
            //   button={listItem.button}
            //   updateParent={listItem.updateParent}
            //   key={listItem.uuid || index}
            //   nested={nested}
            //   indentation={indentation}
            //   interactive={interactive}
            // />
            : <SubjectHeading
              subjectHeading={listItem}
              key={listItem.uuid}
              nested={nested}
              indentation={indentation}
              location={location}
              container={container}
              sortBy={sortBy}
            />
          )) :
          null
        }
      </React.Fragment>
    );
  }
}

SubjectHeadingsTableBody.propTypes = {
  nested: PropTypes.string,
  subjectHeadings: PropTypes.array,
  indentation: PropTypes.number,
  linked: PropTypes.string,
  location: PropTypes.object,
  sortBy: PropTypes.string,
};

export default SubjectHeadingsTableBody;
