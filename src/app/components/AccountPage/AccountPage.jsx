/* global window, document */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import appConfig from '../../data/appConfig';
import { addEventListenersToAccountLinks, makeRequest } from '../../utils/accountPageUtils';

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

    const items = accountPageContent.getElementsByClassName('patFuncEntry') || [];
    accountPageContent.getElementsByTagName('th').forEach((th) => {
      // this "Ratings" feature is in the html, but is not in use
      if (th.textContent.includes('Ratings') || th.textContent.includes('RENEW')) {
        th.remove();
        return;
      }
      th.textContent = th.textContent.toLowerCase();
      if (th.textContent.includes('checked')) {
        const length = items.length;
        th.textContent = `Checkouts - ${length} item${length !== 1 ? 's' : ''}`;
      }
    });
    const patFuncEntries = accountPageContent.querySelectorAll('.patFuncEntry');
    patFuncEntries.forEach((el) => {
      // get name and value from checkbox
      const inputs = el.querySelectorAll('input');
      const buttons = [];
      inputs.forEach((input) => {
        const button = document.createElement('button');
        button.name = input.name;
        button.value = input.value;
        button.textContent = 'Renew';
        button.className = 'button button--filled';
        button.addEventListener('click', (e) => {
          e.preventDefault();
          makeRequest(
            updateAccountHtml,
            updateErrorMessage,
            patron.id,
            {
              renewsome: 'YES',
              [input.name]: input.value,
            },
            content,
          );
        });
        buttons.push(button);
      });
      el.querySelectorAll('.patFuncMark').forEach(mark => mark.remove());
      buttons.forEach(button => el.appendChild(button));
    });
    accountPageContent.querySelectorAll('.patFuncRating').forEach(el => el.remove());


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
    <div className="nypl-full-width-wrapper drbb-integration nypl-patron-page">
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
