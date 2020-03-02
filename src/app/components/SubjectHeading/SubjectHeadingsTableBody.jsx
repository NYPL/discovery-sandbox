import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import SubjectHeading from './SubjectHeading';
import AdditionalSubjectHeadingsButton from './AdditionalSubjectHeadingsButton';
import NestedTableHeader from './NestedTableHeader';
import Range from '../../models/Range';
import appConfig from '../../data/appConfig';

class SubjectHeadingsTableBody extends React.Component {
  constructor(props) {
    super(props);
    const {
      subjectHeadings,
      container,
      parentUuid,
      pathname,
    } = props;
    this.state = {
      subjectHeadings,
      range: this.initialRange(props),
      interactive: !(container === 'context') || (pathname && pathname.includes(parentUuid)),
    };
    this.updateRange = this.updateRange.bind(this);
    this.listItemsInRange = this.listItemsInRange.bind(this);
    this.listItemsInInterval = this.listItemsInInterval.bind(this);
    this.subHeadingHeadings = this.subHeadingHeadings.bind(this);
    this.tableRow = this.tableRow.bind(this);
    this.backgroundColor = this.backgroundColor.bind(this);
  }

  componentDidMount() {
    const { linked } = this.props

    if (linked) {
      const url = `${appConfig.baseUrl}/api/subjectHeadings/subject_headings/${linked}/context?type=relatives`;
      axios(url)
        .then(
          (res) => {
            this.mergeSubjectHeadings(res.data.subject_headings, linked);
          },
        );
    };
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

  subHeadingHeadings() {
    if (this.props.top) return [];
    return [
      {
        nestedTableHeader: true,
        indentation: this.props.indentation,
        updateSort: this.props.updateSort,
      },
    ];
  }

  listItemsInRange() {
    const {
      range,
    } = this.state;
    
    return this.subHeadingHeadings().concat(range.intervals.reduce((acc, el) =>
      acc.concat(this.listItemsInInterval(el))
      , []));
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
        updateParent: () => this.updateRange(range, interval, 'start', -10),
      });
    }
    if (end !== Infinity && subjectHeadings[end + 1]) {
      subjectHeadingsInInterval.push({
        button: 'next',
        indentation,
        updateParent: () => this.updateRange(range, interval, 'end', 10),
      });
    }
    return subjectHeadingsInInterval;
  }

  backgroundColor(nestedTable = false) {
    const indentation = nestedTable ? this.props.indentation - 1 : this.props.indentation;

    const level = indentation >= 3 ? 3 : indentation;

    const backgroundColor = {
      0: 'hsl(30, 14%, 92%)',
      1: 'hsl(30, 13%, 94%)',
      2: 'hsl(30, 12%, 97%)',
      3: 'hsl(30, 11%, 99%)',
    }[level];

    return backgroundColor;
  }

  tableRow(listItem) {
    const {
      indentation,
      nested,
      container,
      sortBy,
      linked,
      direction,
    } = this.props;

    const { location } = this.context.router;

    const {
      interactive,
    } = this.state;

    if (listItem.button) {
      return (
        <AdditionalSubjectHeadingsButton
          indentation={listItem.indentation || indentation}
          button={listItem.button}
          updateParent={listItem.updateParent}
          key={`${listItem.button}${listItem.indentation}`}
          nested={nested}
          interactive={interactive}
          backgroundColor={this.backgroundColor()}
        />
      );
    }
    if (listItem.nestedTableHeader) {
      return (
        <NestedTableHeader
          subjectHeading={listItem}
          key={`nestedTableHeader${listItem.indentation}`}
          indentation={indentation}
          container={container}
          sortBy={sortBy}
          direction={direction}
          backgroundColor={this.backgroundColor(true)}
        />
      );
    }

    return (
      <SubjectHeading
        subjectHeading={listItem}
        key={listItem.uuid}
        nested={nested}
        indentation={indentation}
        location={location}
        container={container}
        sortBy={sortBy}
        linked={linked}
        backgroundColor={this.backgroundColor()}
      />
    );
  }

  render() {
    const {
      subjectHeadings,
    } = this.state;

    return (
      <React.Fragment>
        {
          subjectHeadings ?
          this.listItemsInRange(subjectHeadings)
          .map(this.tableRow) :
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
  sortBy: PropTypes.string,
  container: PropTypes.string,
  parentUuid: PropTypes.string,
  top: PropTypes.bool,
  updateSort: PropTypes.func,
  pathname: PropTypes.string,
  direction: PropTypes.string,
};

SubjectHeadingsTableBody.defaultProps = {
  indentation: 0,
}

SubjectHeadingsTableBody.contextTypes = {
  router: PropTypes.object,
};

export default SubjectHeadingsTableBody;
