import { Box, Text, Link as DSLink } from '@nypl/design-system-react-components';
import React from 'react';

/**
 * Renders a simple link to log out the user out from the Catalog.
 */
const EDSLink = () => {
  return (
    <Box mt="s" mb="s">
      <Text size="body2" className="eds-link">
        <span style={{color: "var(--nypl-colors-ui-success-primary)"}}>New!</span> Try our <strong>Article Search</strong> to discover online journals, books, and more from home{" "}
        <DSLink href="https://research.ebsco.com/c/2styhb" target="_blank">with your library card</DSLink>.
      </Text>
    </Box>

  )
}


export default EDSLink;
