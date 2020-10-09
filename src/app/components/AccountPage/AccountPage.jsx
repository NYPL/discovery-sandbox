/* global window */
import React from 'react';
import { useSelector } from 'react-redux';

const AccountPage = () => {
  const { patron } = useSelector(state => ({ patron: state.patron }));

  return (
    <iframe
      src={`https://ilsstaff.nypl.org:443/dp/patroninfo*eng~Sdefault/${patron.ig}/holds`}
      title="accountContentIframe"
      id="accountContentIframe"
      style={{
        height: window.innerHeight,
        height: window.innerWidth,
      }}
    />
  );
};

export default AccountPage;
