/* globals document */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeadingsTableBody from './SubjectHeadingsTableBody';
import SortButton from './SortButton';
import Range from '../../models/Range';
import appConfig from '../../../../appConfig';
import { Preview } from './PreviewComponents';

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
      range: range || Range.default(),
    };
    this.toggleOpen = this.toggleOpen.bind(this);
    this.updateSubjectHeading = this.updateSubjectHeading.bind(this);
    this.addMore = this.addMore.bind(this);
    this.linkToShow = this.linkToShow.bind(this);
    this.updateSort = this.updateSort.bind(this);
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
        url: url
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

  updateSort(sortType) {
    if (this.state.sortBy !== sortType) {
      this.fetchInitial({ sortBy: sortType, range: Range.default() });
    }
  }

  fetchInitial(additionalParameters = {}) {
    const {
      uuid,
      indentation,
    } = this.props.subjectHeading;
    let {
      sortBy,
    } = this.state;
    if (additionalParameters.sortBy) sortBy = additionalParameters.sortBy;
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
        this.updateSubjectHeading(
          Object.assign(
            { narrower: narrower, open: true },
            additionalParameters,
          ),
        );
      },
    ).catch(resp => console.log(resp));
  }

  sortHandler(e) {
    e.preventDefault();
    this.updateSort(e.target.value);
  }

  render() {
    const {
      indentation,
      subjectHeading,
      location,
      container,
      topLevel,
    } = this.props

    const {
      label,
      uuid,
      bib_count,
      desc_count,
      children,
      preview,
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

    const positionStyle = { marginLeft: 30 * ((indentation || 0) + 1) };
    const isMain = location.pathname.includes(uuid);
    // console.log('isMain ', location )
    // const positionStyle = {}
    // changes to HTML structure here will need to be replicated in ./SubjectHeadingTableHeader
    return (
      <React.Fragment>
        {
          container === 'narrower' ?
            <tr>
              <td colSpan="4">
                <hr className="relatedHeadingsBoundary" />
              </td>
            </tr>
          : null
        }
        <tr data={`${subjectHeading.uuid}, ${container}`} className={`subjectHeadingRow ${ (open || children) ? "openSubjectHeading" : ""} ${(indentation || 0) === 0 ? 'topLevel' : ''} ${(indentation || 0) !== 0 ? 'nestedSubjectHeading' : ''}`}>
          <td className="subjectHeadingsTableCell subjectHeadingLabel" >
            <div className="subjectHeadingLabelInner" style={positionStyle}>
              <div onClick={container !== 'context' ? this.toggleOpen : () => {} } className="subjectHeadingToggle" >{desc_count > 0 ? (!open ? '+' : '-') : ""}</div>
              <a onClick={this.linkToShow}>
                <span className={`emph ${isMain ? 'mainHeading' : ''}`}>{rest === '' ? null : <span className='noEmph'>{`${rest}\u0020--\u00a0`}</span>}{emph}</span>
              </a>
            </div>
          </td>
          <td className="subjectHeadingsTableCell subjectHeadingAttribute titles">{`${bib_count}`}</td>
          <td className="subjectHeadingsTableCell subjectHeadingAttribute narrower">{`${desc_count || '-'}`}</td>
          { open && narrower.length > 1 && uuid.length > 0 && (container !== 'context')
            ? <SortButton sortBy={sortBy} handler={this.sortHandler} />
            : null
          }
        </tr>
        { open ?
          <SubjectHeadingsTableBody
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
        {!open && preview ?
          <Preview topHeadings={preview} />
          : null
        }
      </React.Fragment>
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
