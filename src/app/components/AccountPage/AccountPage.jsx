/* global window, document */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { SkeletonLoader, Heading, Button, ButtonTypes } from '@nypl/design-system-react-components';

import LinkTabSet from './LinkTabSet';
import AccountSettings from './AccountSettings';

import { manipulateAccountPage, makeRequest, buildReqBody } from '../../utils/accountPageUtils';


const AccountPage = (props) => {
  const { patron, accountHtml, appConfig } = useSelector(state => ({
    patron: state.patron,
    accountHtml: state.accountHtml,
    appConfig: state.appConfig,
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
    if (content === 'settings') {
      setIsLoading(false);
      return;
    }
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
    const body = buildReqBody(content, {
      currentsortorder: 'current_pickup',
      updateholdssome: 'YES',
      [itemToCancel.name]: itemToCancel.value,
    });

    makeRequest(
      updateAccountHtml,
      patron.id,
      body,
      content,
      setIsLoading,
    );

    setItemToCancel(null);
  };

  return (
    <div className="nypl-full-width-wrapper drbb-integration nypl-patron-page nypl-ds">
      <Heading level={2} text="My Account" />
      <div className="nypl-patron-details">
        <div className="name">{patron.names ? patron.names[0] : null}</div>
        <div>{patron.barcodes ? patron.barcodes[0] : null}</div>
        <div>Expiration Date: {patron.expirationDate}</div>
      </div>
      {itemToCancel ? (
        <div className="scc-modal">
          <div>
            <p>You requested <span>canceling</span> of following item:</p>
            <p>{itemToCancel.title}</p>
            <Button
              buttonType={ButtonTypes.Secondary}
              onClick={() => setItemToCancel(null)}
            >Back
            </Button>
            <Button
              buttonType={ButtonTypes.Primary}
              onClick={cancelItem}
            >Confirm
            </Button>
          </div>
        </div>
      ) : null}
      <LinkTabSet
        activeTab={content}
        tabs={[
          {
            label: 'Checkouts',
            link: `${baseUrl}/account/items`,
            content: 'items'
          },
          {
            label: 'Holds',
            link: `${baseUrl}/account/holds`,
            content: 'holds',
          },
          {
            label: `Fines${patron.moneyOwed ? ` ($${patron.moneyOwed.toFixed(2)})` : ''}`,
            link: `${baseUrl}/account/overdues`,
            content: 'overdues',
          },
          {
            label: 'Account Settings',
            link: `${baseUrl}/account/settings`,
            content: 'settings',
          },
        ]}
      />
      {isLoading && content !== 'settings' ? <SkeletonLoader /> : ''}
      {
        typeof accountHtml === 'string' && content !== 'settings' ? (
          <div
            dangerouslySetInnerHTML={{ __html: accountHtml }}
            id="account-page-content"
            className={`${content} ${isLoading ? 'loading' : ''}`}
          />
        ) : ''
      }
      {
        content === 'settings' ? (
          <AccountSettings
            patron={patron}
            legacyCatalog={appConfig.legacyCatalog}
          />
        ) : null
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
