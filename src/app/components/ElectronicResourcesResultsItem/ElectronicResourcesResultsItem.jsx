import React from 'react'
import { Link } from 'react-router'
import {
  RightWedgeIcon,
} from '@nypl/dgx-svg-icons';
import { Heading } from '@nypl/design-system-react-components';


/**
 React component for displaying links to electronic resources on the
 Search Results page
 */

const ElectronicResourcesResultsItem = ({ resources, onClick, bibUrl }) => {
  if (!resources.length) return null;
  return (
    <section className="electronic-resources-search-section">
      <Heading
        level="three"
        className="electronic-resources-search-header"
        id="available-online-heading"
      >
        Available Online
      </Heading>
        {
          resources.length === 1 ?
            <a
              href={resources[0].url}
              onClick={onClick}
              className="search-results-list-link"
            >
              {resources[0].label || resources[0].url}
            </a> :
            <Link
              onClick={onClick}
              to={
                `${bibUrl}#electronic-resources`
              }
              className="search-results-list-link"
            >
              {
                <>See All Available Online Resources <RightWedgeIcon /></>
              }
            </Link>
        }
    </section>
  )
}

export default ElectronicResourcesResultsItem
