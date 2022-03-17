import PropTypes from 'prop-types';
import React from 'react';
import appConfig from '../../../data/appConfig';
import RequestButton, { RequestButtonLabel } from './RequestButton';

const PhysButton = ({ item, bibId, onClick }) => {
  if (!item.physRequestable || !item.available)
    return <div>{item.status.prefLabel ?? 'Not Available'}</div>;

  const path = `${appConfig.baseUrl}/hold/request/${bibId}-${item.id}`;

  return (
    <RequestButton
      url={path}
      text={`Request for Onsite Use`}
      onClick={onClick}
      secondary
    >
      <RequestButtonLabel>
        <span>
          {`Timeline `}
          <a>
            <i>{`Details`}</i>
          </a>
        </span>
      </RequestButtonLabel>
    </RequestButton>
  );
};

PhysButton.propTypes = {
  item: PropTypes.object.isRequired,
  bibId: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PhysButton;
