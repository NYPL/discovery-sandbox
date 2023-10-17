/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';


import EDSLink from '../../src/app/components/EDSLink/EDSLink';

describe('EDSLink', () => {
  let component;

  before(() => {
    component = mount(<EDSLink />);
  });


  it('should have the right text', () => {
    const html = component.html();
    expect(html).to.include('<span>New!</span> Try our');
    expect(html).to.include('<strong>Article Search</strong>');
    expect(html).to.include('to discover online journals, books, and more from home with your library card.')
  });

  it('should have a link with the correct text and href', () => {
    const edsLink = component.find('a')
    expect(edsLink.text()).to.include('Article Search');
    expect(edsLink.prop('href')).to.equal(
      'https://research.ebsco.com/c/2styhb'
    );
  });
});
