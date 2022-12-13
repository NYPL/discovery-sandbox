import PropTypes from 'prop-types';
import React, { useState, createContext } from 'react';
import { useFeedbackBox } from '@nypl/design-system-react-components';
import { trackDiscovery } from '../utils/utils';

export const FeedbackBoxContext = createContext(null);
export const FeedbackBoxProvider = ({ children }) => {
  const [itemMetadata, setItemMetadata] = useState(null)
  const { FeedbackBox, isOpen, onOpen, onClose } = useFeedbackBox()
  const openFeedbackBox = () => {
    trackDiscovery('Feedback', 'Open')
    onOpen()
  }
  return (
    <FeedbackBoxContext.Provider value={{
      onOpen: openFeedbackBox, FeedbackBox, isOpen, onClose, itemMetadata, setItemMetadata
    }}> {children}</FeedbackBoxContext.Provider >
  );
};

FeedbackBoxProvider.propTypes = {
  children: PropTypes.node,
  value: PropTypes.object,
};
