import React from 'react';
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

    const button = (
      <button
        onClick={this.onClick}
        className="seeMoreButton"
      >
        {previous ? '↑' : '↓'} <em key="seeMoreText">See more</em>
        {previous ? null : <br /> }
        {previous ? null : <VerticalEllipse />}
      </button>
    );

    const ellipse = previous ? null : <VerticalEllipse />;

    return (
      <tr className="subjectHeadingRow nestedSubjectHeading">
        <td colSpan="4">
          <span style={{ paddingLeft: `${40 * indentation}px` }}>
            {
              interactive ?
              button
              : ellipse
            }
          </span>
        </td>
      </tr>
    );
  }
}

const VerticalEllipse = () => (
  <div className="verticalEllipse">
    <div>.</div>
    <div>.</div>
    <div>.</div>
  </div>
);

AdditionalSubjectHeadingsButton.propTypes = {
  updateParent: PropTypes.func,
  indentation: PropTypes.number,
  button: PropTypes.string,
  interactive: PropTypes.bool,
};

export default AdditionalSubjectHeadingsButton;
