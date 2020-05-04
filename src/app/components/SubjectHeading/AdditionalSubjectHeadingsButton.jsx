import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

class AdditionalSubjectHeadingsButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClick = this.onClick.bind(this);
    this.hide = this.hide.bind(this);
  }

  onClick() {
    this.props.updateParent(this);
  }

  hide() {
    this.setState({ hidden: true });
  }

  render() {
    const {
      indentation,
      text,
      linkUrl,
      noEllipse,
    } = this.props;

    if (this.state.hidden) return null;

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
            {previous || noEllipse ? null : <VerticalEllipse />}
          </button>
        )

    );

    if (previous && linkUrl) return null;

    const content = button;

    if (!content) return null;

    return (
      <tr
        className={`subjectHeadingRow ${previous || noEllipse ? '' : 'ellipse'}`}
      >
        <td className="subjectHeadingsTableCell" colSpan="4">
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
    <div className="dot">.</div>
    <div className="dot">.</div>
    <div className="dot">.</div>
  </div>
);

AdditionalSubjectHeadingsButton.propTypes = {
  updateParent: PropTypes.func,
  indentation: PropTypes.number,
  button: PropTypes.string,
  linkUrl: PropTypes.string,
  text: PropTypes.string,
};

export default AdditionalSubjectHeadingsButton;
