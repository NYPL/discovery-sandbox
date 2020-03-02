import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

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
      text,
      linkUrl,
    } = this.props;
    const previous = this.props.button === 'previous';

    const seeMoreText = text || 'See more';

    const button = (
      linkUrl ?
        (
          <Link
            to={linkUrl}
            className="seeMoreButton toIndex"
          >
            {seeMoreText}
          </Link>
        )
        :
        (
          <button
            data={`${text}-${linkUrl}`}
            onClick={this.onClick}
            className="seeMoreButton"
          >
            {previous ? '↑' : '↓'} <em key="seeMoreText">{seeMoreText}</em>
            {previous ? null : <br /> }
            {previous ? null : <VerticalEllipse />}
          </button>
        )

    );

    let content = null;

    if (interactive) {
      content = button;
    } else if (!previous) {
      content = <VerticalEllipse />;
    }

    if (!content) return null;

    return (
      <tr
        className="subjectHeadingRow nestedSubjectHeading"
        style={{ backgroundColor: this.props.backgroundColor }}
      >
        <td className="subjectHeadingsTableCell">
          <div className="subjectHeadingLabelInner" style={{ marginLeft: `${30 * indentation}px` }}>
            {
              content
            }
          </div>
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
  linkUrl: PropTypes.string,
  text: PropTypes.string,
};

export default AdditionalSubjectHeadingsButton;
