/* globals document */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Actions from '../../actions/Actions';

class SubjectHeading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.updateNarrower = this.updateNarrower.bind(this);
  }

  componentDidMount() {
    window.components = window.components || [];
    window.components.push(this);
  }

  updateNarrower(subjectHeadings, subjectHeading, narrower) {
    subjectHeading.narrower = narrower;
    return subjectHeadings;
  }

  toggleOpen() {
    const {
      open,
    } = this.state;
    const {
      subjectHeading,
      subjectHeadings,
    } = this.props;
    const {
      uuid
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
            this.updateNarrower(subjectHeadings, subjectHeading, narrower)
          )
          this.setState({
            open: true,
          });
        },
      ).catch(resp => console.log(resp));
    } else {
      this.setState({
        open: !open,
      });
    }
  }

  render() {
    const {
      label,
      uuid,
      bib_count,
      desc_count,
    } = this.props.subjectHeading;
    const {
      open,
    } = this.state;

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
