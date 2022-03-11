import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router';

const ReCAPButton = ({ item, link, onClick }) => {
  if (!item.physRequestable || !item.isAvailable)
    return <div>{item.status.prefLabel ?? 'Not Available'}</div>;

  return (
    <div className='nypl-request-btn'>
      <Link to={link} onClick={onClick} tabIndex='0' className='secondary'>
        {`Request for Onsite Use`}
      </Link>
      <br />
      <span className='nypl-request-btn-label'>
        {`Timeline `}
        <a>
          <i>{`Details`}</i>
        </a>
      </span>
    </div>
  );
};

ReCAPButton.propTypes = {
  item: PropTypes.object,
  link: PropTypes.string,
  onClick: PropTypes.function,
};

export default ReCAPButton;
