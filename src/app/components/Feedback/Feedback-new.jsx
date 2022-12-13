import React, { useContext } from 'react'

import { FeedbackBoxContext } from '../../context/FeedbackContext'
import { trackDiscovery } from '../../utils/utils';

const Feedback = () => {
  const { FeedbackBox, isOpen, onClose, onOpen, itemMetadata, setItemMetadata } = useContext(FeedbackBoxContext)
  const closeAndResetItemMetadata = () => {
    if (itemMetadata) setItemMetadata(null)
    trackDiscovery('Feedback', 'Close');
    onClose()
  }
  const submitFeedback = async (metadata) => {
    trackDiscovery('Feedback', 'Submit')
    try {
      const res = await axios({
        method: 'POST',
        url: `${appConfig.baseUrl}/api/feedback`,
        data: {
          fields,
        },
      })
      if (res.data.error) {
        console.error(res.data.error);
        return;
      }
    } catch (e) {
      console.error('Error posting feedback', e)
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
    />
  </>
}

export default Feedback
