import React from 'react'
import { Link } from '@nypl/design-system-react-components'


/**
 * Builds unordered list of electronic resources links 
 * @param {array} electronicResources - an array of electronic resources, passed in as a prop from the ElectronicResources component
 */
const generateElectronicResourceLinksList = (electronicResources) => {
  if (!electronicResources) return null
  const electronicResourcesLink = ({ href, label, prefLabel }) => (
    <Link
      href={href}
      target='_blank'
      rel='noreferrer'
    >
      {label || prefLabel || href}
    </Link>
  );
  let electronicElem;

  // If there is only one electronic resource, then
  // just render a single anchor element.
  if (electronicResources.length === 1) {
    const electronicItem = electronicResources[0];
    electronicElem = electronicResourcesLink({
      href: electronicItem.url,
      label: electronicItem.label || electronicItem.prefLabel,
    });
  } else {
    // Otherwise, create a list of anchors.
    electronicElem = (
      <ul style={{ listStyle: 'none' }}
      >
        {electronicResources.map((resource) => (
          <li key={resource.label} style = {{ marginTop: 10, marginBottom:10 }}>
            {electronicResourcesLink({
              href: resource.url,
              label: resource.label || resource.prefLabel,
            })}
          </li>
        ))}
      </ul>
    )
  }

  return electronicElem
}

export default generateElectronicResourceLinksList