import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';
import appConfig from '../../../data/appConfig';
import RequestButton, { RequestButtonLabel } from './RequestButton';

const PhysButton = ({ item, bibId, onClick }) => {
  if (!item.physRequestable || !item.isRecap)
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
          <Link href={'https://www.nypl.org/help/request-research-materials'}>
            <i>{`Details`}</i>
          </Link>
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
