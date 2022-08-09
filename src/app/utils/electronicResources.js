import React from 'react'

const generateElectronicResourceLinks = (electronicResources) => {
  const electronicResourcesLink = ({ href, label }) => (
    <a
      href={href}
      target='_blank'
      onClick={() =>
        trackDiscovery(
          'Bib fields',
          `Electronic Resource - ${label} - ${href}`,
        )
      }
      rel='noreferrer'
    >
      {label || href}
    </a>
  );
  let electronicElem;

  // If there is only one electronic resource, then
  // just render a single anchor element.
  if (electronicResources.length === 1) {
    const electronicItem = electronicResources[0];
    electronicElem = electronicResourcesLink({
      href: electronicItem.url,
      label: electronicItem.label,
    });
  } else {
    // Otherwise, create a list of anchors.
    electronicElem = (
      <ul style={{ listStyle: 'none' }}
      >
        {electronicResources.map((resource) => (
          <li key={resource.label}>
            {electronicResourcesLink({
              href: resource.url,
              label: resource.label,
            })}
          </li>
        ))}
      </ul>
    )
  }

  return electronicElem
}

export default generateElectronicResourceLinks