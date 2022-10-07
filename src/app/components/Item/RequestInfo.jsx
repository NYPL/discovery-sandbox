import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { } from '@nypl/design-system-react-components';
import { isEmpty as _isEmpty } from 'underscore';

import {
  trackDiscovery,
} from '../../utils/utils';

import appConfig from '../../data/appConfig';

const { features } = appConfig;

const RequestInfo = ({ isRecap, isAeon, available, division, locationUrl }) => {
  if (available) {
    if (isRecap) {
      return <Link
        style={{
          fontSize: 'var(--nypl-fontSizes--3)'
        }}
        href='https://www.nypl.org/help/request-research-materials'>
        How do I pick up this item and when will it be ready?
      </Link>
    }
  }
  return null
}

export default RequestInfo
