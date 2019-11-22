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
      <div onClick={this.onClick} className={interactive ? 'seeMoreButton' : 'staticDots'} style={{"paddingLeft":`${20*indentation}px`}}>
          {interactive ? `${previous ? '↑' : '↓'} See more` : null}
          {previous || !interactive ? null : <br /> }
          {previous ? null : <VerticalEllipse />}
      </div>
    );
  }
}

const VerticalEllipse = () => {
  return (
    <div className="verticalEllipse">
      <div>.</div>
      <div>.</div>
      <div>.</div>
    </div>
  )
}

AdditionalSubjectHeadingsButton.propTypes = {
  updateParent: PropTypes.func,
  indentation: PropTypes.number,
  button: PropTypes.string,
};

export default AdditionalSubjectHeadingsButton;
