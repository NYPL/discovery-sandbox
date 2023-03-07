import { Link as DSLink } from '@nypl/design-system-react-components';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';

import { PatronContext } from '../../context/PatronContext';
import { trackDiscovery } from '../../utils/utils';

/**
 * Renders a simple link to log out the user out from the Catalog.
 */
const LogoutLink = ({
  baseUrl = '/research/research-catalog',
  delineate = false
}) => {
  // PB: Temporary fix to logout issue:
  // const logoutLink = "https://login.nypl.org/auth/logout?redirect_uri=";
  const logoutLink = 'https://ilsstaff.nypl.org/iii/cas/logout?url='
  const [backLink, setBackLink] = useState('');
  const { loggedIn } = useContext(PatronContext);

  useEffect(() => {
    const currentUrl = window.location.href;

    // If the patron is on any hold or account page, then
    // redirect them to the home page after logging out.
    if (currentUrl.includes('hold') || currentUrl.includes('account')) {
      setBackLink(`${window.location.origin}${baseUrl}/`);
    } else {
      // Otherwise, redirect back to the current page after logging out.
      setBackLink(window.location.href);
    }
  }, [baseUrl]);

  if (!loggedIn) return null;

  return (
    <>
      {delineate ? <>&nbsp;|&nbsp;</> : null}
      <DSLink
        onClick={() => trackDiscovery("Click", "Log Out")}
        href={`${logoutLink}${backLink}`}
        sx={{
          color: 'ui.white', textDecoration: 'none',
          _focus: { textDecoration: 'underline' },
        }}
      >
        Log Out
      </DSLink>
    </>
  );
};

LogoutLink.propTypes = {
  baseUrl: PropTypes.string,
  delineate: PropTypes.bool,
};

export default LogoutLink;
