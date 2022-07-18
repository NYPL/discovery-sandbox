import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  // ModalTrigger,
} from '@nypl/design-system-react-components';

const CancelConfirmationModal = ({
  itemToCancel,
  cancelItem,
  setItemToCancel,
}) => (
  // Todo
  <div className="research-modal cancel-confirmation">
    <div className="research-modal__content">
      <p>Cancel your hold on this item?</p>
      <p>{itemToCancel.title}</p>
      <div className="button-container">
        <Button
          buttonType="secondary"
          id="back-button"
          onClick={() => setItemToCancel(null)}
        >Back
        </Button>
        <Button
          buttonType="primary"
          id="confirm-button"
          onClick={cancelItem}
        >Confirm
        </Button>
      </div>
    </div>
  </div>
);

CancelConfirmationModal.propTypes = {
  itemToCancel: PropTypes.object,
  cancelItem: PropTypes.func,
  setItemToCancel: PropTypes.func,
};

export default CancelConfirmationModal;
