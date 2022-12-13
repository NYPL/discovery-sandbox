import React, { useContext } from 'react';
import { Text, Link, Button } from '@nypl/design-system-react-components';
import { isEmpty as _isEmpty } from 'underscore';
import { FeedbackBoxContext } from '../../context/FeedbackContext';

const locationUrlEndpoint = (location) => {
  const loc = location.split(' ')[0]
  const urls = {
    'Schwarzman': 'schwarzman',
    'Performing': 'lpa',
    'Schomburg': 'schomburg'
  }
  return urls[loc]
}

const InformationLinks = ({ bibId, callNumber, id, barcode, isRecap, computedAeonUrl: aeonUrl, available, locationUrl: divisionUrl, dueDate, location }) => {
  const { onOpen: openFeedbackBox, setItemMetadata } = useContext
    (FeedbackBoxContext)
  const onContact = (metadata) => {
    setItemMetadata(metadata)
    openFeedbackBox()
  }
  if (available) {
    if (isRecap && !aeonUrl) {
      //available recap item
      return <Link
        className='info-link'
        href='https://www.nypl.org/help/request-research-materials'>
        How do I pick up this item and when will it be ready?
      </Link>
    } else if (aeonUrl && aeonUrl.length > 0 && divisionUrl) {
      return <Text className='availability-alert'>
        <span className='available-text'>Available by appointment</span>
        {!isRecap ? <><span> at </span>
          <Link className='division-link' href={divisionUrl}>{location}</Link></> : null}
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
          <Button onClick={() => onContact({ id, barcode, callNumber, bibId })} buttonType='text' id='contact-librarian'>contact a librarian</Button>{' for assistance.'}
        </span>
      </div>)
  }
}

export default InformationLinks
