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

  logoutIframe.setAttribute(
    // The endpoint is the URL for logging out from Encore
    'src', isProduction ? 'https://browse.nypl.org/iii/encore/logoutFilterRedirect?suite=def' :
      'https://nypl-encore-test.nypl.org//iii/encore/logoutFilterRedirect?suite=def',
  );
  // Assigns the ID for CSS ussage
  logoutIframe.setAttribute('id', 'logoutIframe');
  if (onload) {
    logoutIframe.onload = onload;
  }
  body.appendChild(logoutIframe);
};

/**
  * logOutFromEncoreAndCatalogIn(time, isTest)
  * The timer to delete log in related cookies and call the method to completely log out from Encore
  * and Catalog. It is called by setEncoreLoggedInTimer.
  */
export const logOutFromEncoreAndCatalogIn = (onload) => {
  deleteCookie('PAT_LOGGED_IN');
  deleteCookie('VALID_DOMAIN_LAST_VISITED');
  deleteCookie('nyplIdentityPatron');
  loadLogoutIframe(onload);
};
