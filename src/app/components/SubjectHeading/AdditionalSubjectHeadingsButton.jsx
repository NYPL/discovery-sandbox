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
      <tr className="subjectHeadingRow nestedSubjectHeading" colSpan={4}>
        <td onClick={this.onClick} className={interactive ? 'seeMoreButton' : 'staticDots'} style={{"paddingLeft":`${30*indentation + 20}px`}}>
          {interactive ? [previous ? '↑' : '↓', <em key='text'>See more</em>] : null}
          {previous || !interactive ? null : <br /> }
          {previous ? null : <VerticalEllipse />}
        </td>
        <td className="subjectHeadingsTableCell"></td>
        <td className="subjectHeadingsTableCell"></td>
      </tr>
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
