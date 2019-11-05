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
    this.props.updateParent(this);
  }

  render() {
    const indentation = this.props.indentation;
    const previous = this.props.button === 'previous';

    return (
      <li>
        <ul className="subjectHeadingRow" >
          <li>
            <ul className="subjectHeadingLabelAndToggle">
              <li onClick={this.toggleOpen} className="subjectHeadingToggle" style={{'paddingLeft': `${20*indentation}px`}}></li>
              <li onClick={this.onClick} className="subjectHeadingLabel seeMoreButton" style={{"paddingLeft":`${20*indentation}px`}}>
                {`${previous ? '↑' : '↓'} See more`}
                {previous ? null : <br /> }
                {previous ? null : '...'}
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
  updateParent: PropTypes.func,
  indentation: PropTypes.number,
  button: PropTypes.string,
};

export default AdditionalSubjectHeadingsButton;
