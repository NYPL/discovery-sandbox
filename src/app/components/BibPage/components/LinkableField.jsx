import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import appConfig from '../../../data/appConfig';
import { trackDiscovery } from '../../../utils/utils';
import ParallelsFields from '../../Parallels/ParallelsFields';

const LinkableBibField = ({ bibValue, field, label, outbound, onClick }) => {
  const text = outbound
    ? bibValue.prefLabel || bibValue.label || bibValue.url
    : bibValue;

  const filter = `filters[${field}]=${bibValue ?? ''}`;
  const url = outbound ? bibValue.url : `${appConfig.baseUrl}/search?${filter}`;

  const handler = (event) => {
    if (!outbound) {
      !!onClick && onClick(event);
    }

    trackDiscovery('Bib fields', `${label} - ${text}`);
  };

  return (
    <Link onClick={handler} to={url} target={outbound ? '_blank' : undefined}>
      <ParallelsFields content={text} />
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
