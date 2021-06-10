/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import config from '../../src/app/data/appConfig';

import AccountError from '../../src/app/components/AccountError/AccountError';

describe('AccountError', () => {
  let component;

  before(() => {
    component = shallow(<AccountError />);
  });

  it('should be wrapped in a .not-found-Error class', () => {
    expect(component.find('.not-found-404').length).to.equal(1);
  });

  it('should have the right text', () => {
    const html = component.html();
    expect(html).to.include('We&#x27;re sorry...');
    expect(html).to.include('Something went wrong loading your account information.');
    expect(html).to.include('Please try again in a few minutes');
  });
});
