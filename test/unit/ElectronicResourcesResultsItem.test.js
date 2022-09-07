import React from 'react'
import { mount } from 'enzyme'
import { expect } from 'chai'
import { Link } from 'react-router'

import ElectronicResourcesResultsItem from "../../src/app/components/ElectronicResourcesResultsItem/ElectronicResourcesResultsItem";

describe('ElectronicResourcesResultsItem', () => {
  describe('with no resources', () => {
    it('should render null', () => {
      const component = mount(<ElectronicResourcesResultsItem resources={[]}/>);
      expect(component.html()).to.be.null
    });
  });

  describe('with at least one resource', () => {
    let onClickRecord;
    const onClick = (e) => { e.preventDefault(); onClickRecord = 'clicked'; };
    const component = mount(
        <ElectronicResourcesResultsItem resources={[ { url: 'fakeurl', label: 'fakelabel' } ]} onClick={onClick} bibUrl='fakebiburl'/>
    )
    it('should have a section with class electronic-resources-search-section', () => {
      const section = component.find('section')
      expect(section.length).to.equal(1)
      expect(section.at(0).prop('className')).to.equal('electronic-resources-search-section')
    })

    it('should have an h3 with correct class and text', () => {
      const h3 = component.find('h3')
      expect(h3.length).to.equal(1)
      expect(h3.at(0).prop('className')).to.include('electronic-resources-search-header')
      expect(h3.at(0).text()).to.equal('Available Online')
    })

    it('should have a link', () => {
      const link = component.find('a')
      expect(link.length).to.equal(1)
      expect(link.at(0).prop('className')).to.equal('search-results-list-link')
      link.at(0).simulate('click')
      expect(onClickRecord).to.equal('clicked')
    })
  })

  describe('with one resource', () => {
    it('should point link to resource', () => {
      const component = mount(
          <ElectronicResourcesResultsItem resources={[ { url: 'fakeurl', label: 'fakelabel' } ]} onClick={null} bibUrl='fakebiburl'/>
      )
      const link = component.find(Link)
      expect(link.length).to.equal(1)
      expect(link.at(0).prop('to')).to.equal('fakeurl')
      expect(link.at(0).text()).to.equal('fakelabel')
    })

    it('should use url as default text', () => {
      const component = mount(
          <ElectronicResourcesResultsItem resources={[ { url: 'fakeurl' } ]} onClick={null} bibUrl='fakebiburl'/>
      )
      const link = component.find(Link)
      expect(link.length).to.equal(1)
      expect(link.at(0).text()).to.equal('fakeurl')
    })
  });

  describe('with multiple resources', () => {
    it('should point link to the list of resources', () => {
      const component = mount(
          <ElectronicResourcesResultsItem
            resources={[ { url: 'fakeurl1', label: 'fakelabel1' }, { url: 'fakeurl2', label: 'fakelabel2' } ]} onClick={null} bibUrl='fakebiburl'
          />
      )

      expect(component.find(Link).length).to.equal(1);
      expect(component.find(Link).at(0).prop('to')).to.equal(`fakebiburl#electronic-resources`)
      expect(component.find(Link).at(0).text()).to.include('See All Available Online Resources')
    })
  });
});
