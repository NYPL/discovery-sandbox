import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeadingsList from './SubjectHeadingsList';
import appConfig from '../../../../appConfig';


class SubjectHeadingShow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      subjectHeadings: [],
      mainHeading: {
        uuid: this.props.params.subjectHeadingUuid,
        label: ''
      }
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
        subjectHeadings: res.data.subject_headings,
        mainHeading: {
          label: res.data.request.main_label
        }
      })
    })
  }

  render() {
    const { subjectHeadings } = this.state

    const { label, uuid } = this.state.mainHeading

    return (
      <div>
        <div className="subjectHeadingsBanner">Subject Headings</div>
        <div className="subjectHeadingMainContent">
          <h2>Subject Heading: <em>{label}</em></h2>
          <SubjectHeadingsList subjectHeadings={subjectHeadings} mainUuid={uuid}/>
        </div>
      </div>
    )
  }
}

export default SubjectHeadingShow;
