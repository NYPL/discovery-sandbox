import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
} from '@nypl/design-system-react-components';

const CancelConfirmationModal = ({
  itemToCancel,
  cancelItem,
  setItemToCancel,
}) => (
  <Modal className="research-modal cancel-confirmation">
    <div className="research-modal__content">
      <p>Cancel your hold on this item?</p>
      <p>{itemToCancel.title}</p>
      <div className="button-container">
        <Button
          buttonType="secondary"
          id="cancel-hold-btn"
          onClick={() => setItemToCancel(null)}
        >Back
        </Button>
        <Button id="confirm-modal-btn" onClick={cancelItem}>Confirm</Button>
      </div>
    </div>
  </Modal>
);

CancelConfirmationModal.propTypes = {
  itemToCancel: PropTypes.object,
  cancelItem: PropTypes.func,
  setItemToCancel: PropTypes.func,
};

export default CancelConfirmationModal;
