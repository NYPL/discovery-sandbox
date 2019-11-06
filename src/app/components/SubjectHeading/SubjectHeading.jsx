/* globals document */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeadingsList from './SubjectHeadingsList';
import SortButtons from './SortButtons';
import Range from '../../models/Range';
import appConfig from '../../../../appConfig';

class SubjectHeading extends React.Component {
  constructor(props) {
    super(props);
    const {
      subjectHeading,
      container,
      sortBy,
    } = this.props;
    const {
      children,
      range,
    } = subjectHeading;
    this.state = {
      open: !!children,
      narrower: (children || []),
      sortBy: sortBy || "alphabetical",
      range: range || new Range(0, Infinity, [{ start: 0, end: Infinity }]),
    };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.updateSubjectHeading = this.updateSubjectHeading.bind(this);
    this.addMore = this.addMore.bind(this);
    this.linkToShow = this.linkToShow.bind(this);
    this.updateSortBy = this.updateSortBy.bind(this);
    this.fetchInitial = this.fetchInitial.bind(this);
    this.sortHandler = this.sortHandler.bind(this);
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
        range: this.props.subjectHeading.range,
      });
    }
  }

  updateSubjectHeading(properties) {
    this.setState(properties);
  }

  toggleOpen() {
    const {
      open,
    } = this.state;
    if (!open) {
      this.fetchInitial();
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
    if (data.next_url) {
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

  updateSortBy(sortByValue) {
    if (this.state.sortBy !== sortByValue) {
      this.state.sortBy = sortByValue;
      this.state.range = new Range(0, Infinity, [{ start: 0, end: Infinity }]);
      this.fetchInitial();
    }
  }

  fetchInitial() {
    const {
      uuid,
      indentation,
    } = this.props.subjectHeading;
    const {
      sortBy,
    } = this.state;
    axios({
      method: 'GET',
      url: `${appConfig.shepApi}/subject_headings/${uuid}/narrower?sort_by=${sortBy}`,
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
        if (next_url) {
          narrower[narrower.length - 1] = { button: 'next', updateParent: this.fetchAndUpdate(next_url), indentation: (indentation || 0) + 1 };
        }
        this.updateSubjectHeading({ narrower: narrower, open: true })
      },
    ).catch(resp => console.log(resp));
  }

  sortHandler(e) {
    e.preventDefault();
    this.updateSortBy(e.target.value);
  }

  render() {
    const {
      indentation,
      subjectHeading,
      location,
      container,
    } = this.props

    const {
      label,
      uuid,
      bib_count,
      desc_count,
      children,
    } = subjectHeading;

    const {
      open,
      narrower,
      sortBy,
      range,
    } = this.state;

    const {
      emph,
      rest,
    } = this.addEmphasis(label);

    return (
      <li data={`${subjectHeading.uuid}, ${container}`} className={`subjectHeadingRow ${ open || children ? "openSubjectHeading" : ""}`}>
        <a  className={`${this.props.nested ? ' nestedSubjectHeading' : ''}`} >
          <span style={{'paddingLeft': `${20*indentation}px`}} className="subjectHeadingLabelAndToggle">
            <span onClick={container !== 'context' ? this.toggleOpen : () => {} } className="subjectHeadingToggle" >{desc_count > 0 ? (!open ? '+' : '-') : null}</span>
            <span className="subjectHeadingLabel" onClick={this.linkToShow}><span>{rest}</span>{rest === '' ? '' : ' -- ' }<span className='emph'>{emph}</span></span>
          </span>
          <span className="subjectHeadingAttribute titles">{`${bib_count}`}</span>
          <span className="subjectHeadingAttribute narrower">{`${desc_count}`}</span>
          { open && narrower.length > 1 && uuid.length > 0 && (container !== 'context' || location.pathname.includes(uuid))
            ? <SortButtons sortBy={sortBy} handler={this.sortHandler} />
            : null
          }
        </a>
        { open
          ? <SubjectHeadingsList
            subjectHeadings={narrower}
            nested="true"
            indentation={(indentation || 0) + 1}
            location={location}
            range={range}
            container={container}
            parentUuid={uuid}
            sortBy={sortBy}
            key={`${uuid}-list-${sortBy}`}
          />
          : null}
      </li>
    );
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
