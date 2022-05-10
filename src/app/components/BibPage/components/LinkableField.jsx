import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import appConfig from '../../../data/appConfig';
import { trackDiscovery } from '../../../utils/utils';
import ParallelsFields from '../../Parallels/ParallelsFields';

const LinkableBibField = ({
  bibValue,
  data = {},
  field,
  label,
  outbound,
  onClick,
  filterPath,
  bib,
}) => {

  const text = outbound
    ? bibValue.prefLabel || bibValue.label || bibValue.url
    : bibValue;
  
  // react router url encoding ignores & and +, so such characters within bibValue need to be encoded manually
  const filter = `filters[${field}]=${ filterPath ?? bibValue['@id'] ?? bibValue.replace('&', '%26').replace('+', '%2B') ?? ''
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
      <ParallelsFields
        content={text}
        field={data.name}
        fieldIndex={data.position}
        bib={bib}
      />
    </Link>
  );
};

LinkableBibField.propTypes = {
  bibValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  data: PropTypes.object,
  field: PropTypes.string.isRequired,
  label: PropTypes.string,
  outbound: PropTypes.bool,
  onClick: PropTypes.func,
  filterPath: PropTypes.string,
  bib: PropTypes.object,
};

export default LinkableBibField;
