import React from 'react';
import { Link } from 'react-router';
import { Link as DSLink } from '@nypl/design-system-react-components';
import { RightWedgeIcon } from '@nypl/dgx-svg-icons';
import { Heading, Text } from '@nypl/design-system-react-components';

/**
 React component for displaying links to electronic resources on the
 Search Results page
 */

const ElectronicResourcesResultsItem = ({ resources, onClick, bibUrl }) => {
  if (!resources.length) return null;
  return (
    <section className='electronic-resources-search-section'>
      <Heading
        level='three'
        size='callout'
        className='electronic-resources-search-header'
        id='available-online-heading'
        fontWeight='bold'
      >
        Available Online
      </Heading>
      {resources.length === 1 ? (
        <DSLink
          href={resources[0].url}
          onClick={onClick}
          target='_blank'
          rel='noreferrer'
          className='search-results-single-resource-link'
        >
          {resources[0].label || resources[0].url}
        </DSLink>
      ) : (
        <Link
          onClick={onClick}
          to={`${bibUrl}#electronic-resources`}
          className='search-results-list-link'
        >
          {
            <Text isBold size='caption'>
              See All Available Online Resources <RightWedgeIcon />
            </Text>
          }
        </Link>
      )}
    </section>
  );
};

export default ElectronicResourcesResultsItem;
