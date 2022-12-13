import React, { useContext } from 'react'
import { FeedbackBoxContext } from '../../context/FeedbackContext'

const Feedback = () => {
  const { FeedbackBox, isOpen, onClose, onOpen, callNumber, setCallNumber } = useContext(FeedbackBoxContext)
  const closeAndResetCallNumber = () => {
    if (callNumber) setCallNumber('')
    onClose()
  }
  return <>
    <FeedbackBox
      isOpen={isOpen}
      onClose={closeAndResetCallNumber}
      onOpen={onOpen}
      descriptionText='We are here to help!'
      title='Help and Feedback'
      showEmailField
      hiddenFields={{ callNumber }}
      notificationText={callNumber ? `Call Number: ${callNumber}` : null}
    />
  </>
}

export default Feedback
