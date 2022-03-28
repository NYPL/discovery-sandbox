import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Link } from 'react-router';
import { isAeonLink } from '../../../utils/utils';
import RequestButton from './RequestButton';

const AeonButton = ({ item, onClick }) => {
  const [aeonUrl] = useState(() => {
    const aeonUrl = Array.isArray(item.aeonUrl)
      ? item.aeonUrl[0]
      : item.aeonUrl;

    if (!isAeonLink(aeonUrl)) return false;

    const searchParams = new URL(aeonUrl).searchParams;

    const paramMappings = {
      ItemISxN: 'id',
      itemNumber: 'barcode',
      CallNumber: 'callNumber',
    };

    let params = Object.keys(paramMappings)
      .map((paramName) => {
        if (searchParams.has(paramName)) return null;
        const mappedParamName = paramMappings[paramName];
        if (!item[mappedParamName]) return null;
        return `&${paramName}=${item[mappedParamName]}`;
      })
      .filter(Boolean)
      .join('');

    if (params && !aeonUrl.includes('?')) params = `?${params}`;

    return encodeURI(`${aeonUrl}${params || ''}`);
  });

  if (!item.specRequestable) return null;
  if (!aeonUrl) return <div>{item.status.prefLabel ?? 'Not Available'}</div>;

  return (
    <RequestButton url={aeonUrl} text={`Make Appointment`} onClick={onClick}>
      <span>
        {`Appointment Required. `}
        <Link href={'https://www.nypl.org/help/request-research-materials'}>
          <i>{`Details`}</i>
        </Link>
      </span>
    </RequestButton>
  );
};

AeonButton.propTypes = {
  item: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default AeonButton;
