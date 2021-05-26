/**
  * setCookieWithExpiration(sKey, expiration, value)
  * set a cookie
  * @param {string} sKey - The name of the cookie
  * @param {string} expiration - when to expire the cookie. Defaults to immediately expire
  * @param {string} value - The value of the cookie, defaults to an empty string
  */

const setCookieWithExpiration = (sKey, expiration, value = '') => {
  document.cookie = `${sKey}=${value}; expires=${expiration || 'Thu, 01 Jan 1970 00:00:00 UTC'}; ` +
      'path=/; domain=.nypl.org;';
};

/**
   * deleteCookie(sKey)
   * Delete the cookie by having it expired.
   *
   * @param {string} sKey - The name of the cookie to be looked up.
   */
const deleteCookie = sKey => setCookieWithExpiration(sKey, null);

export {
  deleteCookie,
  setCookieWithExpiration,
};
