/* globals document */
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import Actions from '../../actions/Actions';

class SubjectHeadingMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.updateSubjectHeading = this.updateSubjectHeading.bind(this);
  }

  onClick() {
    const {
      subjectHeadings,
      parent,
      more,
    } = this.props;
    axios({
      method: 'GET',
      url: more,
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
        console.log('data: ', resp.data);
        parent.testMethod();
        // parent.updateSubjectHeading({ narrower: narrower, more: more })
      },
    ).catch(() => {console.log(parent)})
  }

  updateSubjectHeading(subjectHeadings, parent, properties) {
    parent.narrower = (parent.narrower || []).concat(properties.narrower);
    parent.more = properties.more;
    return subjectHeadings;
  }

  pad(label, inset = 0) {
    let labelHtml = label;
    for (let i = 0; i < inset; i += 5 * inset) {
      labelHtml = `\u00A0${labelHtml}`;
    }
    return `${labelHtml}`;
  }

  render() {
    const {
      inset,
    } = this.props;

    return (
      <tr>
        <td />
        <td onClick={this.onClick} >{`${this.pad('See more', inset)}`}</td>
        <td />
        <td />
      </tr>
    )
  }
}

export default SubjectHeadingMoreButton;
