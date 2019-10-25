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
    console.log('subjectheadingslist constructor')
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

    // console.log('render: ', subjectHeadings)

    return (
      <ul className={nested ? 'subjectHeadingList nestedSubjectHeadingList' : 'subjectHeadingList'}>
        {
          subjectHeadings ?
          subjectHeadings
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
