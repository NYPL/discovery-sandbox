/* globals document */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeadingsTable from './SubjectHeadingsTable';

class SubjectHeading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      children: null,
    };
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  toggleOpen() {
    const {
      open,
      children,
    } = this.state;
    const {
      uuid,
    } = this.props.subjectHeading;
    if (!open && !children) {
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
          this.setState({
            children: narrower,
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
      children,
    } = this.state;

    return(
      <tbody>
        <tr>
          <td onClick={this.toggleOpen}>{!open ? '+' : '-'}</td>
          <td>{`${label}`}</td>
          <td>{`${bib_count}`}</td>
          <td>{`${desc_count}`}</td>
        </tr>
        <tr>
          <td>
            {open ? <SubjectHeadingsTable subjectHeadings={children} /> : null }
          </td>
        </tr>
      </tbody>
    )
  }
}

export default SubjectHeading;
