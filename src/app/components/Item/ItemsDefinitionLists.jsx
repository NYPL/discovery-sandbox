import React from 'react';
import { isArray as _isArray, isEmpty as _isEmpty } from 'underscore';
import StatusLinks from './StatusLinks';
import appConfig from '../../data/appConfig'

const ItemsDefinitionLists = ({ items, holdings, bibId, id, searchKeywords, page }) => {

  console.log('rendering items definition lists')
  if (
    !_isArray(items) ||
    !items.length ||
    items.every(item => item.isElectronicResource)
  ) {
    console.log('all items invalid')
    return null;
  }

  return (
    <div key={`${bibId}-items`} id={`${bibId}-items`} className="items-definition-list">
      {
        items.map(item => {

            if (_isEmpty(item)) {
              console.log('item is empty')
              return null;
            }

            if (item.isElectronicResource) {
              console.log('item is electronic')
              return null;
            }

            let itemLocation;
            if (item.location && item.locationUrl) {
              itemLocation = (
                <a href={item.locationUrl} className="itemLocationLink">{item.location}</a>
              );
            } else if (item.location) {
              itemLocation = item.location;
            } else {
              itemLocation = ' ';
            }

            console.log('redering item')

            return (
              <div key={`item-${item.id}-div`} id={`item-${item.id}-div`}>
                <dl key={`item-${item.id}-dl`} id={`item-${item.id}-dl`}>
                <dt key={`item-${item.id}-format-dt`} id={`item-${item.id}-format-dt`}>Format</dt>
                <dd key={`item-${item.id}-format-dd`} id={`item-${item.id}-format-dd`}>{item.format || ' '}</dd>
                <dt key={`item-${item.id}-callnumber-dt`} id={`item-${item.id}-callnumber-dt`}>Call Number</dt>
                <dd key={`item-${item.id}-callnumber-dd`} id={`item-${item.id}-callnumber-dd`}>{item.callNumber || ' '}</dd>
                <dt key={`item-${item.id}-location-dt`} id={`item-${item.id}-location-dt`}>Item Location</dt>
                <dd key={`item-${item.id}-location-dd`} id={`item-${item.id}-location-dd`}>{itemLocation}</dd>
                </dl>
                {
                  page === 'SearchResults' &&
                  <StatusLinks
                    item={item}
                    bibId={bibId}
                    searchKeywords={searchKeywords}
                    appConfig={appConfig}
                    page={page}
                  />
                }
              </div>
            )
        })
      }
    </div>
  )
}

export default ItemsDefinitionLists;
