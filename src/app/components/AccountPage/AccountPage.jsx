/* global window, document */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

import { SkeletonLoader, Modal, Button, ButtonTypes } from '@nypl/design-system-react-components';

import appConfig from '../../data/appConfig';
import manipulateAccountPage from '../../utils/accountPageUtils';


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

  const [isLoading, setIsLoading] = useState(true);
  const [itemToCancel, setItemToCancel] = useState(null);

  useEffect(() => {
    if (!patron.id) {
      const fullUrl = encodeURIComponent(window.location.href);
      window.location.replace(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
    }
  }, [patron]);

  useEffect(() => {
    const accountPageContent = document.getElementById('account-page-content');

    if (accountPageContent) {
      const eventListeners = manipulateAccountPage(
        accountPageContent,
        updateAccountHtml,
        patron,
        content,
        setIsLoading,
        setItemToCancel,
      );

      return () => {
        if (eventListeners) {
          eventListeners.forEach(({ element, cb }) => {
            element.removeEventListener('click', cb);
          });
        }
      };
    }
  }, [accountHtml]);

  const { baseUrl } = appConfig;

  const cancelItem = () => {
    
  }

  return (
    <div className="nypl-full-width-wrapper drbb-integration nypl-patron-page nypl-ds">
      <div className="nypl-patron-details">
        {patron.names ? `Name: ${patron.names[0]}` : null}
        <br />
        {patron.emails ? `Email: ${patron.emails[0]}` : null}
      </div>
      <ul>
        <li><Link to={`${baseUrl}/account/items`}>Checkouts</Link></li>
        <li><Link to={`${baseUrl}/account/holds`}>Holds</Link></li>
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
      {itemToCancel ? (
        <Modal>
          <div>
            <p>You requested <span>canceling</span> of following item:</p>
            <p>{itemToCancel.title}</p>
            <Button
              buttonType={ButtonTypes.Secondary}
              onClick={() => setItemToCancel(null)}
            >Back</Button>
            <Button
              buttonType={ButtonTypes.Primary}
              onClick{cancelItem}
            >Confirm</Button>
          </div>
        </Modal>
      ) : null}
      {isLoading ? <SkeletonLoader /> : ''}
      {
        typeof accountHtml === 'string' ? (
          <div
            dangerouslySetInnerHTML={{ __html: accountHtml }}
            id="account-page-content"
            className={`${content} ${isLoading ? 'loading' : ''}`}
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
