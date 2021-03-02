import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const Notification = ({ notificationType }) => {
  const notification = useSelector(state => state.appConfig[notificationType]);

  if (!notification) return null;

  return (
    <div className="nypl-banner-alert">
      <p
        style={{ padding: '0px 20px 0px', margin: 0 }}
        dangerouslySetInnerHTML={{__html: notification }}
      />
    </div>
  );
};

Notification.propTypes = {
  notificationType: PropTypes.string,
};

export default Notification;
