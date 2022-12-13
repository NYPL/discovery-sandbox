import PropTypes from 'prop-types';
import React from 'react';
import { useFeedbackBox } from '@nypl/design-system-react-components';

export const FeedbackBoxContext = React.createContext(null);
export const FeedbackBoxProvider = ({ children, }) => {
  const { FeedbackBox, isOpen, onOpen, onClose } = useFeedbackBox()
  return (
    <FeedbackBoxContext.Provider value={{
      onOpen, FeedbackBox, isOpen, onClose
    }}> {children}</FeedbackBoxContext.Provider >
  );
};

FeedbackBoxProvider.propTypes = {
  children: PropTypes.node,
  value: PropTypes.object,
};
