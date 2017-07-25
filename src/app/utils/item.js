import Locations from '../../../locations.js';
import LocationCodes from '../../../locationCodes.js';
import {
  findWhere as _findWhere,
  isEmpty as _isEmpty,
} from 'underscore';

const itemSourceMappings = {
  SierraNypl: 'sierra-nypl',
  RecapCul: 'recap-cul',
  RecapPul: 'recap-pul',
};

function LibraryItem() {
  /**
   * getDefaultLocation()
   * Return the default delivery location for an item.
   * @return {object}
   */
  this.getDefaultLocation = () => ({
    '@id': 'loc:mal',
    prefLabel: 'Stephen A. Schwarzman Building - Rose Main Reading Room 315',
    customerCode: 'NH',
  });

  /**
   * defaultDeliveryLocations()
   * Temporarily return three hardcoded and default delivery locations.
   * @return {array}
   */
  this.defaultDeliveryLocations = () => [
    {
      '@id': 'loc:mal',
      prefLabel: 'Stephen A. Schwarzman Building - Rose Main Reading Room 315',
      customerCode: 'NH',
    },
    {
      '@id': 'loc:mai',
      prefLabel: 'Stephen A. Schwarzman Building - Milstein Microform Reading Room 119',
      customerCode: 'NF',
    },
    {
      '@id': 'loc:myr',
      prefLabel: 'Library of Performing Arts - Print Delivery Desk 3rd Floor',
      customerCode: 'NP',
    },
  ];

  /**
   * getIdentifiers(identifiersArray, neededTagsArray)
   * Gets into the array of the identifiers of an item. And then targets the identifiers we need
   * by the prefixes in neededTagsArray. At last, extracts the identifiers and returns them.
   *
   * @param {array} identifiersArray
   * @param {tagsArray} neededTagsArray
   * @return {object}
   */
  this.getIdentifiers = (identifiersArray, neededTagsArray) => {
    const identifierObj = {};

    identifiersArray.map(
      (i) => {
        if (typeof i === 'string') {
          neededTagsArray.map(
            (t) => {
              if (i.indexOf(t.name) !== -1) {
                identifierObj[t.name] = i.replace(t.value, '');
              }
            });
          }
        }
    );

    return identifierObj;
  };

  /**
   * mapItem(item, title)
   * Massage data and update an item's properties.
   * @param {object} item The item to update the data for.
   * @param {string} title The bib's title.
   * @return {object}
   */
  this.mapItem = (item = {}, title) => {
    const id = item && item['@id'] ? item['@id'].substring(4) : '';
    // Taking the first object in the accessMessage array.
    const accessMessage = item.accessMessage && item.accessMessage.length ?
      item.accessMessage[0] : {};
    // Taking first callNumber.
    const callNumber = item.shelfMark && item.shelfMark.length ? item.shelfMark[0] : '';
    const holdingLocation = this.getHoldingLocation(item);
    // Taking the first value in the array.
    const requestable = item.requestable && item.requestable.length ?
      item.requestable[0] : false;
    // Taking the first value in the array;
    const suppressed = item.suppressed && item.suppressed.length ?
      item.suppressed[0] : false;
    const isElectronicResource = this.isElectronicResource(item);
    // Taking the first status object in the array.
    let status = item.status && item.status.length ? item.status[0] : {};
    let availability = !_isEmpty(status) && status.prefLabel ?
      status.prefLabel.replace(/\W/g, '').toLowerCase() : '';
    const available = availability === 'available';
    let url = null;
    let actionLabel = null;
    let actionLabelHelper = null;
    // non-NYPL ReCAP
    const recap =
      (accessMessage.prefLabel === 'ADV REQUEST' || accessMessage.prefLabel === 'USE IN LIBRARY')
      && !item.holdingLocation;
    // nypl-owned ReCAP
    const nyplRecap = !!(holdingLocation && !_isEmpty(holdingLocation) &&
      holdingLocation['@id'].substring(4, 6) === 'rc');
    // The identifier we need for an item now
    const identifiersArray = [{ name: 'barcode', value: 'urn:barcode:' }];
    const bibIdentifiers = this.getIdentifiers(item.identifier, identifiersArray);
    const barcode = bibIdentifiers.barcode || '';
    const itemSource = item.idNyplSourceId ? item.idNyplSourceId['@type'] : undefined;
    const mappedItemSource = itemSourceMappings[itemSource];

    if (isElectronicResource && item.electronicLocator[0].url) {
      status = { '@id': '', prefLabel: 'Available' };
      availability = 'available';
      url = item.electronicLocator[0].url;
      actionLabel = 'View online';
      actionLabelHelper = `resource for ${title}`;
      // The logic for this should be updated, but right now non-NYPL ReCAP items
      // don't have a holdingLocation (but a default gets added here);
    } else if (recap) {
      actionLabel = accessMessage.prefLabel;
      actionLabelHelper = `request hold on ${title}`;
    } else if (nyplRecap) {
      // Temporary for NYPL ReCAP items.
      // Making sure that if there is a holding location, that the location code starts with
      // rc. Ids are in the format of `loc:x` where x is the location code.
      actionLabel = accessMessage.prefLabel;
      actionLabelHelper = `request hold on ${title}`;
    } else if (availability === 'available') {
      // For all items that we want to send to the Hold Request Form.
      url = this.getLocationHoldUrl(holdingLocation);
      actionLabel = 'Request for in-library use';
      actionLabelHelper = `for ${title} for use in library`;
    }

    return {
      id,
      status,
      availability,
      available,
      accessMessage,
      isElectronicResource,
      location: holdingLocation.prefLabel,
      callNumber,
      url,
      actionLabel,
      actionLabelHelper,
      requestable,
      suppressed,
      barcode,
      itemSource: mappedItemSource,
    };
  };

  /**
   * getItem(bib, itemId)
   * Look for specific item in the bib's item array. Return it if found.
   * @param {object} bib
   * @param {string} itemId
   * @return {array}
   */
  this.getItem = (bib, itemId) => {
    const items = (bib && bib.items) ? bib.items : [];

    if (itemId && items.length) {
      // Will return undefined if not found.
      const item = _findWhere(items, { '@id': `res:${itemId}` });
      if (item) {
        return this.mapItem(item, bib.title ? bib.title[0] : '');
      }
    }

    return undefined;
  };

  /**
   * getItems(bib)
   * Return an array of items with updated data properties.
   * @param {object} bib
   * @return {array}
   */
  this.getItems = (bib) => {
    const title = bib.title ? bib.title[0] : '';
    // filter out anything without a status or location
    const bibItems = bib && bib.items && bib.items.length ? bib.items : [];
    const finalItems = bibItems.map((item) => this.mapItem(item, title));

    // sort: physical available items, then electronic resources, then everything else
    // Update: Remove sorting for now.
    // finalItems.sort((a, b) => {
    //   let aAvailability = a.status === 'available' ? -1 : 1;
    //   let bAvailability = b.status === 'available' ? -1 : 1;
    //   if (a.isElectronicResource) aAvailability = 0;
    //   if (b.isElectronicResource) bAvailability = 0;
    //   return aAvailability - bAvailability;
    // });

    return finalItems;
  };

  /**
   * getLocationHoldUrl(location)
   * Maps each item's location to the Hold Request Form link and returns it.
   * @param {object} location
   * @return {string}
   */
  this.getLocationHoldUrl = (location) => {
    const holdingLocationId = location && location['@id'] ? location['@id'].substring(4) : '';
    let url = '';
    let shortLocation = 'schwarzman';

    if (holdingLocationId in LocationCodes) {
      shortLocation = LocationCodes[holdingLocationId].location;
    }

    switch (shortLocation) {
      case 'schwarzman':
        url = 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?&institution=' +
          '13777&type=1&language=1';
        break;
      case 'lpa':
        url = 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?&institution=' +
          '13252&type=1&language=1';
        break;
      case 'schomburg':
        url = 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?&institution=' +
          '13810&type=1&language=1';
        break;
      case 'sibl':
        url = 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?&institution=' +
          '13809&type=1&language=1';
        break;
      default:
        url = 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?&institution=' +
          '13777&type=1&language=1';
        break;
    }

    return url;
  };

  /**
   * getHoldingLocation(item)
   * Returns updated location data from the holdingLocation property in the API for each item.
   * @param {object} item
   * @return {object}
   */
  this.getHoldingLocation = (item) => {
    let location = this.getDefaultLocation();

    // this is a physical resource
    if (item.holdingLocation && item.holdingLocation.length) {
      location = item.holdingLocation[0];
    }
    // this is an electronic resource
    // else if (item.electronicLocator && item.electronicLocator.length) {
    //   location = item.electronicLocator[0];
    //   location['@id'] = '';
    // }

    return location;
  };

  /**
   * isElectronicResource(item)
   * Return if an item has an electronic resource.
   * @param {object} item
   * @return {boolean}
   */
  this.isElectronicResource = (item) => item.electronicLocator && item.electronicLocator.length;

  /**
   * isOffsite(prefLabel)
   * Return whether an item is offsite or not.
   * @param {string} prefLabel
   * @return {boolean}
   */
  this.isOffsite = (prefLabel = '') => prefLabel.substring(0, 7).toLowerCase() === 'offsite';

  /**
   * isNYPLReCAP(bibId)
   * Return whether an bib is an NYPL ReCAP bib. Checks to see that it is NOT a Princeton
   * or a Columbia ReCAP bib based on the bib's ID.
   * @param {string} bibId
   * @return {boolean}
   */
  this.isNYPLReCAP = (bibId = '') => (bibId.indexOf('pb') === -1) && (bibId.indexOf('cb') === -1);
}

export default new LibraryItem;
