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
    if (this.props.interactive) this.props.updateParent(this);
  }

  render() {
    const {
      indentation,
      interactive,
    } = this.props;
    const previous = this.props.button === 'previous';

    return (
      <li className={interactive ? '' : 'staticDots'}>
        <ul className="subjectHeadingRow" >
          <li>
            <ul className="subjectHeadingLabelAndToggle">
              <li onClick={this.toggleOpen} className="subjectHeadingToggle" style={{'paddingLeft': `${20*indentation}px`}}></li>
              <li onClick={this.onClick} className="subjectHeadingLabel seeMoreButton" style={{"paddingLeft":`${20*indentation}px`}}>
                {interactive ? `${previous ? '↑' : '↓'} See more` : null}
                {previous || !interactive ? null : <br /> }
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
