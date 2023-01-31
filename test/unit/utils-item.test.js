import LibraryItem from './../../src/app/utils/item';
import { expect } from 'chai';
import items from '../fixtures/mocked-item';

describe('utils/item', () => {
  describe('LibraryItem', () => {
    describe('mapItem', () => {
      it('interprets status "Available" as available', () => {
        const libraryItem = LibraryItem.mapItem(items[0])
        expect(libraryItem.available).to.eq(true);
      });

      it('interprets status "Loaned" as not available', () => {
        const unavailableItem = Object.assign({}, items[0], {
          status: [
            {
              '@id': 'status:co',
              prefLabel: 'Loaned',
            },
          ]
        });
        const libraryItem = LibraryItem.mapItem(unavailableItem)
        expect(libraryItem.available).to.eq(false);
      });

      it('interprets status "Use in Library" as available', () => {
        const unavailableItem = Object.assign({}, items[0], {
          status: [
            {
              '@id': 'status:o',
              prefLabel: 'Use in Library',
            },
          ]
        });
        const libraryItem = LibraryItem.mapItem(unavailableItem)
        expect(libraryItem.available).to.eq(true);
      });


      it('gets format from item\'s formatLiteral if available', () => {
        const mockItem = Object.assign({}, items[0], { formatLiteral: ['MockItemFormat'] })
        const mockBib = { materialType: [{ prefLabel: 'MockBibFormat' }] }
        const libraryItem = LibraryItem.mapItem(mockItem, mockBib)
        expect(libraryItem.format).to.eq('MockItemFormat')
      })

      it('gets format from bib\'s materialType in case there is no formatLiteral', () => {
        const mockItem = Object.assign({}, items[0])
        const mockBib = { materialType: [{ prefLabel: 'MockBibFormat' }] }
        const libraryItem = LibraryItem.mapItem(mockItem, mockBib)
        expect(libraryItem.format).to.eq('MockBibFormat')
      })

      it('gets format from bib\'s materialType in case formatLiteral is empty', () => {
        const mockItem = Object.assign({}, items[0], { formatLiteral: [] })
        const mockBib = { materialType: [{ prefLabel: 'MockBibFormat' }] }
        const libraryItem = LibraryItem.mapItem(mockItem, mockBib)
        expect(libraryItem.format).to.eq('MockBibFormat')
      })

      it('sets default format to empty string in case neither item nor bib has format', () => {
        const mockItem = Object.assign({}, items[0], { formatLiteral: [] })
        const mockBib = {}
        const libraryItem = LibraryItem.mapItem(mockItem, mockBib)
        expect(libraryItem.format).to.eq('')
      })
    });
  });
});
