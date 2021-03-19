import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonTypes,
  Modal,
  Card,
} from '@nypl/design-system-react-components';

const CancelConfirmationModal = ({
  itemToCancel,
  cancelItem,
  setItemToCancel,
}) => (
  <Modal className="scc-modal">
    <div className="scc-modal__content">
      <p>Cancel your hold on this item?</p>
      <p>{itemToCancel.title}</p>
      <Button
        buttonType={ButtonTypes.Secondary}
        onClick={() => setItemToCancel(null)}
      >Back
      </Button>
      <Button
        buttonType={ButtonTypes.Primary}
        onClick={cancelItem}
      >Confirm
      </Button>
    </div>
  </Modal>
);

CancelConfirmationModal.propTypes = {
  itemToCancel: PropTypes.object,
  cancelItem: PropTypes.func,
  setItemToCancel: PropTypes.func,
};

export default CancelConfirmationModal;
