import React from 'react';
import { } from 'react-router';
import { Text, Link } from '@nypl/design-system-react-components';
import { isEmpty as _isEmpty } from 'underscore';

import {
  trackDiscovery,
} from '../../utils/utils';

import appConfig from '../../data/appConfig';

const { features } = appConfig;

const RequestInfo = ({ isRecap, aeonUrl, available, division, divisionUrl, dueDate }) => {
  if (available) {
    if (isRecap) {
      //available recap item
      return <Link
        className='info-link'
        href='https://www.nypl.org/help/request-research-materials'>
        How do I pick up this item and when will it be ready?
      </Link>
    } else if (aeonUrl.length > 0) {
      return <Text className='availability-alert'>
        <span className='available-text'>Available by appointment </span>
        at [DIVISION LINK]
      </Text>
    }
    else {
      //available onsite item
      return <Text className='availability-alert'>
        <span className='available-text'>Available </span>
        - Can be used on site. Please visit [LOCATION LINK] to submit a request in person</Text>
    }
  } else {
    const dueDateAlert = <span>{` - In use until ${dueDate}`}</span>
    return <div className='availability-alert'>
      <span className='unavailable-text'>Not available</span>
      {dueDate && dueDateAlert}
      <Link href='https://www.nypl.org/about/divisions'>. See a librarian for assistance</Link>
    </div>
  }
}

export default RequestInfo
