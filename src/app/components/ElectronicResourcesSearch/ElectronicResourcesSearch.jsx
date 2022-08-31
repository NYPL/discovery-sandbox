import React from 'react'
import { Link } from 'react-router'
import generateERLinksList from '../../utils/electronicResources'
import {
  RightWedgeIcon,
} from '@nypl/dgx-svg-icons';

const ElectronicResourcesSearch = ({ resources, onClick, bibUrl }) => {
  if (!resources.length) return null;
  return (
    <section className="electronic-resources-search-section">
      <h3 className="electronic-resources-search-header">Available Online</h3>
          <Link
            onClick={onClick}
            to={
              resources.length === 1 ?
                resources[0].url  :
                `${bibUrl}#electronic-resources`

            }
            className="search-results-list-link"
          >
            {
              resources.length === 1 ?
                (resources[0].label || resources[0].url) :
                (
                  <>See All Available Online Resources <RightWedgeIcon /></>
                )
            }
          </Link>
    </section>
  )
}

export default ElectronicResourcesSearch
