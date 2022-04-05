import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import appConfig from '../../../data/appConfig';
import { trackDiscovery } from '../../../utils/utils';

const LinkableBibField = ({ bibValue, field, label, outbound, onClick }) => {
  const text = outbound
    ? bibValue.prefLabel || bibValue.label || bibValue.url
    : bibValue;

  const filter = `filters[${field}]=${bibValue ?? ''}`;
  const url = outbound ? bibValue.url : `${appConfig.baseUrl}/search?${filter}`;

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
    <Link onClick={handler} to={encodeURIComponent(url)}>
      {text}
    </Link>
  );
};

LinkableBibField.propTypes = {
  bibValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  field: PropTypes.string.isRequired,
  label: PropTypes.string,
  outbound: PropTypes.bool,
  onClick: PropTypes.func,
};

export default LinkableBibField;
