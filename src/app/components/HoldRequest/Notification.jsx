import React from 'react';
import Store from '../../stores/Store';

const Notification = () => {
  const { holdRequestNotification } = Store.getState();

  return (
    <div className="nypl-banner-alert">
      <p style={{ padding: '10px 20px 0px', margin: 0 }}>
        { holdRequestNotification }
      </p>
    </div>
  );
};

export default Notification;
