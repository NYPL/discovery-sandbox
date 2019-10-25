/* globals document */
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeading from './SubjectHeading';
import AdditionalSubjectHeadingsButton from './AdditionalSubjectHeadingsButton';
import Range from '../../models/Range';
import appConfig from '../../../../appConfig';

class SubjectHeadingsList extends React.Component {
  constructor(props) {
    console.log('subjectheadingslist constructor')
    super(props);
    this.state = {
      subjectHeadings: props.subjectHeadings,
      range: props.subjectHeadings ?
        this.initialRange(props.subjectHeadings)
        : null,
    };
    this.updateRange = this.updateRange.bind(this);
    this.inRangeHeadings = this.inRangeHeadings.bind(this);
    this.inIntervalHeadings = this.inIntervalHeadings.bind(this);
  }

  componentDidUpdate() {
    if (!this.state.subjectHeadings) {
      const newSubjectHeadings = this.props.subjectHeadings
      this.setState({ subjectHeadings: newSubjectHeadings, range: this.initialRange(newSubjectHeadings) }, () => {
        const { linked } = this.props;
        if (linked) {
          axios({
            method: 'GET',
            url: `${appConfig.shepApi}/subject_headings/${linked}/context`,
            crossDomain: true,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Content-Type': 'application/json',
            },
          })
            .then(
              (res) => {
                this.mergeSubjectHeadings(res.data.subject_headings);
              },
            );
        }
      });
    }
  }

  mergeSubjectHeadings(subjectHeadings) {
    // console.log('merge subjectHeadings: ', subjectHeadings);
    // console.log('state subjectheadings: ', this.state.subjectHeadings);
    subjectHeadings.forEach((subjectHeading) => {
      const matchingHeading = this.state.subjectHeadings.find(
        heading => heading.uuid === subjectHeading.uuid,
      );
      Object.assign(matchingHeading, subjectHeading);
    });
    const newSubjectHeadings = JSON.parse(JSON.stringify(this.state.subjectHeadings));
    this.setState({
      subjectHeadings: newSubjectHeadings,
      range: this.initialRange(newSubjectHeadings)
    }, () => { console.log('after: ', this.state.subjectHeadings); });
    // this.setState({ subjectHeadings: [] });
  }

  initialRange() {
    return new Range(0, 'infinity', [{ start: 0, end: 'infinity' }]);
  }

  updateRange(rangeElement, intervalElement, endpoint, increment) {
    intervalElement[endpoint] += increment;
    rangeElement.normalize();
    this.setState({ range: rangeElement });
  }

  inRangeHeadings() {
    const {
      range,
      subjectHeadings,
    } = this.state;
    return range.intervals.reduce((acc, el) =>
      acc.concat(this.inIntervalHeadings(el))
      , []);
  }

  inIntervalHeadings(interval) {
    const { indentation } = this.props;
    const { subjectHeadings, range } = this.state;
    const { start, end } = interval;
    const subjectHeadingsInInterval = subjectHeadings.filter((el, i) => i >= start && (end === 'infinity' || i <= end));
    if (subjectHeadings[start - 1]) {
      subjectHeadingsInInterval.unshift({
        button: 'more',
        indentation,
        updateParent: element => this.updateRange(range, interval, 'start', -10),
      });
    };
    if (end !== 'infinity' && subjectHeadings[end + 1]) {
      subjectHeadingsInInterval.push({
        button: 'more',
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
    } = this.props;

    const {
      subjectHeadings,
    } = this.state;

    // console.log('render: ', subjectHeadings)

    return (
      <ul className={nested ? 'subjectHeadingList nestedSubjectHeadingList' : 'subjectHeadingList'}>
        {
          subjectHeadings ?
          this.inRangeHeadings(subjectHeadings)
          .map(subjectHeading => (subjectHeading.button ?
            <AdditionalSubjectHeadingsButton
              indentation={subjectHeading.indentation}
              updateParent={subjectHeading.updateParent}
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
          )) :
          null
        }
      </ul>
    );
  }
}

SubjectHeadingsList.propTypes = {
  nested: PropTypes.string,
  subjectHeadings: PropTypes.array,
  indentation: PropTypes.number,
  linked: PropTypes.string,
};

export default SubjectHeadingsList;
