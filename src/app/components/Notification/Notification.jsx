import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const Notification = ({ notificationType }) => {
  const notification = useSelector(state => state.appConfig[notificationType]);

  if (!notification) return null;

  return (
    <aside
      className="research-alert"
      aria-label="research-catalog-alert"
    >
      <div className="research-alert__heading">New Service Announcement</div>
      <div
        dangerouslySetInnerHTML={{ __html: notification }}
      />
    </aside>
  );
};

Notification.propTypes = {
  notificationType: PropTypes.string,
};

export default Notification;
