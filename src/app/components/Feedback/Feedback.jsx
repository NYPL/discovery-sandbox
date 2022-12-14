import React, { useContext, useState } from 'react'
import axios from 'axios'

import { FeedbackBoxContext } from '../../context/FeedbackContext'
import { trackDiscovery } from '../../utils/utils';
import appConfig from '../../data/appConfig'

const Feedback = () => {
  const [screen, setScreen] = useState('form')
  const { FeedbackBox, isOpen, onClose, onOpen, itemMetadata, setItemMetadata } = useContext(FeedbackBoxContext)
  const closeAndResetItemMetadata = () => {
    if (itemMetadata) setItemMetadata(null)
    trackDiscovery('Feedback', 'Close');
    onClose()
  }
  const submitFeedback = async (metadataAndComment) => {
    trackDiscovery('Feedback', 'Submit')
    try {
      const res = await axios({
        method: 'POST',
        url: `${appConfig.baseUrl}/api/feedback`,
        data: metadataAndComment,
      })
      if (res.data.error) {
        console.error(res.data.error);
        return;
      }
      setScreen('confirmation')
    } catch (e) {
      console.error('Error posting feedback', e)
      setScreen('error')
    }
  }

  return <>
    <FeedbackBox
      onSubmit={submitFeedback}
      isOpen={isOpen}
      onClose={closeAndResetItemMetadata}
      onOpen={onOpen}
      descriptionText='We are here to help!'
      title='Help and Feedback'
      showEmailField
      hiddenFields={itemMetadata}
      notificationText={itemMetadata && itemMetadata.callNumber ? `Call Number: ${itemMetadata.callNumber}` : null}
      view={screen}
    />
  </>
}

export default Feedback
