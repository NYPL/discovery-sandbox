/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import config from '../../src/app/data/appConfig';

import Account404 from '../../src/app/components/Account404/Account404';

describe('Account404', () => {
  let component;

  before(() => {
    component = shallow(<Account404 />);
  });

  it('should be wrapped in a .not-found-404 class', () => {
    expect(component.find('.not-found-404').length).to.equal(1);
  });

  it('should have the right text', () => {
    const html = component.html();
    expect(html).to.include('404 Not Found');
    expect(html).to.include('We&#x27;re sorry...');
    expect(html).to.include('Something went wrong loading your account information.');
    expect(html).to.include('Please try again in a few minutes');
  });
});
