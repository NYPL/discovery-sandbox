/* eslint-env mocha */
import { expect } from 'chai';

import LibraryItem from '../../src/app/utils/item';

describe('LibraryItem', () => {
  describe('ensureLegacyIdentifierIsEntity', () => {
    it('should transform urn: prefixed identifiers to entities', () => {
      const input = 'urn:barcode:1234';
      const output = LibraryItem.ensureLegacyIdentifierIsEntity(input);

      expect(output).to.be.a('object');
      expect(output).to.have.property('@type', 'bf:Barcode');
      expect(output).to.have.property('@value', '1234');
    });
  });

  describe('getIdentifierValueByType', () => {
    it('should get an identifier by rdf type', () => {
      const output = LibraryItem.getIdentifierValueByType(['urn:barcode:1234'], 'bf:Barcode');

      expect(output).to.be.a('string');
      expect(output).to.equal('1234');
    });
  });


  describe('getIdentifiers', () => {
    const neededTagsArray = [{ name: 'barcode', value: 'bf:Barcode' }];

    it('should extract barcode from array of urn prefixed identifiers', () => {
      const input = ['urn:barcode:1234', 'urn:oclc:abcd'];
      const output = LibraryItem.getIdentifiers(input, neededTagsArray);

      expect(output).to.be.a('object');
      expect(output).to.have.property('barcode', '1234');
    });

    it('should extract barcode from array of entity encoded identifiers', () => {
      const input = [{ '@type': 'bf:Barcode', '@value': '1234' }, { '@type': 'nypl:Oclc', '@value': 'abcd' }];
      const output = LibraryItem.getIdentifiers(input, neededTagsArray);

      expect(output).to.be.a('object');
      expect(output).to.have.property('barcode', '1234');
    });
  });
});
