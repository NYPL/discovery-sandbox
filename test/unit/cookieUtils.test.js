/* eslint-env mocha */
/* global document */
import { expect } from 'chai';

import {
  deleteCookie,
  setCookieWithExpiration,
} from '../../src/app/utils/cookieUtils';

describe('setCookieWithExpiration', () => {
  it('should set cookie when key, value, and expiration are given', () => {
    setCookieWithExpiration('key1', 'Wed, 26 May 2089 20:51:15 GMT', 'value1');
    expect(document.cookie).to.include('key1=value1');
  });

  it('should default to empty string when not given a value', () => {
    setCookieWithExpiration('key2', 'Wed, 26 May 2089 20:51:15 GMT');
    setCookieWithExpiration('key3', 'Wed, 26 May 2089 20:51:15 GMT');
    expect(document.cookie).to.include('key2=;');
  });

  it('should default to immediate expiration when not given expiration', () => {
    setCookieWithExpiration('key1');
    expect(document.cookie).not.to.include('key1');
  });
});

describe('deleteCookie', () => {
  it('should delete the appropriate cookie', () => {
    setCookieWithExpiration('key1', 'Wed, 26 May 2089 20:51:15 GMT', 'value1');
    deleteCookie('key1');
    expect(document.cookie).not.to.include('key1');
  });
});
