import Locations from '../../../locations.js';
import LocationCodes from '../../../locationCodes.js';

function LibraryItem() {
  this.getDefaultLocation = () => ({
    '@id': 'loc:mal',
    prefLabel: 'Stephen A. Schwarzman Building - Rose Main Reading Room 315',
  });

  /**
   * getItem(record, 'b18207658-i24609501')
   * @param (Object) record
   * @param (String) itemId
   */
  this.getItem = (record, itemId) => {
    // look for item id in record's items
    const items = record.items;
    let thisItem = {};
    items.forEach((i) => {
      if (i['@id'].substring(4) === itemId) {
        thisItem = i;
      }
    });
    return thisItem;
  };

  /**
   * getItems(record)
   * @param (Object) record
   */
  this.getItems = (record) => {
    const recordTitle = record.title ? record.title[0] : '';
    // filter out anything without a status or location
    const items = record.items
      .filter((item) => item.status || item.electronicLocator)
      // map items
      .map((item) => {
        const id = item['@id'].substring(4);
        let status = item.status && item.status[0].prefLabel ? item.status[0].prefLabel : '';
        let availability = status.replace(/\W/g, '').toLowerCase();
        let accessMessage = item.accessMessage && item.accessMessage.length ? item.accessMessage[0].prefLabel.toLowerCase() : '';
        const callNumber = item.shelfMark ? item.shelfMark[0] : '';
        const location = this.getLocationLabel(item);
        let url = null;
        let actionLabel = null;
        let actionLabelHelper = null;
        const isElectronicResource = this.isElectronicResource(item);

        if (isElectronicResource && item.electronicLocator[0].url) {
          status = 'Available';
          availability = 'available';
          url = item.electronicLocator[0].url;
          actionLabel = 'View online';
          actionLabelHelper = `resource for ${recordTitle}`;
        } else if (availability === 'available') {
          url = this.getLocationHoldUrl(location);
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
          location,
          callNumber,
          url,
          actionLabel,
          actionLabelHelper,
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

  this.getLocationHoldUrl = (location) => {
    let url = '';

    switch (location) {
      case 'Stephen A. Schwarzman Building - Rose Main Reading Room 315':
        url = 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?&institution=13777&type=1&language=1';
        break;
      case 'Library for the Performing Arts':
        url = 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?&institution=13252&type=1&language=1';
        break;
      case 'Schomburg Center':
        url = 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?&institution=13810&type=1&language=1';
        break;
      case 'Science, Industry and Business Library':
        url = 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?&institution=13809&type=1&language=1';
        break;
      default:
        url = 'http://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?&institution=13777&type=1&language=1';
        break;
    }

    return url;
  };

  /**
   * getLocation(record, 'b18207658-i24609501')
   * @param (Object) record
   * @param (String) itemId
   */
  this.getLocation = (record, itemId) => {
    const thisItem = this.getItem(record, itemId);

    // default to SASB - RMRR
    const defaultLocation = this.getDefaultLocation();

    // get location and location code
    let location = defaultLocation;
    if (thisItem && thisItem.location && thisItem.location.length > 0) {
      location = thisItem.location[0][0];
    }
    const locationCode = location['@id'].substring(4);
    const prefLabel = location.prefLabel;
    const isOffsite = this.isOffsite(location);

    // retrieve location data
    if (locationCode in LocationCodes) {
      location = Locations[LocationCodes[locationCode].location];
    } else {
      location = Locations[LocationCodes[defaultLocation['@id'].substring(4)].location];
    }

    // retrieve delivery location
    let deliveryLocationCode = defaultLocation['@id'].substring(4);
    if (locationCode in LocationCodes) {
      deliveryLocationCode = LocationCodes[locationCode].delivery_location;
    }

    location.offsite = isOffsite;
    location.code = deliveryLocationCode;
    location.prefLabel = prefLabel;

    if (isOffsite && deliveryLocationCode === defaultLocation['@id'].substring(4)) {
      location.prefLabel = defaultLocation.prefLabel;
    }

    return location;
  };

  this.getLocationLabel = (item) => {
    const defaultLocation = this.getDefaultLocation();
    let location = this.getDefaultLocation();

    // this is a physical resource
    if (item.location && item.location.length) {
      location = item.location[0][0];

    // this is an electronic resource
    } else if (item.electronicLocator && item.electronicLocator.length) {
      location = item.electronicLocator[0];
      if (!location.prefLabel && location.label) {
        location.prefLabel = location.label;
      }
    }

    if (this.isOffsite(location)) {
      return `${defaultLocation.prefLabel} (requested from offsite storage)`;
    }
    return location.prefLabel;
  };

  this.isElectronicResource = (item) => item.electronicLocator && item.electronicLocator.length;

  this.isOffsite = (location) => (
    location && location.prefLabel && location.prefLabel.substring(0, 7).toLowerCase() === 'offsite'
  );
}

export default new LibraryItem;
