/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import SearchResultsItems from '../../src/app/components/Item/SearchResultsItems'
import ItemTable from '../../src/app/components/Item/ItemTable'
import ItemsDefinitionLists from '../../src/app/components/Item/ItemsDefinitionLists'
import { MediaContext } from '../../src/app/components/Application/Application'

const SearchResultsItemsWithProvider = ({ media, extraProps }) => {
    return(
        <MediaContext.Provider value={media}>
          <SearchResultsItems
            {...extraProps}
          />
        </MediaContext.Provider>
      )
}

describe('SearchResultsItems', () => {
  describe('when media is mobile', () => {
    let component;

    before(() => {
      component = mount(
        <SearchResultsItemsWithProvider
          media="mobile"
          extraProps={
            {
              items: [],
              bibId: "b1234",
              id: "1234",
              searchKeywords: "word1 word2 word3",
              page: "SearchResults"
            }
          }
        />
      )
    })

    it('should render ItemsDefinitionLists with correct props', () => {
      expect(component.find(ItemsDefinitionLists).length).to.equal(1)
      expect(component.find(ItemsDefinitionLists).at(0).props()).to.deep.equal({
        items: [],
        bibId: "b1234",
        id: "1234",
        searchKeywords: "word1 word2 word3",
        page: "SearchResults"
      })
    })

    it('should not render ItemTable', () => {
      expect(component.find(ItemTable).length).to.equal(0)
    })
  })

  describe('when media is not mobile', () => {
    let component;

    before(() => {
      component = mount(
        <SearchResultsItemsWithProvider
          media="desktop"
          extraProps={
            {
              items: [],
              bibId: "b1234",
              id: "1234",
              searchKeywords: "word1 word2 word3",
              page: "SearchResults"
            }
          }
        />
      )
    })

    it('should render ItemTable with correct props', () => {
      expect(component.find(ItemTable).length).to.equal(1)
      expect(component.find(ItemTable).at(0).props()).to.deep.equal({
        items: [],
        bibId: "b1234",
        id: "1234",
        isArchiveCollection: false,
        searchKeywords: "word1 word2 word3",
        page: "SearchResults"
      })
    })

    it('should not render ItemsDefinitionLists', () => {
      expect(component.find(ItemsDefinitionLists).length).to.equal(0)
    })
  })
})
