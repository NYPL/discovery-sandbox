import { Card, CardContent, CardHeading } from '@nypl/design-system-react-components'
import generateERLinksList from '../../utils/electronicResources'
import React from 'react';

/**
 * ElectronicResources renders a list of electronic resources links, sans aeon links
 * @param {array} electronicResources - an array of electronic resources, passed in as a prop from the BibPage component
 */
const ElectronicResources = ({ electronicResources, id }) => {
  if (!electronicResources || !electronicResources.length) {
    return null;
  }
  const resources = generateERLinksList(electronicResources)
  return (<Card isBordered padding="16px" id={id}>
    <CardHeading level="three" id="no-img1-heading1">
      Available Online
    </CardHeading>
    <CardContent>
      {resources}
    </CardContent>
  </Card>)
}

export default ElectronicResources
