/* globals document */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeading from './SubjectHeading';


class SubjectHeadings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectHeadings: [],
    };
  }

  componentDidMount() {
    const {
      fromLabel,
      fromComparator,
    } = this.props.location.query;
    console.log(`http://localhost:8080/api/v0.1/subject_headings?from_label=${fromLabel}&from_comparator=${fromComparator}`)
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/v0.1/subject_headings?from_label=${fromLabel}&from_comparator=${fromComparator}`,
      crossDomain: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      }
    }
    ).then(
      res => this.setState({
        subjectHeadings: res.data.first_level_index,
      })
    ).catch(
      (res) => window.res = res
    );
  }

  render() {
    const { subjectHeadings } = this.state;
    return (
      <div>
        {subjectHeadings.map(
          heading => <SubjectHeading subjectHeading={heading} />
        )}
      </div>
    );
  }
}

export default SubjectHeadings;
