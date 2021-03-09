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

import LinkTabSet from './LinkTabSet';
import AccountSettings from './AccountSettings';
import LoadingLayer from '../LoadingLayer/LoadingLayer';
import AccountPageModal from '../AccountPageModal/AccountPageModal';
import { logOutFromEncoreAndCatalogIn } from '../../utils/logoutUtils';

import { manipulateAccountPage, makeRequest, buildReqBody } from '../../utils/accountPageUtils';


const AccountPage = (props) => {
  console.log('account page');
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
  // const [time, setTime] = useState(5*60*1000);

  useEffect(() => {

    if (typeof window !== 'undefined' && (!patron.id || accountHtml.error)) {
      logOutFromEncoreAndCatalogIn();
      const fullUrl = encodeURIComponent(window.location.href);
      setTimeout(() => {
        window.location.replace(`${appConfig.loginUrl}?redirect_uri=${fullUrl}`);
      }, 0);
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

  // useEffect(() => {
  //   const now = new Date();
  //   now.setTime(now.getTime() + 5*60*1000)
  //   const inFive = now.toUTCString();
  //   document.cookie = `accountPageExp=${inFive}; expires=${inFive}`;
  //   setTimeout(() => {
  //     if (!document.cookie.includes('accountPageExp')) {
  //       logOutFromEncoreAndCatalogIn();
  //       setTimeout(() => {
  //         window.location.replace(appConfig.baseUrl);
  //       }, 0);
  //     }
  //   }, 5*60*1000);
  // })

  const resetCountdown = () => {
      const now = new Date();
      now.setTime(now.getTime() + 5*60*1000)
      const inFive = now.toUTCString();
      document.cookie = `accountPageExp=${inFive}; expires=${inFive}`;
      // setTime(5*60*1000);
  }

  // const countDown = () => {
  //   // console.log('time: ', time);
  //   // if (time > 0) {
  //   //   setTime(time - 1000);
  //   // }
  //   else if (document.cookie.includes('accountPageExp')) {
  //      // get time string
  //     const expTime = document.cookie
  //       .split(';')
  //       .find(el => el.includes('accountPageExp'))
  //       .split('=')[1];
  //     setTime(new Date().getTime() - new Date(expTime).getTime());
  //   }
  //   else {
  //     logOutAndRedirect()
  //   }
  // }

  useEffect(() => {
      if (typeof window !== 'undefined') {
      console.log('resetting');
      console.log('setting countdown');
      resetCountdown();
      // setInterval(countDown, 1000);
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
    <div className="nypl-ds nypl--research layout-container">
      <main className="main" id="mainContent">
        <AccountPageModal
          stayLoggedIn={resetCountdown}
          baseUrl={baseUrl}
        />
        <div className="content-header">
          <Breadcrumbs
            breadcrumbs={[
              { url: "htttps://www.nypl.org", text: "Home" },
              { url: "https://www.nypl.org/research", text: "Research" },
              { url: baseUrl, text: "Research Catalog" },
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
                <nav
                  className="sub-nav apply-brand-styles"
                  aria-label="sub-nav"
                >
                  <Link
                    className="sub-nav__link"
                    href={baseUrl}
                  >
                    Search
                  </Link> |&nbsp;
                  <Link
                    className="sub-nav__link"
                    href={`${baseUrl}/subject_headings`}
                  >
                    Subject Heading Explorer
                  </Link> |&nbsp;
                  <span
                    className="sub-nav__active-section"
                  >
                    My Account
                  </span>
                </nav>
              </>
            )}
            className="apply-brand-styles hero"
          />
        </div>
        <div className="content-primary page-content nypl-patron-page">
          <Heading
            level={2}
            id="2"
            text="My Account"
          />
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
        </div>
      </main>
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
