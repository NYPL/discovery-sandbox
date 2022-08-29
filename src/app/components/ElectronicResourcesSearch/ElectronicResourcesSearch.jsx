import React from 'react'
import { Link } from '@nypl/design-system-react-components'
import generateERLinksList from '../../utils/electronicResources'
import {
  RightWedgeIcon,
} from '@nypl/dgx-svg-icons';

const ElectronicResourcesSearch = ({ resources, onClick, bibUrl }) => {
  if (!resources.length) return null;
  return (
    <section className="electronic-resources-search-section">
      <h3 className="electronic-resources-search-header">Available Online</h3>
        {
          resources.length === 1 ?
            (
                generateERLinksList(resources)
            ) :
            (
                <Link
                  onClick={onClick}
                  href={`${bibUrl}#electronic-resources`}
                  className="search-results-list-link"
                >
                  See All Available Online Resources <RightWedgeIcon />
                </Link>
            )
        }
    </section>
  )
}

export default ElectronicResourcesSearch
