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

  render() {
    const { contextHeadings, relatedHeadings, bibIds } = this.state

    const { label, uuid } = this.state.mainHeading

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
            <SubjectHeadingsList subjectHeadings={relatedHeadings} related={true}/>
          </div>
          <div className="subjectHeadingContext">
            <div className="backgroundContainer">
              <h4>Subject Headings around <em>{label}</em></h4>
            </div>
            <SubjectHeadingTableHeader />
            <SubjectHeadingsList subjectHeadings={contextHeadings} mainUuid={uuid}/>
          </div>
        </div>
      </div>
    )
  }
}

export default SubjectHeadingShow;
