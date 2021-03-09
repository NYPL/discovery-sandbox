/* global window, document */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types'
import {
  Button,
  ButtonTypes,
  Modal,
  Card,
} from '@nypl/design-system-react-components';

const AccountPageModal = (props) => {
  return (
    <Modal
      open
      className="modal"
    >
      <Card
        className="card"
      >
        Your session is about to time out
        <hr />
        Do you want to stay logged in?
        <div className="buttonContainer">
          <Button
            buttonType={ButtonTypes.Secondary}
            className="button"
          >
            Log off
          </Button>
          <Button
            buttonType={ButtonTypes.Primary}
            className="button"
            >
            Stay logged in
          </Button>
        </div>
      </Card>
    </Modal>
  );
};

export default AccountPageModal;
