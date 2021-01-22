/* global window, document */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import {
  SkeletonLoader,
  Button,
  ButtonTypes,
  Breadcrumbs,
  Hero,
  HeroTypes,
  Heading,
  Link,
} from '@nypl/design-system-react-components';

import LinkTabSet from './LinkTabSet';

import appConfig from '../../data/appConfig';
import { manipulateAccountPage, makeRequest, buildReqBody } from '../../utils/accountPageUtils';


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
    <div className="nypl-ds nypl--research layout">
      <Breadcrumbs
        breadcrumbs={[
          { url: "htttps://www.nypl.org", text: "Home" },
          { url: "https://www.nypl.org/research", text: "Research" },
          { url: appConfig.baseUrl, text: "Research Catalog" },
        ]}
        className="breadcrumbs"
      />
      <Hero
        heroType={HeroTypes.Secondary}
        heading={(
          <>
            <Heading
              level={1}
              id={"1"}
              text="Research Catalog"
            />
            <nav className="sub-nav apply-brand-styles">
              <Link href="#">Search</Link> |&nbsp;
              <Link href="#">Subject Heading Explorer</Link> |&nbsp; 
              <Link href="#">My Account</Link>
            </nav>
          </>
        )}
        className="apply-brand-styles hero"
      />
      <div className="page-content nypl-patron-page">
        <Heading
          level={2}
          id="2"
          text="My Account"
          className="section-title"
        />
        <div className="nypl-patron-details">
          {patron.names ? patron.names[0] : null}
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
