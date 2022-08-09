import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@nypl/design-system-react-components';

/**
 * This renders a modal interface based on an early version from the
 * Reservoir Design System through the `old-ds-modal` CSS class.
 */
const CancelConfirmationModal = ({
  itemToCancel,
  cancelItem,
  setItemToCancel,
}) => (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <div tabIndex="0" className="research-modal cancel-confirmation old-ds-modal">
    <div className="research-modal__content">
      <p>Cancel your hold on this item?</p>
      <p>{itemToCancel.title}</p>
      <div className="button-container">
        <Button
          buttonType="secondary"
          id="back-button"
          onClick={() => setItemToCancel(null)}
        >
          Back
        </Button>
        <Button
          id="confirm-button"
          onClick={cancelItem}
        >
          Confirm
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
