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

  render() {
    const {
      indentation,
    } = this.props.data;

    return (
      <li>
        <ul className="subjectHeadingRow" >
          <li>
            <ul className="subjectHeadingLabelAndToggle">
              <li onClick={this.toggleOpen} className="subjectHeadingToggle" style={{'paddingLeft': `${20*indentation}px`}}></li>
              <li onClick={this.onClick} className="subjectHeadingLabel seeMoreButton" style={{"paddingLeft":`${20*indentation}px`}}>
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
