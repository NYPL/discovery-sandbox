/* globals document */
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';

import SubjectHeadingsTable from './SubjectHeadingsTable'
import SubjectHeadingsTableHeader from './SubjectHeadingsTableHeader'
import SubjectHeadingSearch from './Search/SubjectHeadingSearch'
import SortButton from './SortButton';
import appConfig from '../../data/appConfig';
import LoadingLayer from '../LoadingLayer/LoadingLayer';
import Pagination from '../Pagination/Pagination';

class SubjectHeadingsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: true,
    };
    this.pagination = this.pagination.bind(this);
    this.redirectTo = this.redirectTo.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.navigationLinks = this.navigationLinks.bind(this);
  }

  extractParam(paramName, url) {
    const params = url.replace(/[^\?]*\?/, '');
    const matchdata = params.match(new RegExp(`(^|&)${paramName}=([^&]*)`));
    return matchdata && matchdata[2];
  }

  convertApiUrlToFrontendUrl(url) {
    if (!url) return null;
    const path = this.props.location.pathname;
    const paramHash = {
      fromLabel: 'from_label',
      fromComparator: 'from_comparator',
      filter: 'filter',
      fromAttributeValue: 'from_attribute_value',
      sortBy: 'sort_by',
    };
    const paramString = Object.entries(paramHash)
      .map(([key, value]) => {
        const extractedValue = this.extractParam(value, url);
        return extractedValue ? `${key}=${extractedValue}` : null;
      },
      )
      .filter(pair => pair)
      .join('&');
    return `${path}?${paramString}`;
  }

  redirectTo(url) {
    const redirectFunction = function (e) {
      e.preventDefault();
      this.context.router.push(url);
    };
    return redirectFunction.bind(this);
  }

  updateSort(e) {
    e.preventDefault();
    const {
      pathname,
      query,
    } = this.props.location;
    const paramString = `filter=${query.filter}&sortBy=${e.target.value}`;
    if (e.target.value !== this.state.sortBy) {
      this.context.router.push(`${pathname}?${paramString}`);
    }
  }

  navigationLinks() {
    const {
      previousUrl,
      nextUrl,
    } = this.state;
    const urlForPrevious = this.convertApiUrlToFrontendUrl(previousUrl);
    const urlForNext = this.convertApiUrlToFrontendUrl(nextUrl);

    return { previous: urlForPrevious, next: urlForNext }
  }

  pagination() {
    return (
      <Pagination
        page={2}
        shepNavigation={this.navigationLinks()}
        subjectShowPage
      />
    );
  }

  render() {
    const { error, loading } = this.state;
    const { subjectHeadings } = this.props;
    const location = this.props.location;
    let { linked, sortBy, filter } = this.props.location.query;

    if (!linked) linked = '';

    console.log("SUBJECT HEADINGS", this.props.subjectHeadings);

    if (error || subjectHeadings.length === 0) {
      return (
        <div>
            'No results found for that search'
        </div>
      )
    }

    const sortButton = (
      filter
        ? <SortButton sortBy={sortBy || 'alphabetical'} handler={this.updateSort} />
        : null
    );
    return (
      <div>
        <div className="subjectMainContentWrapper">
          <div className="subjectHeadingMainContent index">
            {this.pagination()}
            <div className="tableHeadingsWrapper">
            </div>
            <SubjectHeadingsTable
              subjectHeadings={subjectHeadings}
              linked={linked}
              location={location}
              sortBy={sortBy}
              sortButton={sortButton}
            />
            {/*this.pagination()*/}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    subjectHeadings: state.subjectHeadings,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateSubjectHeadings: (subjectHeadings) => {
      return dispatch({type: "UPDATE_SUBJECT_HEADINGS", subjectHeadings})
    }
  }
}

SubjectHeadingsContainer.contextTypes = {
  router: PropTypes.object,
};

SubjectHeadingsContainer.propTypes = {
  location: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubjectHeadingsContainer);
