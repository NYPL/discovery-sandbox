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

  console.log('rendering account page modal');

  const {
    // logOff,
    stayLoggedIn,
    baseUrl,
    // time,
  } = props;


  const [update, setUpdate] = useState(false);

  const logOutAndRedirect = () => {
    // logOutFromEncoreAndCatalogIn();
    setTimeout(() => {
      console.log('replacing with baseUrl');
      window.location.replace(baseUrl);
    }, 0);
  };

  let minutes;
  let seconds;

  // useEffect(() => {
  if (!document.cookie.includes('accountPageExp')) {
    logOutAndRedirect();
  } else {
    const expTime = document.cookie
      .split(';')
      .find(el => el.includes('accountPageExp'))
      .split('=')[1];


    const timeLeft = new Date(expTime).getTime() - new Date().getTime();
    console.log('expTime: ', expTime, timeLeft);

    setTimeout(() => {
      console.log('updating modal');
      setUpdate(!update);
    }, 1000);

    minutes = parseInt(timeLeft / (60 * 1000), 10);
    seconds = parseInt((timeLeft % (60 * 1000)) / 1000, 10);
  }
  // });

  console.log('minutes: ', minutes, typeof minutes, minutes < 3);

  return (
    <Modal
      open={minutes < 3}
      className={`modal ${minutes < 3 ? 'open' : ''}`}
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
