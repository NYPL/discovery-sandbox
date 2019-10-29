import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeadingsList from './SubjectHeadingsList';
import BibsList from './BibsList';
import SubjectHeadingTableHeader from './SubjectHeadingTableHeader';
import appConfig from '../../../../appConfig';


class SubjectHeadingShow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contextHeadings: [],
      relatedHeadings: [],
      mainHeading: {
        uuid: this.props.params.subjectHeadingUuid,
        label: ''
      },
      bibs: []
    }
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
      this.setState({
        bibs: res.data.bibs
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

  render() {
    const { contextHeadings, relatedHeadings, bibs } = this.state

    const { label, uuid } = this.state.mainHeading

    return (
      <div>
        <div className="subjectHeadingsBanner">Subject Headings</div>
        <h2>Subject Heading: <em>{label}</em></h2>
        <div className="subjectHeadingMainContent show">
          <BibsList bibs={bibs}/>
          <div className="subjectHeadingRelated">
            <h3>Related Subject Headings for <em>{label}</em></h3>
            <SubjectHeadingTableHeader />
            <SubjectHeadingsList subjectHeadings={relatedHeadings} related={true}/>
          </div>
          <div className="subjectHeadingContext">
            <h3>Subject Headings around <em>{label}</em></h3>
            <SubjectHeadingTableHeader />
            <SubjectHeadingsList subjectHeadings={contextHeadings} mainUuid={uuid}/>
          </div>
        </div>
      </div>
    )
  }
}

export default SubjectHeadingShow;
