/* globals document */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeadingsList from './SubjectHeadingsList';
import appConfig from '../../../../appConfig';

class SubjectHeading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      narrower: [],
    };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.updateSubjectHeading = this.updateSubjectHeading.bind(this);
    this.addMore = this.addMore.bind(this);
  }

  componentDidMount() {
    window.components = window.components || [];
    window.components.push(this);
  }

  updateSubjectHeading(properties) {
    this.setState(properties);
  }

  pad(label, inset = 0) {
    let labelHtml = label;
    for (let i = 0; i < 5 * inset; i++) {
      labelHtml = `\u00A0${labelHtml}`;
    }
    return `${labelHtml}`;
  }

  toggleOpen() {
    const {
      uuid,
      inset,
    } = this.props.subjectHeading;
    const {
      open,
    } = this.state;
    if (!open) {
      axios({
        method: 'GET',
        url: `${appConfig.shepApi}/subject_headings/${uuid}/narrower`,
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
          narrower.forEach((child) => { child.inset = (inset || 0) + 1; });
          if (narrower.length > 10) {
            narrower[narrower.length - 1] = { button: 'more', url: next_url, updateParent: this.addMore, inset: (inset || 0) + 1 };
          }
          this.updateSubjectHeading({ narrower: narrower, open: true })
        },
      ).catch(resp => console.log(resp));
    } else {
      this.updateSubjectHeading({ open: false });
    }
  }

  addMore(element, data) {
    const {
      narrower,
    } = this.state;
    data.narrower.forEach((child) => { child.inset = (this.props.subjectHeading.inset || 0) + 1; });
    narrower.splice(-1, 1, ...data.narrower);
    if (data.narrower.length > 10) {
      narrower.splice(-1, 1, { button: 'more', url: data.next_url, updateParent: this.addMore, inset: (this.props.subjectHeading.inset || 0) + 1 });
    }
    this.setState({ narrower });
  }

  render() {
    const {
      label,
      uuid,
      bib_count,
      desc_count,
      inset,
    } = this.props.subjectHeading;

    const {
      open,
      narrower,
    } = this.state;

    return (
      <li>
        <ul className={`subjectHeadingRow ${ open ? "openSubjectHeading" : ""}`} >
          <li>
            <ul className="subjectHeadingLabelAndToggle">
              <li onClick={this.toggleOpen} className="subjectHeadingToggle" style={{'padding-left': `${20*inset}px`}}>{desc_count > 0 ? (!open ? '+' : '-') : null}</li>
              <li className="subjectHeadingLabel">{`${label}`}</li>
            </ul>
          </li>
          <li className="subjectHeadingAttribute">{`${bib_count}`}</li>
          <li className="subjectHeadingAttribute">{`${desc_count}`}</li>
        </ul>
        { open ? <SubjectHeadingsList subjectHeadings={narrower} /> : null}
      </li>
    )
  }
}

SubjectHeading.propTypes = {
  subjectHeading: PropTypes.object,
};

export default SubjectHeading;
