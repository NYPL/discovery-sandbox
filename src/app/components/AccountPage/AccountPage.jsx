/* global window, document */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { Hero, Heading, Breadcrumbs, Link } from '@nypl/design-system-react-components';

import appConfig from '../../data/appConfig';
import { addEventListenersToAccountLinks } from '../../utils/accountPageUtils';

const AccountPage = (props) => {
  const { patron, accountHtml } = useSelector(state => ({
    patron: state.patron,
    accountHtml: state.accountHtml,
  }));

  const content = props.params.content || 'items';
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

    // this "Ratings" feature is in the html, but is not in use
    accountPageContent.getElementsByTagName('th').forEach((th) => {
      if (th.textContent.includes('Ratings')) th.style.display = 'none';
    });
    accountPageContent.getElementsByClassName('patFuncRating').forEach((el) => { el.style.display = 'none'; });

    const errorMessageEls = accountPageContent.getElementsByClassName('errormessage');
    if (errorMessageEls.length) {
      // in original HTML this is `hidden`
      errorMessageEls[0].style.display = 'block';
    }

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const { checked, name, value } = e.target;
        updateSelectedItems((prevSelectedItems) => {
          if (checked) {
            prevSelectedItems[name] = value;
            return prevSelectedItems;
          }
          delete prevSelectedItems[name];
          return prevSelectedItems;
        });
      });
    });

    addEventListenersToAccountLinks(
      links,
      updateAccountHtml,
      updateErrorMessage,
      patron,
      selectedItems,
      content,
    );
  });

  const { baseUrl } = appConfig;

  return (
    <div className="nypl-patron-page nypl-ds nypl--research">
      <Breadcrumbs
        breadcrumbs={[{
          url: appConfig.baseUrl,
          text: 'Home',
        }]}
      />
      <Hero
        heading={
          <Heading level={1} text="Research Catalog" />
        }
        heroType="SECONDARY"
      />
      <div className="nypl-patron-details">
        {patron.names ? `Name: ${patron.names[0]}` : null}
        <br />
        {patron.emails ? `Email: ${patron.emails[0]}` : null}
      </div>
      <ul>
        <li><Link href={`${baseUrl}/account/items`}>Checkouts</Link></li>
        <li><Link href={`${baseUrl}/account/holds`}>Holds</Link></li>
        <li><Link href={`${baseUrl}/account/mylists`}>My Lists</Link></li>
        <li><Link href={`${baseUrl}/account/overdues`}>Fines{`${patron.moneyOwed ? ` ($${patron.moneyOwed.toFixed(2)})` : ''}`}</Link></li>
        <li><Link href={`${baseUrl}/account/msg`}>Messages</Link></li>
      </ul>
      <a
        href={`https://ilsstaff.nypl.org:443/patroninfo*eng~Sdefault/${patron.id}/modpinfo`}
        target="_blank"
      >My Settings
      </a>
      <a
        href={`https://ilsstaff.nypl.org:443/patroninfo*eng~Sdefault/${patron.id}/newpin`}
        target="_blank"
      >Change Pin
      </a>
      <hr />
      {
        typeof accountHtml === 'string' ? (
          <div
            dangerouslySetInnerHTML={{ __html: accountHtml }}
            id="account-page-content"
          />
        ) : ''
      }
    </div>
  );
};

AccountPage.propTypes = {
  params: PropTypes.object,
};

AccountPage.contextTypes = {
  router: PropTypes.object,
};

export default AccountPage;
