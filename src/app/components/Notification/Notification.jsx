import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Notification = ({ appConfig, notificationType }) => {
  const notification = appConfig[notificationType];

  console.log(notification, notificationType);
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
  appConfig: PropTypes.object,
};

const mapStateToProps = state => ({ appConfig: state.appConfig });

export default connect(mapStateToProps)(Notification);
