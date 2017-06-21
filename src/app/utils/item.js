import Locations from '../../../locations.js';
import LocationCodes from '../../../locationCodes.js';
import {
  isEmpty as _isEmpty,
  findWhere as _findWhere,
} from 'underscore';

function LibraryItem() {
  /**
   * getDefaultLocation()
   * Return the default delivery location for an item.
   * @return {object}
   */
  this.getDefaultLocation = () => ({
    '@id': 'loc:mal',
    prefLabel: 'Stephen A. Schwarzman Building - Rose Main Reading Room 315',
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
    },
    {
      '@id': 'loc:mai',
      prefLabel: 'Stephen A. Schwarzman Building - Milstein Microform Reading Room 119',
    },
    {
      '@id': 'loc:myr',
      prefLabel: 'Library of Performing Arts - Print Delivery Desk 3rd Floor',
    },
  ];

  /**
   * getItem(bib, itemId)
   * Look for specific item in the bib's item array. Return it if found.
   * @param {object} bib
   * @param {string} itemId
   * @return {object}
   */
  this.getItem = (bib, itemId) => {
    const items = (bib && bib.items) ? bib.items : [];

    if (itemId && items.length) {
      // Will return undefined if not found.
      return _findWhere(items, { '@id': `res:${itemId}` });
    }

    return undefined;
  };

  /**
   * getItems(record)
   *
   * @param {Object} record
   * @return {Object}
   */
  this.getItems = (record) => {
    const recordTitle = record.title ? record.title[0] : '';
    // filter out anything without a status or location
    const rItems = record && record.items && record.items.length ? record.items : [];
    const items = rItems
      .filter((item) => item.status || item.electronicLocator)
      // map items
      .map((item) => {
        const id = item['@id'].substring(4);
        let status = item.status && item.status[0].prefLabel ? item.status[0].prefLabel : '';
        let availability = status.replace(/\W/g, '').toLowerCase();
        let accessMessage = item.accessMessage && item.accessMessage.length ?
          item.accessMessage[0].prefLabel.toLowerCase() : '';
        const callNumber = item.shelfMark && item.shelfMark.length ? item.shelfMark[0] : '';
        const locationDetails = this.getLocationDetails(item);
        let url = null;
        let actionLabel = null;
        let actionLabelHelper = null;
        let requestHold = false;
        const isElectronicResource = this.isElectronicResource(item);

        if (isElectronicResource && item.electronicLocator[0].url) {
          status = 'Available';
          availability = 'available';
          url = item.electronicLocator[0].url;
          actionLabel = 'View online';
          actionLabelHelper = `resource for ${recordTitle}`;
          // Temporary for ReCAP items.
        } else if (accessMessage === 'adv request' && !item.holdingLocation) {
          requestHold = true;
          actionLabel = accessMessage;
          actionLabelHelper = `request hold on ${recordTitle}`;
          // Temporary for NYPL ReCAP items.
          // Making sure that if there is a holding location, that the location code starts with
          // rc. Ids are in the format of `loc:x` where x is the location code.
        } else if (item.holdingLocation && item.holdingLocation.length &&
          item.holdingLocation[0]['@id'].substring(4, 6) === 'rc') {
          requestHold = true;
          actionLabel = accessMessage;
          actionLabelHelper = `request hold on ${recordTitle}`;
        } else if (availability === 'available') {
          url = this.getLocationHoldUrl(locationDetails);
          actionLabel = 'Request for in-library use';
          actionLabelHelper = `for ${recordTitle} for use in library`;
        }

        return {
          id,
          status,
          availability,
          available: (availability === 'available'),
          accessMessage,
          isElectronicResource,
          location: locationDetails.prefLabel,
          callNumber,
          url,
          actionLabel,
          actionLabelHelper,
          requestHold,
        };
      });

    // sort: physical available items, then electronic resources, then everything else
    items.sort((a, b) => {
      let aAvailability = a.status === 'available' ? -1 : 1;
      let bAvailability = b.status === 'available' ? -1 : 1;
      if (a.isElectronicResource) aAvailability = 0;
      if (b.isElectronicResource) bAvailability = 0;
      return aAvailability - bAvailability;
    });

    return items;
  };

  /**
   * getLocationHoldUrl(location)
   * Maps each item's location to the Hold Request Form link and returns it.
   * @param {object} location
   * @return {string}
   */
  this.getLocationHoldUrl = (location) => {
    const holdingLocationId =
      location && location['@id'] ? location['@id'].substring(4) : '';
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
   * getDeliveryLocations(bib, itemId)
   * Get delivery locations for an item.
   * @param {object} bib
   * @param {string} itemId
   * @return {object}
   */
  this.getDeliveryLocations = (bib, itemId) => {
    const item = this.getItem(bib, itemId);
    // default to SASB - RMRR
    const defaultLocation = this.getDefaultLocation();

    // get location and location code
    let location = defaultLocation;
    if (item) {
      // loop through item's delivery locations
    }
    const locationCode = (location['@id'] && typeof location['@id'] === 'string') ?
      location['@id'].substring(4) : '';
    const prefLabel = location.prefLabel;
    // location is set to defaultLocation so it the following will always be false:
    const isOffsite = this.isOffsite(location);

    // retrieve location data
    if (locationCode && locationCode in LocationCodes) {
      location = Locations[LocationCodes[locationCode].location];
    } else {
      location = Locations[LocationCodes[defaultLocation['@id'].substring(4)].location];
    }

    // retrieve delivery location
    let deliveryLocationCode = defaultLocation['@id'].substring(4);
    if (locationCode && locationCode in LocationCodes) {
      deliveryLocationCode = LocationCodes[locationCode].delivery_location || '';
    }

    location.offsite = isOffsite;
    location.code = deliveryLocationCode;
    location.prefLabel = prefLabel;

    if (isOffsite && deliveryLocationCode === defaultLocation['@id'].substring(4)) {
      location.prefLabel = defaultLocation.prefLabel;
    }

    return location;
  };

  /**
   * getLocationDetails(item)
   * Returns updated location data.
   * @param {object} item
   * @return {object}
   */
  this.getLocationDetails = (item) => {
    const defaultLocation = this.getDefaultLocation();
    let location = this.getDefaultLocation();

    // this is a physical resource
    if (item.holdingLocation && item.holdingLocation.length) {
      location = item.holdingLocation[0];
    // this is an electronic resource
    } else if (item.electronicLocator && item.electronicLocator.length) {
      location = item.electronicLocator[0];
      if (!location.prefLabel && location.label) {
        location.prefLabel = location.label;
      }
    }

    if (this.isOffsite(location)) {
      location.prefLabel = `${defaultLocation.prefLabel} (requested from offsite storage)`;
    }
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
   * isOffsite(location)
   * Return whether an item is offsite or not.
   * @param {object} location
   * @return {boolean}
   */
  this.isOffsite = (location) => (
    location && location.prefLabel && location.prefLabel.substring(0, 7).toLowerCase() === 'offsite'
  );
}

export default new LibraryItem;
