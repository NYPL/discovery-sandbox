import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeadingsList from './SubjectHeadingsList';
import BibsList from './BibsList';
import ResultsList from '../Results/ResultsList';
import SubjectHeadingTableHeader from './SubjectHeadingTableHeader';
import Range from '../../models/Range';
import appConfig from '../../../../appConfig';
import LoadingLayer from '../LoadingLayer/LoadingLayer'


class SubjectHeadingShow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainHeading: {
        uuid: this.props.params.subjectHeadingUuid,
        label: '',
      },
      shepBibs: [],
      bibs: [],
      contextLoading: true,
    };

    this.linkToContext = this.linkToContext.bind(this);
    this.hasUuid = this.hasUuid.bind(this);
    this.processContextHeadings = this.processContextHeadings.bind(this);
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
          contextHeadings: this.processContextHeadings(res.data.subject_headings, uuid),
          mainHeading: {
            label: res.data.request.main_label,
          },
          contextLoading: false
        });
      })
      .catch(
        (err) => {
          console.log('error: ', err);
          this.setState({ error: true });
        },
      );

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
        this.setState({
          shepBibs: res.data.bibs,
          bibsNextUrl: res.data.next_url,
        });
      })
      .catch(
        (err) => {
          console.log('error: ', err);
          this.setState({ error: true });
        },
      );

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
        });
      })
      .catch(
        (err) => {
          console.log('error: ', err);
        },
      );
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

  processContextHeadings(headings, uuid) {
    headings.forEach(heading => Range.addRangeData(heading, uuid, 'show'));
    const mainHeadingIndex = headings.findIndex(heading => heading.children || heading.uuid === uuid);
    const startIndex = mainHeadingIndex > 0 ? mainHeadingIndex - 1 : 0;
    const endIndex = mainHeadingIndex + 2;
    return headings.slice(startIndex, endIndex);
  }

  render() {
    const {
      contextHeadings,
      relatedHeadings,
      shepBibs,
      bibsNextUrl,
      error,
      mainHeading,
      contextLoading,
    } = this.state;

    const { label, uuid } = mainHeading;

    const { location } = this.props;

    if (error) {
      return (<div>Not a subject heading</div>)
    }
    return (
      <div className="subjectHeadingShow">
      <h2>Subject Heading: <em>{label}</em></h2>
        <LoadingLayer status={contextLoading} title={"Subject Heading"}/>
        <div className="subjectHeadingMainContent show">
          {shepBibs.length > 0 ?
            <BibsList shepBibs={shepBibs} nextUrl={bibsNextUrl} />
            : null
          }
          <div className="subjectHeadingRelated">
            <div className="backgroundContainer">
              <h4>Related Subject Headings for <em>{label}</em></h4>
            </div>
            <SubjectHeadingTableHeader />
            <SubjectHeadingsList subjectHeadings={relatedHeadings} location={location} keyId="related" container="narrower"/>
          </div>
          <div className="subjectHeadingContext">
            <div className="backgroundContainer">
              <h4>Subject Headings around <em>{label}</em></h4>
            </div>
            <SubjectHeadingTableHeader />
            <SubjectHeadingsList subjectHeadings={contextHeadings} location={location} showId={uuid} keyId="context" container="context"/>
            <a onClick={this.linkToContext} className="link toIndex">See full context</a>
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
