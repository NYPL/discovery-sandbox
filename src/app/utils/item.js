import {
  findWhere as _findWhere,
  isEmpty as _isEmpty,
} from 'underscore';
import LocationCodes from '../data/locationCodes';

const itemSourceMappings = {
  SierraNypl: 'sierra-nypl',
  RecapCul: 'recap-cul',
  RecapPul: 'recap-pul',
};

// Map local identifier names to their @type and urn: indicators:
const itemIdentifierTypeMappings = {
  barcode: {
    type: 'bf:Barcode',
    legacyUrnPrefix: 'urn:barcode:',
  },
  bnum: {
    type: 'nypl:Bnumber',
    legacyUrnPrefix: 'urn:bnum:',
  },
  callnumber: {
    type: 'bf:ShelfMark',
    legacyUrnPrefix: 'urn:callnumber:',
  },
  isbn: {
    type: 'bf:Isbn',
    legacyUrnPrefix: 'urn:isbn:',
  },
  issn: {
    type: 'bf:Issn',
    legacyUrnPrefix: 'urn:issn:',
  },
  lccn: {
    type: 'bf:Lccn',
    legacyUrnPrefix: 'urn:lccn:',
  },
  oclc: {
    type: 'nypl:Oclc',
    legacyUrnPrefix: 'urn:oclc:',
  },
};

function LibraryItem() {
  /**
   * getDefaultNyplLocation()
   * Return the default delivery location for an item.
   * @return {object}
   */
  this.getDefaultNyplLocation = () => ({
    '@id': '',
    prefLabel: 'Check with Staff',
    customerCode: '',
  });

  /**
   * nonNyplRecapLocation()
   * Return the default delivery location for a nonNyplRecap item.
   * @return {object}
   */
  this.nonNyplRecapLocation = () => ({
    '@id': '',
    prefLabel: 'Offsite',
    customerCode: '',
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
   * Given an identifier value, returns same identifier transformed to entity
   * representation.
   *
   * @param {object} identifier - Identifier entity (i.e. with @type & @value attributes)
   */
  this.ensureLegacyIdentifierIsEntity = (identifier) => {
    // If API has given us urn: prefixed identifiers..
    if (typeof identifier === 'string') {
      // Convert them to entitys:
      return Object.keys(itemIdentifierTypeMappings)
        .filter(name => identifier.indexOf(itemIdentifierTypeMappings[name].legacyUrnPrefix) === 0)
        .map(name => (
          {
            '@type': itemIdentifierTypeMappings[name].type,
            '@value': identifier.replace(itemIdentifierTypeMappings[name].legacyUrnPrefix, ''),
          }
        ))
        .pop();
    }

    // Otherwise we assume it's already an entity:
    return identifier;
  };

  /**
   * Given an array of identifier entries (either serialized as entities or
   * string literals), returns the identifers (as entities) that match the
   * given rdf:type
   *
   * @param {array<object>} identifiersArray - Array of identifiers. May be
   * either entities (i.e. with @type & @value properties) or string literals
   * (e.g. "urn:isbn:1234")
   *
   * @param {string} type - The rdf:type to extract (e.g. "bf:Isbn")
   *
   * @return {array<object>} An array of matching identifier entities
   */
  this.getIdentifierEntitiesByType = (identifiersArray, type) => {
    return identifiersArray
      .map(this.ensureLegacyIdentifierIsEntity)
      .filter(identifier => identifier && identifier['@type'] === type);
  };

  /**
   * @typedef {object} IdentifierMapping
   * @property {string} name - Name to use in resulting mapping (e.g. 'barcode')
   * @property {string} value - Type to look for in source (e.g. 'bf:Barcode')
   */

  /**
   * getIdentifiers(identifiersArray, neededTagsArray)
   * Gets into the array of the identifiers of an item. And then targets the identifiers we need
   * by the prefixes in neededTagsArray. At last, extracts the identifiers and returns them.
   *
   * @param {array} identifiersArray
   * @param {IdentifierMapping[]} neededTagsArray
   *
   * @return {object}
   */
  this.getIdentifiers = (identifiersArray, neededTagsArray) => (
    neededTagsArray.reduce((identifierMap, neededTag) => {
      const matches = this.getIdentifierEntitiesByType(identifiersArray, neededTag.value);
      if (matches && matches.length > 0) return Object.assign(identifierMap, { [neededTag.name]: matches[0]['@value'] });
      return identifierMap;
    }, {})
  );

  /**
   * getElectronicResources(item)
   * @param {object} items The item to get an electronic resource from.
   * @return {array}
   */
  this.getElectronicResources = (item = {}) => {
    if (item.electronicLocator) {
      return item.electronicLocator;
    }

    return [];
  };

  /**
   * mapItem(item, title)
   * Massage data and update an item's properties.
   * @param {object} item The item to update the data for.
   * @return {object}
   */
  this.mapItem = (item = {}) => {
    const id = item && item['@id'] ? item['@id'].substring(4) : '';
    const itemSource = item.idNyplSourceId ? item.idNyplSourceId['@type'] : undefined;
    // Taking the first object in the accessMessage array.
    const accessMessage = item.accessMessage && item.accessMessage.length ?
      item.accessMessage[0] : {};
    // Taking first callNumber.
    const callNumber = item.shelfMark && item.shelfMark.length ? item.shelfMark[0] : '';
    // Taking the first value in the array.
    const requestable = item.requestable && item.requestable.length ? item.requestable[0] : false;
    // Taking the first value in the array;
    const suppressed = item.suppressed && item.suppressed.length ? item.suppressed[0] : false;
    const isElectronicResource = this.isElectronicResource(item);
    const electronicResources = isElectronicResource ? this.getElectronicResources(item) : null;
    // Taking the first status object in the array.
    const status = item.status && item.status.length ? item.status[0] : {};
    const availability = !_isEmpty(status) && status.prefLabel ?
      status.prefLabel.replace(/\W/g, '').toLowerCase() : '';
    const available = availability === 'available';
    // non-NYPL ReCAP
    const nonNyplRecap = itemSource.indexOf('Recap') !== -1;
    const holdingLocation = this.getHoldingLocation(item, nonNyplRecap);
    // nypl-owned ReCAP
    const nyplRecap = !!((holdingLocation && !_isEmpty(holdingLocation) &&
      holdingLocation['@id'].substring(4, 6) === 'rc') && (itemSource === 'SierraNypl'));
    const nonRecapNYPL = !!((holdingLocation && !_isEmpty(holdingLocation) &&
      holdingLocation['@id'].substring(4, 6) !== 'rc') && (itemSource === 'SierraNypl'));
    const isRecap = nonNyplRecap || nyplRecap;
    // The identifier we need for an item now
    const identifiersArray = [{ name: 'barcode', value: 'bf:Barcode' }];
    const bibIdentifiers = this.getIdentifiers(item.identifier, identifiersArray);
    const barcode = bibIdentifiers.barcode || '';
    const mappedItemSource = itemSourceMappings[itemSource];
    const isOffsite = this.isOffsite(holdingLocation.prefLabel.toLowerCase());
    let url = null;

    if (availability === 'available') {
      // For all items that we want to send to the Hold Request Form.
      url = this.getLocationHoldUrl(holdingLocation);
    }

    return {
      id,
      status,
      availability,
      available,
      accessMessage,
      isElectronicResource,
      electronicResources,
      location: holdingLocation.prefLabel,
      holdingLocationCode: holdingLocation['@id'],
      callNumber,
      url,
      requestable,
      suppressed,
      barcode,
      itemSource: mappedItemSource,
      isRecap,
      nonRecapNYPL,
      isOffsite,
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
        return this.mapItem(item);
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
    // filter out anything without a status or location
    const bibItems = bib && bib.items && bib.items.length ? bib.items : [];
    const finalItems = bibItems.map(item => this.mapItem(item));

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
   * getHoldingLocation(item, nonNyplRecap)
   * Returns updated location data from the holdingLocation property in the API for each item.
   * @param {object} item
   * @param {boolean} nonNyplRecap
   * @return {object}
   */
  this.getHoldingLocation = (item, nonNyplRecap) => {
    let location = this.getDefaultNyplLocation();

    if (nonNyplRecap) {
      location = this.nonNyplRecapLocation();
    }

    // this is a physical resource
    if (item.holdingLocation && item.holdingLocation.length) {
      location = item.holdingLocation[0];
    }

    return location;
  };

  /**
   * isElectronicResource(item)
   * Return if an item has an electronic resource.
   * @param {object} item
   * @return {boolean}
   */
  this.isElectronicResource = item => !!(item.electronicLocator && item.electronicLocator.length);

  /**
   * isOffsite(prefLabel)
   * Return whether an item is offsite or not.
   * @param {string} prefLabel
   * @return {boolean}
   */
  this.isOffsite = (prefLabel = '') => prefLabel.indexOf('offsite') !== -1;

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
