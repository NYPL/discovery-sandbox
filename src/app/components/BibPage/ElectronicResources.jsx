import { Card, CardContent, CardHeading } from '@nypl/design-system-react-components'
import generateERLinks from '../../utils/electronicResources'
import React from 'react';

const ElectronicResources = ({ electronicResources }) => {
 const resources = generateERLinks(electronicResources)
  return (<Card isBordered padding="16px">
    <CardHeading level="three" id="no-img1-heading1">
      Available Online
    </CardHeading>
    <CardContent>
    {resources}
    </CardContent>
  </Card>)
}

export default ElectronicResources
