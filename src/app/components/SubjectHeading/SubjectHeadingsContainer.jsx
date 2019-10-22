/* globals document */
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeadingsList from './SubjectHeadingsList';
import appConfig from '../../../../appConfig';


class SubjectHeadingsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
    this.pagination = this.pagination.bind(this);
    this.redirectTo = this.redirectTo.bind(this);
  }

  componentDidMount() {
    let {
      fromLabel,
      fromComparator,
    } = this.props.location.query;
    fromComparator = fromComparator.replace(/(^')|('$)/g, '');
    fromLabel = fromLabel.replace(/(^')|('$)/g, '');
    axios({
      method: 'GET',
      url: `${appConfig.shepApi}/subject_headings?from_label=${fromLabel}&from_comparator=${fromComparator}`,
      crossDomain: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    },
    ).then(
      (res) => {
        this.setState({
          previousUrl: res.data.previous_url,
          nextUrl: res.data.next_url,
          subjectHeadings: res.data.first_level_index,
          error: res.data.first_level_index.length === 0,
        });
      },
    ).catch(
      (err) => {
        console.log('error: ', err);
        if (!this.state.subjectHeadings || this.state.subjectHeadings.length === 0) {
          this.setState({ error: true });
        }
      },
    );
  }

  extractParam(paramName, url) {
    const params = url.replace(/[^\?]*\?/, '');
    const matchdata = params.match(new RegExp(`(^|&)${paramName}=([^&]*)`));
    return matchdata[2];
  }

  convertApiUrlToFrontendUrl(url) {
    if (!url) return null;
    const path = this.props.location.pathname;
    return `${path}?fromLabel=${this.extractParam('from_label', url)}&fromComparator=${this.extractParam('from_comparator', url)}`;
  }

  redirectTo(url) {
    const redirectFunction = function (e) {
      e.preventDefault;
      this.context.router.push(url);
    }
    return redirectFunction.bind(this);
  }

  pagination() {
    const {
      previousUrl,
      nextUrl,
    } = this.state;
    const urlForPrevious = this.convertApiUrlToFrontendUrl(previousUrl);
    const urlForNext = this.convertApiUrlToFrontendUrl(nextUrl);
    return (
      <div className="subjectHeadingNav">
        <a className="subjectNavButton" href={urlForPrevious} onClick={this.redirectTo(urlForPrevious)}>{'\u25C0'}</a>
        <a className="subjectNavButton" href={urlForNext} onClick={this.redirectTo(urlForNext)}>{'\u25B6'}</a>
      </div>
    )
  }

  render() {
    const { error, subjectHeadings } = this.state;
    if (error) {
      return (
        <div>
            'No results found for that search'
        </div>
      )
    }
    return (
      <div>
        <div className="subjectHeadingsBanner">Subject Headings</div>
        <div className="subjectMainContentWrapper">
          <div className="subjectHeadingMainContent">
            {this.pagination()}
            <div className="subjectHeadingRow tableHeadings">
              <span className="subjectHeadingLabelAndToggle">
                <span className="subjectHeadingToggle"></span>
                <span className="subjectHeadingLabel">Subject Heading</span>
              </span>
              <span className="subjectHeadingAttribute">Titles</span>
              <span className="subjectHeadingAttribute">Narrower</span>
            </div>
            <SubjectHeadingsList subjectHeadings={subjectHeadings} />
            {this.pagination()}
          </div>
        </div>
      </div>
    );
  }
}

SubjectHeadingsContainer.contextTypes = {
  router: PropTypes.object,
};

SubjectHeadingsContainer.propTypes = {
  location: PropTypes.object,
};

export default SubjectHeadingsContainer;
