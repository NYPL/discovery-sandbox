/* global window, document */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import {
  SkeletonLoader,
  Heading,
  Button,
  ButtonTypes,
  Breadcrumbs,
  Hero,
  HeroTypes,
  Link,
} from '@nypl/design-system-react-components';
import moment from 'moment'

import LinkTabSet from '../components/AccountPage/LinkTabSet';
import AccountSettings from '../components/AccountPage/AccountSettings';
import LoadingLayer from '../components/LoadingLayer/LoadingLayer';
import AccountPageModal from '../components/AccountPageModal/AccountPageModal';
import SccContainer from '../components/SccContainer/SccContainer';
import { logOutFromEncoreAndCatalogIn } from '../utils/logoutUtils';

import { manipulateAccountPage, makeRequest, buildReqBody } from '../utils/accountPageUtils';


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
  const [accountPageModal, setAccountPageModal] = useState(false);

  useEffect(() => {

    if (typeof window !== 'undefined' && (!patron.id || accountHtml.error)) {
      const fullUrl = encodeURIComponent(window.location.href);
      logOutFromEncoreAndCatalogIn(() => {
        window.location.replace(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
      });
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

  const resetCountdown = () => {
      const now = new Date();
      now.setTime(now.getTime() + 5*60*1000)
      const inFive = now.toUTCString();
      document.cookie = `accountPageExp=${inFive}; expires=${inFive}`;
      setAccountPageModal(true);
  }

  useEffect(() => {
      if (typeof window !== 'undefined') {
      resetCountdown();
    }
  });

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

  const formattedExpirationDate = patron.expirationDate ?  moment(patron.expirationDate).format("MM-DD-YYYY") : '';

  if (accountHtml.error) {
    return (
      <LoadingLayer loading={true} />
    );
  }

  return (
    <SccContainer
      className="page-content nypl-patron-page"
      activeSection="account"
      pageTitle="Account"
    >
      <Heading
        level={2}
        id="2"
        text="My Account"
      />
      {
        accountPageModal ?
          <AccountPageModal
            stayLoggedIn={resetCountdown}
            baseUrl={baseUrl}
          /> :
          null
      }
      <div className="nypl-patron-details">
        <div className="name">{patron.names ? patron.names[0] : null}</div>
        <div>{patron.barcodes ? patron.barcodes[0] : null}</div>
        <div>Expiration Date: {formattedExpirationDate}</div>
      </div>
      {itemToCancel ? (
        <div className="scc-modal">
          <div>
            <p>Cancel your hold on this item?</p>
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
    </SccContainer>
  );
};

AccountPage.propTypes = {
  params: PropTypes.object,
};

AccountPage.contextTypes = {
  router: PropTypes.object,
};

export default AccountPage;
