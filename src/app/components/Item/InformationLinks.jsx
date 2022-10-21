import React from 'react';
import { Text, Link } from '@nypl/design-system-react-components';
import { isEmpty as _isEmpty } from 'underscore';

const locationUrlEndpoint = (location) => {
  const loc = location.split(' ')[0]
  const urls = {
    'Schwarzman': 'schwarzman',
    'Performing': 'lpa',
    'Schomburg': 'schomburg'
  }
  return urls[loc]
}

const InformationLinks = ({ isRecap, computedAeonUrl: aeonUrl, available, locationUrl: divisionUrl, dueDate, location }) => {
  if (available) {
    if (isRecap) {
      //available recap item
      return <Link
        className='info-link'
        href='https://www.nypl.org/help/request-research-materials'>
        How do I pick up this item and when will it be ready?
      </Link>
    } else if (aeonUrl && aeonUrl.length > 0 && divisionUrl) {
      return <Text className='availability-alert'>
        <span className='available-text'>Available by appointment</span>
        <span> at </span>
        <Link className='division-link' href={divisionUrl}>{location}</Link>
      </Text>
    }
    else {
      //available onsite item
      const locationShort = location.split('-')[0]
      return (
        <Text className='availability-alert'>
          <span className='available-text'>Available </span>
          {'- Can be used on site. Please visit '}
          <Link href={'https://www.nypl.org/locations/' + locationUrlEndpoint(location)}>{'New York Public Library - '}{locationShort}
          </Link>{' to submit a request in person.'}
        </Text>)
    }
  } else {
    const dueDateAlert = <span>{` - In use until ${dueDate}`}</span>
    return (
      <div className='availability-alert'>
        <span className='unavailable-text'>Not available</span>
        {dueDate && dueDateAlert}
        <span>{' - Please '}
          <Link href='https://www.nypl.org/about/divisions'>contact a librarian</Link>{' for assistance'}
        </span>
      </div>)
  }
}

export default InformationLinks
