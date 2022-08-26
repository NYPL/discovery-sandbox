import React from 'react'
import { Link } from '@nypl/design-system-react-components'
import generateERLinksList from '../../utils/electronicResources'

const ElectronicResourcesSearch = ({ resources, onClick, bibUrl }) => {
  if (!resources.length) return null;
  return (
    <table className="nypl-basic-table">
      <caption className="hidden">Electronic Resources</caption>
      <thead>
        <th scope="col">Available Online</th>
      </thead>
      <tbody>
        {
          resources.length === 1 ?
            (
              <tr>
                <td>
                  { generateERLinksList(resources) }
                </td>
              </tr>
            ) :
            (
              <tr>
                <td>
                  <Link
                    onClick={onClick}
                    href={`${bibUrl}#electronic-resources`}
                  >
                    See All Available Online Resources
                  </Link>
                </td>
              </tr>
            )
        }
      </tbody>
    </table>
  )
}

export default ElectronicResourcesSearch
