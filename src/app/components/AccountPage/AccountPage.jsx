/* global window */
import React from 'react';
import { useSelector } from 'react-redux';

const AccountPage = () => {
  const { patron } = useSelector(state => ({ patron: state.patron }));

  if (!patron.id) {
    const fullUrl = encodeURIComponent(window.location.href);
    window.location.replace(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
  };

  return (
    <iframe
      src={`https://ilsstaff.nypl.org:443/dp/patroninfo*eng~Sdefault/${patron.id}/holds`}
      title="accountContentIframe"
      id="accountContentIframe"
      width="750"
      height="500"
    />
  );
};

export default AccountPage;
