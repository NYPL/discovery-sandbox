import React from "react";
import { Link } from "react-router";
import { Link as DSLink } from "@nypl/design-system-react-components";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import appConfig from "../../data/appConfig";

const SubNavLink = ({ type, activeSection, href, children }) => (
  <DSLink
    className={`sub-nav__link${
      type === activeSection ? " active-section" : ""
    }`}
  >
    <Link to={href}>{children}</Link>
  </DSLink>
);

SubNavLink.propTypes = {
  type: PropTypes.string,
  activeSection: PropTypes.string,
  href: PropTypes.string,
  children: PropTypes.string,
};

const SubNav = (props) => {
  const features = useSelector((state) => state.features);
  const { baseUrl } = appConfig;
  return (
    <nav className="sub-nav" aria-label="sub-nav">
      <ul className="sub-nav__list">
        <SubNavLink type="search" href={`${baseUrl}/`} {...props}>
          Search
        </SubNavLink>
        &nbsp;|&nbsp;
        <SubNavLink type="shep" href={`${baseUrl}/subject_headings`} {...props}>
          Subject Heading Explorer
        </SubNavLink>
        {features.includes("my-account") ? (
          <>
            &nbsp;|&nbsp;
            <SubNavLink type="account" href={`${baseUrl}/account`} {...props}>
              My Account
            </SubNavLink>
          </>
        ) : null}
      </ul>
    </nav>
  );
};

export default SubNav;
