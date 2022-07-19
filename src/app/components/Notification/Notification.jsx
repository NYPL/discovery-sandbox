import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  Notification as DSNotification
} from '@nypl/design-system-react-components';

const Notification = ({ notificationType }) => {
  const notification = useSelector(state => state.appConfig[notificationType]);

  if (!notification) return null;

  return (
    <DSNotification
      aria-label="research-catalog-alert"
      className="research-alert"
      notificationHeading="New Service Announcement"
      notificationContent={
        <div dangerouslySetInnerHTML={{ __html: notification }} />
      }
      notificationType="announcement"
      noMargin
      __css={{
        svg: {
          width: "35px",
          height: "35px",
          margin: "0",
          marginRight: "xxs",
        }
      }}
    />
  );
};

Notification.propTypes = {
  notificationType: PropTypes.string,
};

export default Notification;
