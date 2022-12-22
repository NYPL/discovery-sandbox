import InformationLinks from "../../src/app/components/Item/InformationLinks"
import { aeonUrl } from '../../src/app/components/Item/ItemTableRow'
import { FeedbackBoxContext } from "../../src/app/context/FeedbackContext";
import Feedback from '../../src/app/components/Feedback/Feedback'

import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import libraryItems from '../fixtures/libraryItems';

describe('information links', () => {
  describe('recap items', () => {
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
      item = libraryItems.requestable_nonReCAP_NYPL_not_available
      component = shallow(<InformationLinks {...item} />)
    })
    it('should display unavailable', () => {
      expect(component.html()).to.include('<span class="unavailable-text">Not available</span>')
    })
    it('should display due date', () => {
      expect(component.html()).to.include('In use until 1996-07-21')
    })
  })

  describe('onsite items - available', () => {
    it('should display green available', () => {
      const item = libraryItems.requestable_nonReCAP_NYPL_schwarzman
      const component = shallow(<InformationLinks {...item} />)
      expect(component.html()).to.include('<span class="available-text">Available </span>')
    })
    it('should link to LPA', () => {
      const item = libraryItems.requestable_nonReCAP_NYPL_lpa
      const component = shallow(<InformationLinks {...item} />)
      expect(component.html()).to.include('href="https://www.nypl.org/locations/lpa"')
    })
    it('should link to Schwarzman', () => {
      const item = libraryItems.requestable_nonReCAP_NYPL_schwarzman
      const component = shallow(<InformationLinks {...item} />)
      expect(component.html()).to.include('href="https://www.nypl.org/locations/schwarzman"')
    })
    it('should link to Schomburg', () => {
      const item = libraryItems.requestable_nonReCAP_NYPL_schomburg
      const component = shallow(<InformationLinks {...item} />)
      expect(component.html()).to.include('href="https://www.nypl.org/locations/schomburg"')
    })
  })

  describe('special request items', () => {
    it('should link to the division where item is located', () => {
      const item = libraryItems.aeonRequestableWithParams
      const component = shallow(<InformationLinks {...item} computedAeonUrl={item.aeonUrl} />)
      expect(component.html()).to.include(`href="${item.locationUrl}"`)
    })
  })
  // Enzyme cannot find the new DS Feedback modal, so these tests will have to wait until we upgrade to jest/react-testing-library
  // xdescribe('clicking contact a librarian', () => {
  //   const item = libraryItems.requestable_ReCAP_not_available
  //   // const openSpy = sinon.spy()
  //   const FeedBackAndInfoLinks = () => {
  //     const mockProvider = ({ children, value }) => {
  //       const [itemMetadata, setItemMetadata] = useState(value && value.itemMetadata ? value.itemMetadata : null)
  //       const useFeedbackBox = sinon.stub().returns({ onOpen: openSpy })
  //       const { FeedbackBox, isOpen, onOpen, onClose } = useFeedbackBox()
  //       const openFeedbackBox = () => {
  //         openSpy()
  //       }
  //       return (
  //         <FeedbackBoxContext.Provider value={{
  //           onOpen: openFeedbackBox, FeedbackBox, isOpen, onClose, itemMetadata, setItemMetadata
  //         }}> {children}</FeedbackBoxContext.Provider >
  //       );
  //     }
  //     return (
  //       <FeedbackBoxProvider >
  //         <InformationLinks {...item} />
  //       </FeedbackBoxProvider>)
  //   }
  //   const component = mount(<FeedBackAndInfoLinks />)
  //   it('should open feedback dialog with item metadata', async () => {
  //     // const contact = component.find('#contact-librarian').at(0)
  //     // await contact.invoke('onClick')
  //     const open = component.find('Feedback').find('button#open')
  //     open.invoke('onClick')
  //     component.update()
  //     expect()
  //   })
  // })
})
