/* global window, document */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonTypes,
  Modal,
  Card,
} from '@nypl/design-system-react-components';

import { logOutFromEncoreAndCatalogIn } from '../../utils/logoutUtils';

const TimedLogoutModal = (props) => {
  const {
    stayLoggedIn,
    baseUrl,
  } = props;


  const [update, setUpdate] = React.useState(false);

  const logOutAndRedirect = () => {
    logOutFromEncoreAndCatalogIn(() => {
      window.location.replace(baseUrl);
    });
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

    const timeLeft = new Date(expTime).getTime() - new Date().getTime();

    setTimeout(() => {
      setUpdate(!update);
    }, 1000);

    minutes = parseInt(timeLeft / (60 * 1000), 10);
    seconds = parseInt((timeLeft % (60 * 1000)) / 1000, 10);
  }

  const open = minutes < 2;
  if (!open) return null;

  return (
    <Modal
      open
      className="research-modal timed-logout"
    >
      <div className="research-modal__content">
        <p>
          Your session is about to time out
          <span className="time-display">
            {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
          </span>
        </p>
        <hr />
        Do you want to stay logged in?
        <div className="button-container">
          <Button
            buttonType={ButtonTypes.Secondary}
            className="button"
            onClick={logOutAndRedirect}
          >
            Log off
          </Button>
          <Button
            buttonType={ButtonTypes.Primary}
            className="button"
            onClick={stayLoggedIn}
          >
            Stay logged in
          </Button>
        </div>
      </div>
    </Modal>
  );
};

TimedLogoutModal.propTypes = {
  stayLoggedIn: PropTypes.func,
  baseUrl: PropTypes.string,
};

export default TimedLogoutModal;
