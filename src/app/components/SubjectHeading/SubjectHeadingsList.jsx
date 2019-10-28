/* globals document */
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeading from './SubjectHeading';
import AdditionalSubjectHeadingsButton from './AdditionalSubjectHeadingsButton';
import appConfig from '../../../../appConfig';

class SubjectHeadingsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { subjectHeadings: props.subjectHeadings };
  }

  componentDidUpdate() {
    if (!this.state.subjectHeadings) {
      this.setState({ subjectHeadings: this.props.subjectHeadings }, () => {
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
    // subjectHeadings.forEach((subjectHeading) => {
    //   const matchingHeading = this.state.subjectHeadings.find(
    //     heading => heading.uuid === subjectHeading.uuid,
    //   );
    //   Object.assign(matchingHeading, subjectHeading);
    // });
    const responseSubjectHeading = subjectHeadings[0];
    const existingSubjectHeadingIndex = this.state.subjectHeadings.findIndex(
      heading => heading.uuid === responseSubjectHeading.uuid,
    );
    console.log('index', existingSubjectHeadingIndex);
    // this.state.subjectHeadings.find(heading => heading.uuid === linked).children = subjectHeadings;
    this.state.subjectHeadings[existingSubjectHeadingIndex] = responseSubjectHeading;
    this.setState({ subjectHeadings: JSON.parse(JSON.stringify(this.state.subjectHeadings)) }, () => { console.log('after: ', this.state.subjectHeadings); });
    // this.setState({ subjectHeadings: [] });
  }

  render() {
    const {
      indentation,
      nested,
    } = this.props;

    const {
      subjectHeadings,
    } = this.state;

    console.log('render: ', subjectHeadings)

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
