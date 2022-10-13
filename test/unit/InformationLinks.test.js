import InformationLinks from "../../src/app/components/Item/InformationLinks"

import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import libraryItems from '../fixtures/libraryItems';

describe.only('information links', () => {
  describe('recap items - available', () => {
    it('should display link to help section', () => {
      let item = libraryItems.requestable_ReCAP_available
      let component = shallow(<InformationLinks {...item} />)
      expect(component.html()).to.include('href="https://www.nypl.org/help/request-research-materials"')
    })
    it('should display Unavailable when unavailable', () => {
      const item = libraryItems.requestable_ReCAP_not_available
      const component = shallow(<InformationLinks {...item} />)
      expect(component.html()).to.include('<span class="unavailable-text">Not available</span>')
    })
  })

  describe('onsite items - unavailable', () => {
    let component
    let item
    before(() => {
      component = shallow(<InformationLinks {...item} />)
      item = libraryItems.requestable_nonReCAP_NYPL_not_available
    })
    it('should display unavailable', () => {
      expect(component.html()).to.include('<span class="unavailable-text">Not available</span>')
    })
    it('should display due date', () => {
      console.log(item.dueDate)
      expect(component.html()).to.include('In use until 1996-07-21')
    })
  })
  describe('onsite items - available', () => {
    it('should display green available', () => {

    })

    it('should link to LPA', () => {
    })
    it('should link to Schwarzman', () => {
    })
    it('should link to Schomburg', () => {
    })
  })

  describe('special request items', () => {
    it('should link to the division where item is located', () => {

    })
  })
})
