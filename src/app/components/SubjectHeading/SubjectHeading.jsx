/* globals document */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Actions from '../../actions/Actions';

class SubjectHeading extends React.Component {
  constructor(props) {
    super(props);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.updateSubjectHeading = this.updateSubjectHeading.bind(this);
  }

  componentDidMount() {
    window.components = window.components || [];
    window.components.push(this);
  }

  updateSubjectHeading(subjectHeadings, subjectHeading, properties) {
    Object.assign(subjectHeading, properties);
    return subjectHeadings;
  }

  pad(label, inset = 0) {
    let labelHtml = label;
    for (let i = 0; i < 5 * inset; i++) {
      labelHtml = `\u00A0${labelHtml}`;
    }
    return `${labelHtml}`;
  }

  toggleOpen() {
    const {
      subjectHeading,
      subjectHeadings,
    } = this.props;
    const {
      uuid,
      open,
    } = subjectHeading;
    if (!open) {
      axios({
        method: 'GET',
        url: `http://localhost:8080/api/v0.1/subject_headings/${uuid}/narrower`,
        crossDomain: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }).then(
        (resp) => {
          const {
            narrower,
            next_url,
          } = resp.data;
          console.log('data', resp.data);
          Actions.updateSubjectHeadings(
            this.updateSubjectHeading(subjectHeadings, subjectHeading, { narrower: narrower, more: next_url, open: true })
          );
        },
      ).catch(resp => console.log(resp));
    } else {
      Actions.updateSubjectHeadings(
        this.updateSubjectHeading(subjectHeadings, subjectHeading, { open: false }),
      );
    }
  }

  testMethod() {
    console.log('this works');
  }

  render() {
    const {
      label,
      uuid,
      bib_count,
      desc_count,
      open,
      inset,
    } = this.props.subjectHeading;

    return (
      <tr>
        <td onClick={this.toggleOpen}>{!open ? '+' : '-'}</td>
        <td>{`${this.pad(label, inset)}`}</td>
        <td>{`${bib_count}`}</td>
        <td>{`${desc_count}`}</td>
      </tr>
    )
  }
}

export default SubjectHeading;
