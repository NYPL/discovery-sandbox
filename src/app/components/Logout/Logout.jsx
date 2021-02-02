import React from 'react';
import PropTypes from 'prop-types';

import appConfig from '../../data/appConfig';

const Logout = (props) => (
  <iframe src={appConfig.logoutUrl} />
);

export default Logout;
