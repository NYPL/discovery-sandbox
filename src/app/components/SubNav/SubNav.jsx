import React from 'react';
import { Link } from 'react-router';
import { Link as DSLink } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';

import appConfig from '../../data/appConfig';

const SubNavLink = ({ type, activeSection, href, children }) => {
  if (type === activeSection) {
    return (
      <span
        className="sub-nav__active-section"
      >
        {children}
      </span>
    );
  }

  return (
    <DSLink
      className="sub-nav__link"
    >
      <Link to={href}>{children}</Link>
    </DSLink>
  );
};

SubNavLink.propTypes = {
  type: PropTypes.string,
  activeSection: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.string,
};

const SubNav = (props) => {
  const { baseUrl } = appConfig;
  return (
    <nav
      className="sub-nav apply-brand-styles"
      aria-label="sub-nav"
    >
      <ul className="sub-nav__list">
        <SubNavLink
          type="search"
          href={appConfig.baseUrl}
          {...props}
        >
          Search
        </SubNavLink> |&nbsp;
        <SubNavLink
          type="shep"
          href={`${baseUrl}/subject_headings`}
          {...props}
        >
          Subject Heading Explorer
        </SubNavLink> |&nbsp;
        <SubNavLink
          type="account"
          href={`${baseUrl}/account`}
          {...props}
        >
          My Account
        </SubNavLink>
      </ul>
    </nav>
  );
};

export default SubNav;
