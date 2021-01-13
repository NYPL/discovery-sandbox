/* global window, document */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { SkeletonLoader } from '@nypl/design-system-react-components';

import LinkTabSet from './LinkTabSet';

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
    };
    const accountPageContent = document.getElementById('account-page-content');

    if (accountPageContent) {
      const eventListeners = manipulateAccountPage(
        accountPageContent,
        updateAccountHtml,
        patron,
        content,
        setIsLoading,
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

  return (
    <div className="nypl-full-width-wrapper drbb-integration nypl-patron-page nypl-ds">
      <h2>My Account</h2>
      <div className="nypl-patron-details">
        {patron.names ? patron.names[0] : null}
      </div>
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
            label: 'Messages',
            link: `${baseUrl}/account/msg`,
            content: 'msg',
          },
          {
            label: 'Account Settings',
            link: `${baseUrl}/account/settings`,
            content: 'settings',
          },
        ]}
      />
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
      {
        content === 'settings' ? (
          <>
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
          </>
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
