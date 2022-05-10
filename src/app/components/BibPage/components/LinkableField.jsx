import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import appConfig from '../../../data/appConfig';
import { trackDiscovery } from '../../../utils/utils';
import DirectionalText from './DirectionalText';

const LinkableBibField = ({
  bibValue,
  field,
  label,
  outbound,
  onClick,
  filterPath,
}) => {
  const text = outbound
    ? bibValue.prefLabel || bibValue.label || bibValue.url
    : bibValue;

  const filter = `filters[${field}]=${
    filterPath ?? bibValue['@id'] ?? bibValue ?? ''
  }`;

  const url = outbound
    ? bibValue['@id'] || bibValue.url
    : `${appConfig.baseUrl}/search?${filter}`;

  const handler = (event) => {
    if (!outbound) {
      !!onClick && onClick(event);
    }

    trackDiscovery('Bib fields', `${label} - ${text}`);
  };

  return (
    <Link onClick={handler} to={url} target={outbound ? '_blank' : undefined}>
      <DirectionalText text={text} />
    </Link>
  );
};

LinkableBibField.propTypes = {
  bibValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // data: PropTypes.object,
  field: PropTypes.string.isRequired,
  label: PropTypes.string,
  outbound: PropTypes.bool,
  onClick: PropTypes.func,
  filterPath: PropTypes.string,
  // bib: PropTypes.object,
};

export default LinkableBibField;