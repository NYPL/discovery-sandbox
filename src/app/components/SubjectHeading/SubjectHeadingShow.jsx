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

    this.getMainLabel = this.getMainLabel.bind(this)
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

  getMainLabel() {
    if (this.state.subjectHeadings.length > 0) return this.state.subjectHeadings.find(heading => heading.uuid === this.state.mainUuid).label
  }

  render() {
    const { subjectHeadings } = this.state

    const { label } = this.state.mainHeading

    return (
      <div>
        <div className="subjectHeadingsBanner">Subject Headings</div>
        <h2>Subject Heading: <em>{label}</em></h2>
        <SubjectHeadingsList subjectHeadings={subjectHeadings} />
      </div>
    )
  }
}

export default SubjectHeadingShow;
