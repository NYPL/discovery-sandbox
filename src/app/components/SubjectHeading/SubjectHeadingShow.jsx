import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeadingsList from './SubjectHeadingsList';
import BibsList from './BibsList';
import ResultsList from '../Results/ResultsList';
import SubjectHeadingTableHeader from './SubjectHeadingTableHeader';
import appConfig from '../../../../appConfig';


class SubjectHeadingShow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mainHeading: {
        uuid: this.props.params.subjectHeadingUuid,
        label: ''
      },
      bibIds: [],
      bibs: []
    };

    this.linkToContext = this.linkToContext.bind(this);
    this.hasUuid = this.hasUuid.bind(this);
  }

  componentDidMount() {
    let { uuid } = this.state.mainHeading

    axios({
      method: 'GET',
      url: `${appConfig.shepApi}/subject_headings/${uuid}/context`,
      crossDomain: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      this.setState({
        contextHeadings: res.data.subject_headings,
        mainHeading: {
          label: res.data.request.main_label
        }
      })
    })

    axios({
      method: 'GET',
      url: `${appConfig.shepApi}/subject_headings/${uuid}/bibs`,
      crossDomain: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      let bibIds = res.data.bibs.map(bib => bib.bnumber)
      this.setState({
        bibIds: bibIds
      })
    })

    axios({
      method: 'GET',
      url: `${appConfig.shepApi}/subject_headings/${uuid}/related`,
      crossDomain: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      this.setState({
        relatedHeadings: res.data.related_headings
      })
    })
  }

  hasUuid(headings) {
    const uuid = this.props.params.subjectHeadingUuid;
    if (!headings.reduce) return headings.uuid === uuid || this.hasUuid(headings.children || []);
    return headings.reduce(
      (acc, el) => el.uuid === uuid || this.hasUuid(el.children || []) || acc,
      false,
    );
  }

  linkToContext(e) {
    e.preventDefault();
    const {
      contextHeadings,
    } = this.state;
    const uuid = this.props.params.subjectHeadingUuid;
    const topLevelIndex = contextHeadings.findIndex(this.hasUuid);
    const linkLabel = contextHeadings[topLevelIndex && topLevelIndex - 1].label;
    const path = this.props.location.pathname.replace(/\/subject_headings.*/, '');
    this.context.router.push(`${path}/subject_headings?fromLabel=${linkLabel}&fromComparator=start&linked=${uuid}`)
  }

  render() {
    const { contextHeadings, relatedHeadings, bibIds } = this.state;

    const { label } = this.state.mainHeading;

    const { location } = this.props;

    return (
      <div className="subjectHeadingShow">
        <div className="subjectHeadingsBanner">Subject Headings</div>
        <h2>Subject Heading: <em>{label}</em></h2>
        <div className="subjectHeadingMainContent show">
          {bibIds.length > 0 ? <BibsList bibIds={bibIds}/> : null}
          <div className="subjectHeadingRelated">
            <div className="backgroundContainer">
              <h4>Related Subject Headings for <em>{label}</em></h4>
            </div>
            <SubjectHeadingTableHeader />
            <SubjectHeadingsList subjectHeadings={relatedHeadings} location={location}/>
          </div>
          <div className="subjectHeadingContext">
            <div className="backgroundContainer">
              <h4>Subject Headings around <em>{label}</em></h4>
            </div>
            <SubjectHeadingTableHeader />
            <SubjectHeadingsList subjectHeadings={contextHeadings} location={location}/>
            <a onClick={this.linkToContext} className="linkToIndex">See full context</a>
          </div>
        </div>
      </div>
    )
  }
}


SubjectHeadingShow.propTypes = {
  location: PropTypes.object,
};


SubjectHeadingShow.contextTypes = {
  router: PropTypes.object,
};


export default SubjectHeadingShow;
