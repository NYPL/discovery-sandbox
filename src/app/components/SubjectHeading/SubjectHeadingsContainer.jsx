import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import Pagination from '@Pagination';
import Actions from '@Actions';
import AlphabeticalPagination from '@AlphabeticalPagination';
import SubjectHeadingsTable from './SubjectHeadingsTable';
import SortButton from './SortButton';
import appConfig from '../../data/appConfig';
import Store from '@Store';


class SubjectHeadingsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
    this.pagination = this.pagination.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.navigationLinks = this.navigationLinks.bind(this);
  }

  componentDidMount() {
    let {
      fromLabel,
      fromComparator,
    } = this.context.router.location.query;

    const {
      filter,
      sortBy,
      fromAttributeValue,
    } = this.context.router.location.query;

    if (!fromComparator) fromComparator = filter ? null : "start";
    if (!fromLabel) fromLabel = filter ? null : "Aac";

    const apiParamHash = {
      from_comparator: fromComparator,
      from_label: fromLabel,
      filter,
      sort_by: sortBy,
      from_attribute_value: fromAttributeValue,
    };

    const apiParamString = Object
      .entries(apiParamHash)
      .map(([key, value]) => (value ? `${key}=${value}` : null))
      .filter(pair => pair)
      .join('&');

    const url = `${appConfig.baseUrl}/api/subjectHeadings/subject_headings?${apiParamString}`;
    console.log('container did mount ', filter)
    if (filter) {
      console.log('loading');
      Actions.updateLoadingStatus(true);
    }
    axios(url)
      .then(
        (res) => {
          console.log('store is loading ', Store.state.isLoading);
          this.setState({
            previousUrl: res.data.previous_url,
            nextUrl: res.data.next_url,
            subjectHeadings: res.data.subject_headings,
            error: res.data.subject_headings.length === 0,
          }, () => (filter ? Actions.updateLoadingStatus(false) : null));
        },
      ).catch(
        (err) => {
          console.error('error: ', err);
          if (!this.state.subjectHeadings || this.state.subjectHeadings.length === 0) {
            this.setState({ error: true }, (() => filter ? Actions.updateLoadingStatus(false) : null));
          }
        },
      );
  }

  extractParam(paramName, url) {
    const params = url.replace(/[^?]*\?/, '');
    const matchdata = params.match(new RegExp(`(^|&)${paramName}=([^&]*)`));
    return matchdata && matchdata[2];
  }

  convertApiUrlToFrontendUrl(url) {
    if (!url) return null;
    const path = this.context.router.location.pathname;
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

  updateSort(type) {
    const {
      pathname,
      query,
    } = this.context.router.location;

    const paramString = `filter=${query.filter}&sortBy=${type}`;

    if (type !== this.state.sortBy) {
      this.context.router.push(`${pathname}?${paramString}`);
    }
  }

  navigationLinks() {
    const {
      previousUrl,
      nextUrl,
    } = this.state;
    const urlForPrevious = this.convertApiUrlToFrontendUrl(previousUrl, 'previous');
    const urlForNext = this.convertApiUrlToFrontendUrl(nextUrl, 'next');

    return { previous: urlForPrevious, next: urlForNext };
  }

  pagination() {
    return (
      <Pagination
        shepNavigation={this.navigationLinks()}
        subjectIndexPage
      />
    );
  }

  render() {
    const { error, subjectHeadings } = this.state;
    const { location } = this.context.router;
    const { linked, sortBy, filter } = location.query;

    if (error) {
      return (
        <div>
            No results found for that search.
        </div>
      );
    }

    return (
      <React.Fragment>
        {this.pagination()}
        {filter ? null : <AlphabeticalPagination />}
        <SubjectHeadingsTable
          index
          subjectHeadings={subjectHeadings}
          linked={linked}
          location={location}
          sortBy={sortBy}
          updateSort={filter ? this.updateSort : null}
        />
        {this.pagination()}
      </React.Fragment>
    );
  }
}

SubjectHeadingsContainer.contextTypes = {
  router: PropTypes.object,
};

export default SubjectHeadingsContainer;
