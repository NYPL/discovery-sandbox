/* global window */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import appConfig from '../../data/appConfig';

const AccountPage = (props, { router }) => {
  const { patron } = useSelector(state => ({ patron: state.patron }));

  useEffect(() => {
    if (!patron.id) {
      const fullUrl = encodeURIComponent(window.location.href);
      window.location.replace(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
    }
  });

  console.log(router.location.hash);
  const patronInfoToDisplay = router.location.hash.substring(1) || 'items';

  return (
    <React.Fragment>
      <div className="nypl-patron-details">
          {patron.names[0]}
          Email: {patron.emails[0]}
      </div>
      <ul>
        <li><a href='#items'>Checkouts</a></li>
        <li><a href='#holds'>Holds</a></li>
        <li><a href='#mylists'>My Lists</a></li>
        <li><a href='#overdues'>Fines{`${patron.moneyOwed ? ` ($${patron.moneyOwed.toFixed(2)})` : null}`}</a></li>
        <li><a href='#msg'>Messages</a></li>
      </ul>
      <iframe
        src={`https://ilsstaff.nypl.org:443/dp/patroninfo*eng~Sdefault/${patron.id}/${patronInfoToDisplay}`}
        title="accountContentIframe"
        id="accountContentIframe"
        width="750"
        height="500"
      />
    </React.Fragment>
  );
};

AccountPage.contextTypes = {
  router: PropTypes.object,
};

export default AccountPage;
