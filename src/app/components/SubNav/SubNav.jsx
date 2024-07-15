import React from 'react';
import { Link } from 'react-router';
import { Link as DSLink } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import LogoutLink from '../LogoutLink/LogoutLink';
import appConfig from '../../data/appConfig';

const SubNavLink = ({ type, activeSection, href, children, reverseProxyEnabled }) => {
  return (reverseProxyEnabled ?
    <DSLink
      className={`sub-nav__link${type === activeSection ? ' active-section' : ''}`}
      href={href}
    >{children}</DSLink> :
    <DSLink
      className={`sub-nav__link${type === activeSection ? ' active-section' : ''}`}
    ><Link to={href}>{children}</Link></DSLink>
  )
};

SubNavLink.propTypes = {
  type: PropTypes.string,
  activeSection: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.string,
  reverseProxyEnabled: PropTypes.bool
};

const SubNav = (props) => {
  const features = useSelector(state => state.features);
  const { baseUrl, reverseProxyEnabled } = appConfig;

  return (
    <nav
      className="sub-nav"
      aria-label="sub-nav"
    >
      <ul className="sub-nav__list">
        <SubNavLink
          type="search"
          href={`${baseUrl}/`}
          reverseProxyEnabled={reverseProxyEnabled}
          {...props}
        >
          Search
        </SubNavLink>&nbsp;|&nbsp;
        <SubNavLink
          type="shep"
          href={`${baseUrl}/subject_headings`}
          {...props}
        >
          Subject Heading Explorer
        </SubNavLink>
        {
          features.includes('my-account') ? (
            <>
              &nbsp;|&nbsp;
              <SubNavLink
                type="account"
                href={`${baseUrl}/account`}
                reverseProxyEnabled={reverseProxyEnabled}
                {...props}
              >
                My Account
              </SubNavLink>
            </>
          ) : null
        }
        <LogoutLink baseUrl={baseUrl} delineate />
      </ul>
    </nav>
  );
};

export default SubNav;
