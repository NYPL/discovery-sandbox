import React from 'react'

import SccContainer from '../components/SccContainer/SccContainer'
import SubjectHeadingsContainer from '../components/SubjectHeading/SubjectHeadingsContainer';
import SubjectHeadingSearch from '../components/SubjectHeading/Search/SubjectHeadingSearch'

const SubjectHeadingsIndex = (props) => {
  const {
    location: {
      query,
      query: {
        filter,
      },
    }
  } = props;

  return (
    <SccContainer
      mainContent={<SubjectHeadingsContainer {...props}/>}
      bannerText={
        ['Subject Headings', filter ? <span key='bannerText'> containing <em>{filter}</em></span>: '']
      }
      bannerRightElement={<SubjectHeadingSearch />}
    />
  )
}

export default SubjectHeadingsIndex
