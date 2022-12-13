import React, { useContext } from 'react'
import { FeedbackBoxContext } from '../../context/FeedbackContext'

const itemId = 12345678

const Feedback = () => {
  const { FeedbackBox, isOpen, onClose, onOpen } = useContext(FeedbackBoxContext)
  return <>
    <FeedbackBox
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      descriptionText='We are here to help!'
      title='Help and Feedback'
      showEmailField
      hiddenFields={{ itemId }}
      notificationText={`Call Number: ${itemId}`}
    />
  </>
}

export default Feedback
