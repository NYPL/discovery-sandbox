import React from 'react';
import AppConfigStore from '../../stores/AppConfigStore';

const Notification = (props) => {
  const appConfigState = AppConfigStore.getState();
  const {
    notificationType,
  } = props;

  const notification = appConfigState[notificationType];

  if (!notification) return null;

  return (
    <div className="nypl-banner-alert">
      <p style={{ padding: '0px 20px 0px', margin: 0 }} dangerouslySetInnerHTML={{__html: notification }} />
    </div>
  );
};

export default Notification;
