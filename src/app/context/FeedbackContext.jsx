import PropTypes from 'prop-types';
import React, { useState, createContext } from 'react';
import { useFeedbackBox } from '@nypl/design-system-react-components';

export const FeedbackBoxContext = createContext(null);
export const FeedbackBoxProvider = ({ children }) => {
  const [callNumber, setCallNumber] = useState('')
  const { FeedbackBox, isOpen, onOpen, onClose } = useFeedbackBox()
  return (
    <FeedbackBoxContext.Provider value={{
      onOpen, FeedbackBox, isOpen, onClose, callNumber, setCallNumber
    }}> {children}</FeedbackBoxContext.Provider >
  );
};

FeedbackBoxProvider.propTypes = {
  children: PropTypes.node,
  value: PropTypes.object,
};
