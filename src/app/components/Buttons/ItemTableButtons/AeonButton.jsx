import PropTypes from 'prop-types';
import React, { useState } from 'react';
import appConfig from '../../../data/appConfig';
import { isAeonLink } from '../../../utils/utils';

const AeonButton = ({ item, onClick }) => {
  const [aeonUrl] = useState(() => {
    const aeonUrl = Array.isArray(item.aeonUrl)
      ? item.aeonUrl[0]
      : item.aeonUrl;

    if (!isAeonLink(aeonUrl)) return `${appConfig.baseUrl}/404`;

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

  return (
    <div className='nypl-request-btn'>
      <a href={aeonUrl} onClick={onClick} tabIndex='0'>
        {`Make Appointment`}
      </a>
      <br />
      <span className='nypl-request-btn-label'>
        {`Appointment Required. `}
        <a>
          <i>{`Details`}</i>
        </a>
      </span>
    </div>
  );
};

AeonButton.propTypes = {
  item: PropTypes.object,
  onClick: PropTypes.function,
};

export default AeonButton;
