import LibraryItem from "./../../src/app/utils/item";
import { expect } from "chai";
import items from "../fixtures/mocked-item";

describe("utils/item", () => {
  describe("LibraryItem", () => {
    describe("mapItem", () => {
      it('interprets status "Available" as available', () => {
        const libraryItem = LibraryItem.mapItem(items[0]);
        expect(libraryItem.available).to.eq(true);
      });

      it('interprets status "Loaned" as not available', () => {
        const unavailableItem = Object.assign({}, items[0], {
          status: [
            {
              "@id": "status:co",
              prefLabel: "Loaned",
            },
          ],
        });
        const libraryItem = LibraryItem.mapItem(unavailableItem);
        expect(libraryItem.available).to.eq(false);
      });

      it('interprets status "Use in Library" as available', () => {
        const unavailableItem = Object.assign({}, items[0], {
          status: [
            {
              "@id": "status:o",
              prefLabel: "Use in Library",
            },
          ],
        });
        const libraryItem = LibraryItem.mapItem(unavailableItem);
        expect(libraryItem.available).to.eq(true);
      });
    });
  });
});
