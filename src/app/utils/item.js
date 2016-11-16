import Locations from '../../../locations.js';
import LocationCodes from '../../../locationCodes.js';

function LibraryItem() {

  this.getDefaultLocation = () => {
    return {
      '@id': 'loc:mal',
      'prefLabel': 'SASB - Rose Main Rdg Rm 315'
    };
  };

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
      if (i['@id'].substring(4) == itemId) {
        thisItem = i;
      }
    });
    return thisItem;
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
    let deliveryLocationCode = defaultLocation['@id'].substring(4)
    if (locationCode in LocationCodes) {
      deliveryLocationCode = LocationCodes[locationCode].delivery_location;
    }

    location.offsite = isOffsite;
    location.code = deliveryLocationCode;
    location.prefLabel = prefLabel;

    console.log()
    if (isOffsite && deliveryLocationCode === defaultLocation['@id'].substring(4)) {
      location.prefLabel = defaultLocation.prefLabel;
    }

    return location;
  };

  this.getLocationLabel = (location) => {
    const defaultLocation = this.getDefaultLocation();

    if (!location || !location.length) return defaultLocation.prefLabel;
    else if (this.isOffsite(location[0][0])) return `${defaultLocation.prefLabel} (requested from offsite storage)`;
    else return location[0][0].prefLabel;
  };

  this.isOffsite = (location) => {
    return location && location.prefLabel && location.prefLabel.substring(0,7).toLowerCase() === "offsite";
  };

}

export default new LibraryItem;
