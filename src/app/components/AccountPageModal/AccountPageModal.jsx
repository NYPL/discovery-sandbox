/* global window, document */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import {
  Button,
  ButtonTypes,
  Modal,
  Card,
} from '@nypl/design-system-react-components';

import { logOutFromEncoreAndCatalogIn } from '../../utils/logoutUtils';

const AccountPageModal = (props) => {

  const {
    stayLoggedIn,
    baseUrl,
  } = props;


  const [update, setUpdate] = useState(false);

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

  const open = minutes < 3;
  if (!open) return null;

  return (
    <Modal
      open={open}
      className={`accountPageModal ${open ? 'open' : ''}`}
    >
      <Card
        className="card"
      >
        Your session is about to time out
        <div className="timeDisplay">
          {`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`}
        </div>
        <hr />
        Do you want to stay logged in?
        <div className="buttonContainer">
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
      </Card>
    </Modal>
  );
};

export default AccountPageModal;
