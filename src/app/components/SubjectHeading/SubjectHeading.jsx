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
      open: !!this.props.subjectHeading.children,
      narrower: (this.props.subjectHeading.children || []),
    };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.updateSubjectHeading = this.updateSubjectHeading.bind(this);
    this.addMore = this.addMore.bind(this);
    this.linkToShow = this.linkToShow.bind(this);
  }

  componentDidMount() {
    window.components = window.components || [];
    window.components.push(this);
  }

  componentDidUpdate(prevProps, nextProps) {

    if (this.state.narrower.length === 0 && this.props.subjectHeading.children) {
      this.setState({
        narrower: this.props.subjectHeading.children,
        open: true,
      });
    }
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
            narrower[narrower.length - 1] = { button: 'more', updateParent: this.fetchAndUpdate(next_url), indentation: (indentation || 0) + 1 };
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
    data.narrower.forEach(
      (child) => { child.indentation = (this.props.subjectHeading.indentation || 0) + 1; }
    );
    narrower.splice(-1, 1, ...data.narrower);
    if (data.narrower.length > 10) {
      narrower.splice(-1, 1, { button: 'next', updateParent: this.fetchAndUpdate(data.next_url), indentation: (this.props.subjectHeading.indentation || 0) + 1 });
    }
    this.setState(prevState => prevState);
  }

  fetchAndUpdate(url) {
    return (element) => {
      axios({
        method: 'GET',
        url: url,
        crossDomain: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }).then(
        resp => this.addMore(element, resp.data),
      ).catch((resp) => { console.log(resp); });
    };
  }

  addEmphasis(string) {
    const components = string.split(" -- ");
    return { emph: components.slice(-1), rest: components.slice(0, -1).join(' -- ') };
  }

  linkToShow(e) {
    e.preventDefault();
    let path = this.props.location.pathname.replace(/\/subject_headings.*/, '');
    this.context.router.push(`${path}/subject_headings/${this.props.subjectHeading.uuid}`)
  }

  render() {
    const {
      indentation,
      subjectHeading,
      location,
    } = this.props

    const {
      label,
      uuid,
      bib_count,
      desc_count,
      children,
      range,
    } = subjectHeading;

    console.log(label, range);

    const {
      open,
      narrower,
    } = this.state;

    const {
      emph,
      rest,
    } = this.addEmphasis(label);

    return (
      <li data={`${subjectHeading.uuid}`}>
        <a className={`subjectHeadingRow ${ open || children ? "openSubjectHeading" : ""}` + `${this.props.nested ? ' nestedSubjectHeading' : ''}`} >
          <span style={{'paddingLeft': `${20*indentation}px`}} className="subjectHeadingLabelAndToggle">
            <span onClick={this.toggleOpen} className="subjectHeadingToggle" >{desc_count > 0 ? (!open ? '+' : '-') : null}</span>
            <span className="subjectHeadingLabel" onClick={this.linkToShow}><span>{rest}</span>{rest === '' ? '' : ' -- ' }<span className='emph'>{emph}</span></span>
          </span>
          <span className="subjectHeadingAttribute titles">{`${bib_count}`}</span>
          <span className="subjectHeadingAttribute narrower">{`${desc_count}`}</span>
        </a>
        { open ? <SubjectHeadingsList subjectHeadings={narrower} nested="true" indentation={(indentation || 0) + 1} location={location} range={range} /> : null}
      </li>
    )
  }
}

SubjectHeading.propTypes = {
  subjectHeading: PropTypes.object,
  location: PropTypes.object,
};

SubjectHeading.contextTypes = {
  router: PropTypes.object,
};

export default SubjectHeading;
