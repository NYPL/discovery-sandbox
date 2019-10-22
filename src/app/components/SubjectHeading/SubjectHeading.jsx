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

  toggleOpen() {
    const {
      uuid,
      indentation,
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
          narrower.forEach((child) => { child.indentation = (indentation || 0) + 1; });
          if (narrower.length > 10) {
            narrower[narrower.length - 1] = { button: 'more', url: next_url, updateParent: this.addMore, indentation: (indentation || 0) + 1 };
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
    data.narrower.forEach((child) => { child.indentation = (this.props.subjectHeading.indentation || 0) + 1; });
    narrower.splice(-1, 1, ...data.narrower);
    if (data.narrower.length > 10) {
      narrower.splice(-1, 1, { button: 'more', url: data.next_url, updateParent: this.addMore, indentation: (this.props.subjectHeading.indentation || 0) + 1 });
    }
    this.setState({ narrower });
  }

  addEmphasis(string) {
    const components = string.split(" -- ");
    console.log(string, { emph: components[-1], rest: components.slice(0, -1).join(' -- ') })
    return { emph: components.slice(-1), rest: components.slice(0, -1).join(' -- ') };
  }

  render() {
    const {
      label,
      uuid,
      bib_count,
      desc_count,
      indentation,
    } = this.props.subjectHeading;

    const {
      open,
      narrower,
    } = this.state;

    const {
      emph,
      rest,
    } = this.addEmphasis(label);

    return (
      <li >
        <span className={`subjectHeadingRow ${ open ? "openSubjectHeading" : ""}` + `${this.props.nested ? ' nestedSubjectHeading' : ''}`} >
          <span className="subjectHeadingLabelAndToggle">
            <span onClick={this.toggleOpen} className="subjectHeadingToggle" style={{'paddingLeft': `${20*indentation}px`}}>{desc_count > 0 ? (!open ? '+' : '-') : null}</span>
            <span className="subjectHeadingLabel"><span>{rest}</span>{rest === '' ? '' : ' -- ' }<span className='emph'>{emph}</span></span>
          </span>
          <span className="subjectHeadingAttribute">{`${bib_count}`}</span>
          <span className="subjectHeadingAttribute">{`${desc_count}`}</span>
        </span>
        { open ? <SubjectHeadingsList subjectHeadings={narrower} nested="true" /> : null}
      </li>
    )
  }
}

SubjectHeading.propTypes = {
  subjectHeading: PropTypes.object,
};

export default SubjectHeading;
