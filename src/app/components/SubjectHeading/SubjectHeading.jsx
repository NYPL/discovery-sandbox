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
          } = resp.data;
          Actions.updateSubjectHeadings(
            this.updateSubjectHeading(subjectHeadings, subjectHeading, { narrower: narrower, open: true })
          );
        },
      ).catch(resp => console.log(resp));
    } else {
      Actions.updateSubjectHeadings(
        this.updateSubjectHeading(subjectHeadings, subjectHeading, { open: false }),
      );
    }
  }

  render() {
    const {
      label,
      uuid,
      bib_count,
      desc_count,
      open,
    } = this.props.subjectHeading;

    return (
      <tr>
        <td onClick={this.toggleOpen}>{!open ? '+' : '-'}</td>
        <td>{`${label}`}</td>
        <td>{`${bib_count}`}</td>
        <td>{`${desc_count}`}</td>
      </tr>
    )
  }
}

export default SubjectHeading;
