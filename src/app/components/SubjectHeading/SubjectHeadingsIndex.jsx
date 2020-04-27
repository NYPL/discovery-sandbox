import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

/* eslint-disable import/first, import/no-unresolved, import/extensions */
import Pagination from '@Pagination';
import AlphabeticalPagination from '@AlphabeticalPagination';
import calculateDirection from '@calculateDirection';
import SubjectHeadingsTable from './SubjectHeadingsTable';
/* eslint-enable import/first, import/no-unresolved, import/extensions */
import appConfig from '../../data/appConfig';


class SubjectHeadingsIndex extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      componentLoading: true,
      subjectHeadings: [],
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
      direction,
    } = this.context.router.location.query;

    if (!fromComparator) fromComparator = filter ? null : 'start';
    if (!fromLabel) fromLabel = filter ? null : 'Aac';

    const apiParamHash = {
      from_comparator: fromComparator,
      from_label: fromLabel,
      filter,
      sort_by: sortBy,
      from_attribute_value: fromAttributeValue,
    };

    if (direction) apiParamHash.direction = direction;

    const apiParamString = Object
      .entries(apiParamHash)
      .map(([key, value]) => (value ? `${key}=${value}` : null))
      .filter(pair => pair)
      .join('&');

    const url = `${appConfig.baseUrl}/api/subjectHeadings/subject_headings?${apiParamString}`;
    axios(url)
      .then(
        (res) => {
          this.setState({
            previousUrl: res.data.previous_url,
            nextUrl: res.data.next_url,
            subjectHeadings: res.data.subject_headings,
            error: res.data.subject_headings.length === 0,
            componentLoading: false,
          });
        },
      ).catch(
        (err) => {
          // eslint-disable-next-line no-console
          console.error('error: ', err);
          if (!this.state.subjectHeadings || this.state.subjectHeadings.length === 0) {
            this.setState({
              error: true,
              componentLoading: false,
            });
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
      query: {
        sortBy,
        direction,
      },
    } = this.context.router.location;

    const updatedDirection = calculateDirection(sortBy, direction)(type);

    const paramString = `filter=${query.filter}&sortBy=${type}&direction=${updatedDirection}`;

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
    const { linked, sortBy, filter, direction } = location.query;
    const preOpen = subjectHeadings.length <= 7;

    if (error) {
      return (
        <div>
            No results found for that search.
        </div>
      );
    }

    if (this.state.componentLoading) {
      return (
        <div className="subjectHeadingShowLoadingWrapper">
          {this.pagination()}
          {filter ? null : <AlphabeticalPagination />}
          <span
            id="loading-animation"
            className="loadingLayer-texts-loadingWord"
          >
            Loading Subject Headings
          </span>
          <div className="loadingDots">
            <span />
            <span />
            <span />
            <span />
          </div>
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
          direction={direction}
          updateSort={filter ? this.updateSort : null}
          container="index"
          preOpen={preOpen}
        />
        {this.pagination()}
      </React.Fragment>
    );
  }
}

SubjectHeadingsIndex.contextTypes = {
  router: PropTypes.object,
};

export default SubjectHeadingsIndex;
