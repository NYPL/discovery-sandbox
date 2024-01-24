import { deleteCookie } from './cookieUtils';
import appConfig from '../data/appConfig';

/**
  * loadLogoutIframe(isTest)
  * The function that loads a temporary iframe with the log out endpoint
  * to completely log out the user from Encore and Catalog. It then deletes the iframe right away.
  * The reason to use this way to load the endpoint is to bypass the CORS loading from the client
  * since III does not want to provide us a real log out API URI.
  */
const loadLogoutIframe = (onload) => {
  const logoutIframe = document.createElement('iframe');
  const [body] = document.getElementsByTagName('body');

  // Determine whether to use Production or Test logout pages based on whether
  // 'dev-' appears in login URL
  const isProduction = !appConfig.loginUrl.includes('//dev-')
  const encoreDomain = isProduction ? 'browse.nypl.org' : 'nypl-encore-test.nypl.org'

  logoutIframe.setAttribute(
    // The endpoint is the URL for logging out from Encore
    'src', `https://${encoreDomain}/iii/encore/logoutFilterRedirect?suite=def`
  );
  // Assigns the ID for CSS ussage
  logoutIframe.setAttribute('id', 'logoutIframe');
  if (onload) {
    logoutIframe.onload = onload;
  }
  body.appendChild(logoutIframe);
};

/**
  * logoutRedirect (redirectUri)
  * Immediately enter Logout flow with optional redirectUri
  */
export const logoutViaRedirect = (redirectUri = '') => {
  window.location.replace(`${appConfig.logoutUrl}?redirect_uri=${redirectUri}`);
}

/**
  * logoutInIframe (cb)
  * The timer to delete log in related cookies and call the method to completely log out from Encore
  * and Catalog. It is called by setEncoreLoggedInTimer.
  */
export const logoutViaIframe = (onload) => {
  deleteCookie('PAT_LOGGED_IN');
  deleteCookie('VALID_DOMAIN_LAST_VISITED');
  deleteCookie('nyplIdentityPatron');
  loadLogoutIframe(onload);
};
