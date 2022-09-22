import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'

import ElectronicResources from "../../src/app/components/BibPage/ElectronicResources";

const oneResource = [{ url: "books.com", label: "View on books.com" }]
const threeResource = [{ url: "books.com/1", label: "View on books.com 1" }, { url: "books.com/2", label: "View on books.com 2" }, { url: "books.com/2", label: "View on books.com 3" }]
const fourResource = [{ url: "books.com/1", label: "View on books.com 1" }, { url: "books.com/2", label: "View on books.com 2" }, { url: "books.com/2", label: "View on books.com 3" }, { url: 'books.com/4', label: 'View on books.com 4' }]

describe('ElectronicResources', () => {
  it('should render one electronic resource', () => {
    const component = mount(<ElectronicResources electronicResources={oneResource} />)
    const link = component.find('a')
    expect(component.html()).to.include('Available Online')
    expect(link.text()).to.equal(oneResource[0].label)
  })
  it('should render three electronic resources', () => {
    const component = mount(<ElectronicResources electronicResources={threeResource} />)
    const elements = component.find('ul').find('li')
    expect(component.html()).to.include("Available Online")
    expect(elements).to.have.lengthOf(3)
  })
  it('should render nothing if electronic resources is undefined', () => {
    const component = mount(<ElectronicResources />)
    expect(component.html()).to.be.null
  })
  it('should render nothing if electronic resources is empty array', () => {
    const component = mount(<ElectronicResources electronicResources={[]} />)
    expect(component.html()).to.be.null
  })
  it('should have id if id is passed', () => {
    const component = mount(<ElectronicResources electronicResources={threeResource} id="1234" />)
    expect(component.find('div').at(0).prop('id')).to.equal('1234')
  })
  describe('show more/less button', () => {
    it('should render with more than 3 electronic resources', () => {
      const component = mount(<ElectronicResources electronicResources={fourResource} />)
      expect(component.html()).to.include('View all')
    })
    it('should not render with less than 3 resources', () => {
      const component = mount(<ElectronicResources electronicResources={oneResource} />)
      expect(component.html()).to.not.include('View all')
    })
    it('should show all resources', () => {
      //isTestMode prop is here to circumvent invocation of scrollIntoView during testing
      const component = mount(<ElectronicResources electronicResources={fourResource} isTestMode />)
      const elements = component.find('ul').find('li')
      expect(elements).to.have.lengthOf(3)
      const showMore = component.find('button')
      showMore.simulate('click')
      const moreElements = component.find('ul').find('li')
      expect(moreElements).to.have.lengthOf(4)
    })
    it('should hide resources', () => {
      const component = mount(<ElectronicResources electronicResources={fourResource} isTestMode />)
      const elements = component.find('ul').find('li')
      expect(elements).to.have.lengthOf(3)
      const showMore = component.find('button')
      showMore.invoke('onClick')()
      showMore.invoke('onClick')()
      setTimeout(() => {
        component.update()
        const lessElements = component.find('ul').find('li')
        expect(lessElements).to.have.lengthOf(0)
      }, 0)
    })
  })
})
