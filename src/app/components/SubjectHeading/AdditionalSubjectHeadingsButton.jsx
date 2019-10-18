/* globals document */
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

class AdditionalSubjectHeadingsButton extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const {
      url,
      updateParent,
    } = this.props.data;
    axios({
      method: 'GET',
      url: url,
      crossDomain: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }).then(
      resp => updateParent(this, resp.data),
    ).catch((resp) => { console.log(resp); });
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
    } = this.props.data;

    return (
      <li>
        <ul className="subjectHeadingRow" >
          <li>
            <ul className="subjectHeadingLabelAndToggle">
              <li onClick={this.toggleOpen} className="subjectHeadingToggle" style={{'padding-left': `${20*inset}px`}}></li>
              <li onClick={this.onClick} className="subjectHeadingLabel seeMoreButton" style={{"padding-left":`${20*inset}px`}}>
                See more
              </li>
            </ul>
          </li>
          <li className="subjectHeadingAttribute" />
          <li className="subjectHeadingAttribute" />
        </ul>
      </li>
    );
  }
}

AdditionalSubjectHeadingsButton.propTypes = {
  data: PropTypes.object,
};

export default AdditionalSubjectHeadingsButton;
