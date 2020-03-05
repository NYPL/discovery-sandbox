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


class SubjectHeadingsContainer extends React.Component {
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
        // The callback `fetchNarrower` makes api calls to pre-open the narrower headings,
        // if it is the filtered index and the filter returns a low heading count.
        // it also has the responsibility of setting `componentLoading` at the appropriate point
        (res) => {
          this.setState({
            previousUrl: res.data.previous_url,
            nextUrl: res.data.next_url,
            subjectHeadings: res.data.subject_headings,
            error: res.data.subject_headings.length === 0,
          }, this.fetchNarrower);
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

  fetchNarrower() {
    const { filter } = this.context.router.location.query;
    const { subjectHeadings } = this.state;

    let url;

    if (!subjectHeadings) return;
    if (!filter || !subjectHeadings.length) return this.setState({ componentLoading: false });

    if (subjectHeadings.length > 7) {
      url = `${appConfig.baseUrl}/api/subjectHeadings/subject_headings/${subjectHeadings[0].uuid}/narrower`;
      axios(url)
        .then((resp) => {
          this.setState((prevState) => {
            const data = { resp };
            prevState.subjectHeadings
              .find(subjectHeading => subjectHeading.uuid === data.request.id)
              .children = data.narrower;

            return {
              subjectHeadings: prevState.subjectHeadings,
              componentLoading: false,
            };
          });
        });
    }

    Promise.all(
      subjectHeadings.map((subjectHeading) => {
        url = `${appConfig.baseUrl}/api/subjectHeadings/subject_headings/${subjectHeading.uuid}/narrower`;
        return axios(url);
      })
    )
      .then((resp) => {
        this.setState((prevState) => {
          resp.forEach((narrowerResp) => {
            if (!narrowerResp) return;
            const { data } = narrowerResp;
            if (data.message) return;
            if (data.narrower) {
              prevState.subjectHeadings
                .find(subjectHeading => subjectHeading.uuid === data.request.id)
                .children = data.narrower;
            }
          });

          return {
            subjectHeadings: prevState.subjectHeadings,
            componentLoading: false,
          };
        });
      })
      .catch(console.error)
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
