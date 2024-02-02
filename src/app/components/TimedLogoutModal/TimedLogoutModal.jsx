/* global window, document */
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@nypl/design-system-react-components';

import { logoutViaRedirect } from '../../utils/logoutUtils';
import { deleteCookie } from '../../utils/cookieUtils';

/**
 * This renders a modal interface based on an early version from the
 * Reservoir Design System through the `old-ds-modal` CSS class.
 */
const TimedLogoutModal = (props) => {
  const {
    stayLoggedIn,
    baseUrl,
  } = props;


  const [update, setUpdate] = React.useState(false);

  const logOutAndRedirect = () => {
    // If patron clicked Log Out before natural expiration of cookie,
    // explicitly delete it:
    deleteCookie('accountPageExp');

    const redirectUri = (typeof window !== 'undefined') ? `${window.location.origin}${baseUrl}` : '';
    logoutViaRedirect(redirectUri);
  };

  let minutes = 0;
  let seconds = 0;

  if (typeof document !== 'undefined' && !document.cookie.includes('accountPageExp')) {
    logOutAndRedirect();
  } else if (typeof document !== 'undefined') {
    const expTime = document.cookie
      .split(';')
      .find(el => el.includes('accountPageExp'))
      .split('=')[1];

    const timeLeft = (new Date(expTime).getTime() - new Date().getTime()) / 1000;

    React.useEffect(() => {
      const timeout = setTimeout(() => {
        setUpdate(!update);
      }, 1000);

      return () => {
        clearTimeout(timeout);
      };
    });

    minutes = Math.max(parseInt(timeLeft / 60), 0);
    seconds = Math.max(parseInt(timeLeft % 60), 0);
  }

  // Show warning when 2m remaining:
  const open = minutes < 2;
  if (!open) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
    <div tabIndex="0" className="research-modal timed-logout old-ds-modal">
      <div className="research-modal__content">
        <p>
          Your session is about to expire
          <span className="time-display">
            {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
          </span>
        </p>
        <hr />
        Do you want to stay logged in?
        <div className="button-container">
          <Button
            buttonType="secondary"
            onClick={logOutAndRedirect}
            id="logoff-button"
          >
            Log off
          </Button>
          <Button
            onClick={stayLoggedIn}
            id="logged-in-button"
          >
            Stay logged in
          </Button>
        </div>
      </div>
    </div>
  );
};

TimedLogoutModal.propTypes = {
  stayLoggedIn: PropTypes.func,
  baseUrl: PropTypes.string,
};

export default TimedLogoutModal;
