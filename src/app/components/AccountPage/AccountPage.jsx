/* global window */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import appConfig from '../../data/appConfig';
import { addEventListenersToAccountLinks } from '../../utils/accountPageUtils';

const AccountPage = (props, { router }) => {
  const { patron, accountHtml } = useSelector(state => ({
    patron: state.patron,
    accountHtml: state.accountHtml,
  }));
  const dispatch = useDispatch();
  const updateAccountHtml = newContent => dispatch({
    type: 'UPDATE_ACCOUNT_HTML',
    payload: newContent,
  });

  // Build object in the format used by Legacy Catalog
  // [input[name]]: input[value]
  const [selectedItems, updateSelectedItems] = useState({});
  const [errorMessage, updateErrorMessage] = useState(null);

  useEffect(() => {
    if (!patron.id) {
      const fullUrl = encodeURIComponent(window.location.href);
      window.location.replace(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
    }
    const accountPageContent = document.getElementById('account-page-content');

    if (!accountPageContent) return;
    const links = accountPageContent.getElementsByTagName('A');
    const checkboxes = accountPageContent.querySelectorAll('input[type=checkbox]');
    const errorMessageEls = accountPageContent.getElementsByClassName('errormessage');
    if (errorMessageEls.length) {
      errorMessageEls[0].style.display = 'block';
    }

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const { checked, name, value } = e.target;
        updateSelectedItems((prevSelectedItems) => {
          if (checked) {
            prevSelectedItems[name] = value
            return prevSelectedItems;
          }
          delete prevSelectedItems[name];
          return prevSelectedItems;
        });
      });
    });

    links.forEach(link => {
      console.log(link.textContent);
    });

    addEventListenersToAccountLinks(
      links,
      updateAccountHtml,
      updateErrorMessage,
      patron.id,
      selectedItems,
    );
  });

  const patronInfoToDisplay = router.location.hash.substring(1) || 'items';
  const { baseUrl } = appConfig;

  return (
    <div className="nypl-full-width-wrapper nypl-patron-page">
      <div className="nypl-patron-details">
          {patron.names ? `Name: ${patron.names[0]}` : null}
          <br />
          {patron.emails ? `Email: ${patron.emails[0]}` : null}
      </div>
      <ul>
        <li><Link to={`${baseUrl}/account/items`}>Checkouts</Link></li>
        <li><Link to={`${baseUrl}/account/holds`}>Holds</Link></li>
        <li><Link to={`${baseUrl}/account/mylists`}>My Lists</Link></li>
        <li><Link to={`${baseUrl}/account/overdues`}>Fines{`${patron.moneyOwed ? ` ($${patron.moneyOwed.toFixed(2)})` : ''}`}</Link></li>
        <li><Link to={`${baseUrl}/account/msg`}>Messages</Link></li>
      </ul>
      <a
        href={`https://ilsstaff.nypl.org:443/patroninfo*eng~Sdefault/${patron.id}/modpinfo`}
        target="_blank"
      >
				My Settings
      </a>
      <a
        href={`https://ilsstaff.nypl.org:443/patroninfo*eng~Sdefault/${patron.id}/newpin`}
        target="_blank"
      >
				Change Pin
      </a>
      <hr />
      <div
        dangerouslySetInnerHTML={{ __html: accountHtml }}
        id="account-page-content"
      />
    </div>
  );
};

AccountPage.contextTypes = {
  router: PropTypes.object,
};

export default AccountPage;
