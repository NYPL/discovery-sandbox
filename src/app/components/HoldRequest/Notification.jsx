import React from 'react';
import AppConfigStore from '../../stores/AppConfigStore';

const Notification = () => {
  const { holdRequestNotification } = AppConfigStore.getState();

  return (
    <div className="nypl-banner-alert">
      <p style={{ padding: '10px 20px 0px', margin: 0 }} dangerouslySetInnerHTML={{__html: holdRequestNotification }} />
    </div>
  );
};

export default Notification;
