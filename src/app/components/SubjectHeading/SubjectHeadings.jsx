/* globals document */
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeading from './SubjectHeading';


class SubjectHeadings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subjectHeadings: [],
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
    console.log(`http://localhost:8080/api/v0.1/subject_headings?from_label=${fromLabel}&from_comparator=${fromComparator}`)
    window.component = this;
    axios({
      method: 'GET',
      url: `http://localhost:8080/api/v0.1/subject_headings?from_label=${fromLabel}&from_comparator=${fromComparator}`,
      crossDomain: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }
    ).then(
      res => this.setState({
        subjectHeadings: res.data.first_level_index,
        previousUrl: res.data.previous_url,
        nextUrl: res.data.next_url,
        error: false
      })
    ).catch(
      (err) => {
        console.log('error: ', err)
        if (this.state.subjectHeadings.length === 0) {
          this.setState({ error: true })
        }
      }
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
      <div>
        <a href={urlForPrevious} onClick={this.redirectTo(urlForPrevious)}>Previous Results</a>
        <a href={urlForNext} onClick={this.redirectTo(urlForNext)}>Next Results</a>
      </div>
    )
  }

  render() {
    const { subjectHeadings, error } = this.state;
    console.log('state error: ', error);
    if (error) {
      return (
        <div>
            'No results found for that search'
        </div>
      )
    }
    return (
      <div>
        {this.pagination()}
        {subjectHeadings.map(
          (heading, i) => <SubjectHeading subjectHeading={heading} key={i} />
        )}
        {this.pagination()}
      </div>
    );
  }
}

SubjectHeadings.contextTypes = {
  router: PropTypes.object,
}

export default SubjectHeadings;
