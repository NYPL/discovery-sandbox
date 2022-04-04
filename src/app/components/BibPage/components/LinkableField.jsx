import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import appConfig from '../../../data/appConfig';
import { trackDiscovery } from '../../../utils/utils';

const LinkableBibField = ({ bibValue, label, outbound, onClick }) => {
  const text = outbound
    ? bibValue.prefLabel || bibValue.label || bibValue.url
    : bibValue;

  const url = outbound ? bibValue.url : `${appConfig.baseUrl}/search?${url}`;

  const handler = (event) => {
    if (!outbound) {
      event.preventDefault();
      // get context router
      // this.context.router.push(search);
      !!onClick && onClick();
    }

    trackDiscovery('Bib fields', `${label} - ${text}`);
  };

  return (
    <Link onClick={handler} to={url}>
      {text}
    </Link>
  );
};

LinkableBibField.propTypes = {
  bibValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  label: PropTypes.string,
  outbound: PropTypes.bool,
  onClick: PropTypes.func,
};

export default LinkableBibField;
