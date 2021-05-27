/* eslint-env mocha */
/* global document */

import {
  deleteCookie,
  setCookieWithExpiration,
} from '../../src/app/utils/cookieUtils';


describe.only('setCookieWithExpiration', () => {
  it('should set cookie when key, value, and expiration are given', () => {
    setCookieWithExpiration('key1', 'Wed, 26 May 2021 20:51:15 GMT', 'value1');
    console.log('document 1 ', document.cookie);
  });

  it('should default to empty string when not given a value', () => {
    setCookieWithExpiration('key2', 'Wed, 26 May 2021 20:51:15 GMT');
    console.log('document 2 ', document.cookie);
  });

  it('should default to immediate expiration when not given expiration', () => {
    setCookieWithExpiration('key3');
    console.log('document 3 ', document.cookie);
  });
});

describe('deleteCookie', () => {
  it('should delete the appropriate cookie');
});
