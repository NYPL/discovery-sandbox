/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import LogoutLink from './../../src/app/components/LogoutLink/LogoutLink';
import { PatronProvider } from '../../src/app/context/PatronContext';

const mountLogoutLink = ({ loggedIn = false, delineate = false }) => mount(
  <PatronProvider patron={{ loggedIn }}>
    <LogoutLink delineate={delineate} />
  </PatronProvider>
);
// PB: Temporary fix to logout issue:
// const logoutLink = "https://login.nypl.org/auth/logout?redirect_uri=";
const logoutLink = 'https://ilsstaff.nypl.org/iii/cas/logout?url='

describe('LogoutLink', () => {
  it('does not render if patron is not logged in', () => {
    const component = mountLogoutLink({ loggedIn : false });

    expect(component.find('a').length).to.equal(0);
  });

  it('renders a link with "Log Out" text if patron is logged in', () => {
    const component = mountLogoutLink({ loggedIn : true });

    expect(component.find('a').length).to.equal(1);
    expect(component.find('a').text()).to.equal("Log Out");
  });

  it('optionally renders a pipe | delineator', () => {
    const component = mountLogoutLink({ loggedIn : true, delineate: true });

    // Note, the pipe is outside the <a> tag.
    expect(component.text()).to.equal(" | Log Out");
    expect(component.find('a').text()).to.equal("Log Out");
  });

  it('links to the logout url', () => {
    const component = mountLogoutLink({ loggedIn : true });

    expect(component.find('a').prop('href')).to.contain(logoutLink);
  });

  it('links to the logout url with the current location as the redirect param', () => {
    // Try a search results page.
    let currentLocation = 'http://localhost:3001/research/research-catalog/search?q=national%20geographic';
    Object.defineProperty(window.location, 'href', {
      writable: true,
      value: currentLocation
    });
    let component = mountLogoutLink({ loggedIn : true });

    expect(component.find('a').prop('href')).to.equal(`${logoutLink}${currentLocation}`);

    // Try a bib page.
    currentLocation = 'http://localhost:3001/research/research-catalog/bib/pb5579193';
    Object.defineProperty(window.location, 'href', {
      writable: true,
      value: currentLocation
    });
    component = mountLogoutLink({ loggedIn : true });

    expect(component.find('a').prop('href')).to.equal(`${logoutLink}${currentLocation}`);

    // Try a SHEP page.
    currentLocation = 'http://localhost:3001/research/research-catalog/subject_headings/74a55648-e93a-4f5f-98fe-1740c4c9c8e8';
    Object.defineProperty(window.location, 'href', {
      writable: true,
      value: currentLocation
    });
    component = mountLogoutLink({ loggedIn : true });

    expect(component.find('a').prop('href')).to.equal(`${logoutLink}${currentLocation}`);
  });

  it('links to the logout url with the homepage as the redirect param on hold and account pages', () => {
    const originUrl = 'http://localhost:3001';
    const homepageUrl = `${originUrl}/research/research-catalog/`;
    // Mock the origin property as localhost.
    Object.defineProperty(window.location, 'origin', {
      writable: true,
      value: originUrl
    });

    // Try a hold page.
    let currentLocation = 'http://localhost:3001/research/research-catalog/hold/request/cb7891544-ci7911509';
    Object.defineProperty(window.location, 'href', {
      writable: true,
      value: currentLocation
    });
    let component = mountLogoutLink({ loggedIn : true });

    expect(component.find('a').prop('href')).to.equal(`${logoutLink}${homepageUrl}`);

    // Try an account page.
    currentLocation = 'http://localhost:3001/research/research-catalog/account';
    Object.defineProperty(window.location, 'href', {
      writable: true,
      value: currentLocation
    });
    component = mountLogoutLink({ loggedIn : true });

    expect(component.find('a').prop('href')).to.equal(`${logoutLink}${homepageUrl}`);
  });
});
