import { Card, CardContent, CardHeading, Button, Icon } from '@nypl/design-system-react-components'
import generateERLinksList from '../../utils/electronicResources'
import React, { useRef, useState } from 'react';

/**
 * ElectronicResources renders a list of electronic resources links, sans aeon links
 * @param {array} electronicResources - an array of electronic resources, passed in as a prop from the BibPage component

 * @param {boolean} isTestMode - a boolean value only used while running unit tests on this component
 * @param {string} id
 */

const ElectronicResources = ({ electronicResources, isTestMode = false, id }) => {
  const defaultNumResources = 3
  const [showMore, setShowMore] = useState(true)
  const [electronicResourcesToDisplay, setElectronicResourcesToDisplay] = useState(electronicResources && electronicResources.slice(0, defaultNumResources));
  const scrollToRef = useRef();

  if (!electronicResources || !electronicResources.length) {
    return null;
  }

  const resources = generateERLinksList(electronicResourcesToDisplay)
  const more = `all ${electronicResources.length}`
  const less = 'fewer'

  const onClick = () => {
    if (!isTestMode) scrollToRef.current.scrollIntoView({ behavior: 'smooth' })
    setShowMore((prev) => {
      setElectronicResourcesToDisplay(prev ? electronicResources : electronicResources.slice(0, defaultNumResources))
      return !prev
    })
  }

  return (
    <Card ref={scrollToRef} isBordered padding="16px" id={id}>
      <CardHeading level="three" id="no-img1-heading1">
        Available Online
      </CardHeading>
      <CardContent>
        {resources}
        {electronicResources.length > defaultNumResources ?
          <Button textDecoration='none' border='none' id='see-more-button' onClick={onClick} buttonType='link'>
            See {showMore ? more : less} resources
            <Icon style={{ marginLeft: '5px' }} iconRotation={`rotate${showMore ? 0 : 180}`} name="arrow" size="small" />
          </Button> : null}
      </CardContent>
  </Card>
  )
}

export default ElectronicResources
