/* eslint-env mocha */
import React from 'react'
import { expect } from 'chai';
import { shallow } from 'enzyme';

import StatusLinks from './../../src/app/components/Item/StatusLinks';
import ItemsDefinitionLists from './../../src/app/components/Item/ItemsDefinitionLists';
import appConfig from './../../src/app/data/appConfig'

describe('ItemsDefinitionLists', () => {

  const fullItems =  [
    {
      isElectronicResource: true,
      id: '1234',
      location: 'SASB',
      locationUrl: 'www.fake.com',
      format: 'Text',
      callNumber: 'ABCDE1234'
    },
    {
      isElectronicResource: true,
      id: '5678',
      location: 'SASB',
      locationUrl: 'www.fake.com',
      format: 'Text',
      callNumber: 'ABCDE1234'
    },
    {
      isElectronicResource: true,
      id: '91011',
      location: 'SASB',
      locationUrl: 'www.fake.com',
      format: 'Text',
      callNumber: 'ABCDE1234'
    },
    {},
    {
      id: '0123',
      location: 'SASB',
      locationUrl: 'www.fake.com',
      format: 'Text',
      callNumber: 'ABCDE1234'
    },
    {
      id: '4567',
      location: 'SASB',
      locationUrl: 'www.fake.com',
      callNumber: 'ABCDE1234'
    },
    {
      id: '8910',
      location: 'SASB',
      locationUrl: 'www.fake.com',
      format: 'Text',
    },
    {
      id: '1112',
      location: 'SASB',
      format: 'Text',
      callNumber: 'ABCDE1234'
    },
    {
      id: '1314',
      format: 'Text',
      callNumber: 'ABCDE1234'
    },
  ]

  describe('No items to display', () => {

    describe('No item array', () => {
      const component = shallow(
        <ItemsDefinitionLists
          holdings={[]}
          bibId="b12345"
          id="1234"
          searchKeywords={[]}
          page="Search Results"
        />
      )
      it('should not display anything', () => {
        expect(component.html()).to.equal(null)
      })
    })

    describe('empty items array', () => {
      const component = shallow(
        <ItemsDefinitionLists
          holdings={[]}
          bibId="b12345"
          id="1234"
          searchKeywords={[]}
          page="Search Results"
          items={[]}
        />
      )
      it('should not display anything', () => {
        expect(component.html()).to.equal(null)
      })
    })

    describe('only electronic items', () => {
      const component = shallow(
        <ItemsDefinitionLists
          holdings={[]}
          bibId="b12345"
          id="1234"
          searchKeywords={[]}
          page="Search Results"
          items={
            [
              {
                isElectronicResource: true,
                id: '1234',
                location: 'SASB',
                locationUrl: 'www.fake.com',
                format: 'Text',
                callNumber: 'ABCDE1234'
              },
              {
                isElectronicResource: true,
                id: '5678',
                location: 'SASB',
                locationUrl: 'www.fake.com',
                format: 'Text',
                callNumber: 'ABCDE1234'
              },
              {
                isElectronicResource: true,
                id: '91011',
                location: 'SASB',
                locationUrl: 'www.fake.com',
                format: 'Text',
                callNumber: 'ABCDE1234'
              }
            ]
          }
        />
      )
      it('should not display anything', () => {
        expect(component.html()).to.equal(null)
      })
    })
  })

  describe('rendering items', () => {
    describe('list structure', () => {

      const items = fullItems
      const component = shallow(
        <ItemsDefinitionLists
          holdings={[]}
          bibId="b12345"
          id="1234"
          searchKeywords={[]}
          page="Search Results"
          items={items}
        />
      )

      it('should have a div with correct props', () => {
        const root = component.first()
        expect(root.type()).to.equal('div')
        expect(root.key()).to.equal('b12345-items')
        expect(root.prop('id')).to.equal('b12345-items')
        expect(root.prop('className')).to.equal('items-definition-list')
      })

      it('should filter out empty items and electronic resources', () => {
        const divs = component.first().children().find('div')
        expect(divs.length).to.equal(5)
      })

      it('should have a div with correct props for each item', () => {
        const divs = component.first().children().find('div').map(div => ([div.key(), div.prop('id')]));
        expect(divs).to.deep.equal(items.slice(4).map(item => [`item-${item.id}-div`, `item-${item.id}-div`]))
      })

      it('should have a dl with correct id and key for each item', () => {
        const dls = component.first().children().find('div')
          .map(div => div.find('dl'))
          .map(dl => [dl.key(), dl.prop('id')])

        expect(dls).to.deep.equal(items.slice(4).map(item => [`item-${item.id}-dl`, `item-${item.id}-dl`]))
      })

      it('should have correct number of dt and dd cells with correct props', () => {
        const dlcells = component.first().children().find('div')
          .map(div => div.find('dl'))
          .map(dl => dl.children().map(child => {
            const node = child.first()
            return [node.type(), node.key(), node.prop('id')]
          }))

        expect(dlcells).to.deep.equal(
            items.slice(4).map(item =>
              [['dt', `item-${item.id}-format-dt`, `item-${item.id}-format-dt`],
               ['dd', `item-${item.id}-format-dd`, `item-${item.id}-format-dd`],
               ['dt', `item-${item.id}-callnumber-dt`, `item-${item.id}-callnumber-dt`],
               ['dd', `item-${item.id}-callnumber-dd`, `item-${item.id}-callnumber-dd`],
               ['dt', `item-${item.id}-location-dt`, `item-${item.id}-location-dt`],
               ['dd', `item-${item.id}-location-dd`, `item-${item.id}-location-dd`]
             ]
          )
        )

      })

      it('should render Format dt', () => {
        expect(component.find('dl').at(0).find('dt').at(0).text()).to.equal('Format')

      })
      it('should render item format when present', () => {
        expect(component.find('dl').at(0).find('dd').at(0).text()).to.equal('Text')
      })

      it('should render blank format when not present', () => {
        expect(component.find('dl').at(1).find('dd').at(0).text()).to.equal(' ')
      })

      it('should render Call Number dt', () => {
        expect(component.find('dl').at(0).find('dt').at(1).text()).to.equal('Call Number')
      })

      it('should render call number when present', () => {
        expect(component.find('dl').at(0).find('dd').at(1).text()).to.equal('ABCDE1234')
      })

      it('should render blank call number when not present', () => {
        expect(component.find('dl').at(2).find('dd').at(1).text()).to.equal(' ')
      })

      it('should render item location dt', () => {
        expect(component.find('dl').at(0).find('dt').at(2).text()).to.equal('Item Location');
      })

      it('should render item location link when url present', () => {
        expect(component.find('dl').at(2).find('dd').at(2).find('a').length).to.equal(1)
        expect(component.find('dl').at(2).find('dd').at(2).find('a').text()).to.equal('SASB')
        expect(component.find('dl').at(2).find('dd').at(2).find('a').prop('href')).to.equal('www.fake.com')
        expect(component.find('dl').at(2).find('dd').at(2).find('a').prop('className')).to.equal('itemLocationLink')
      })

      it('should render item location text when location present', () => {
        expect(component.find('dl').at(3).find('dd').at(2).find('a').length).to.equal(0)
        expect(component.find('dl').at(3).find('dd').at(2).text()).to.equal('SASB')
      })

      it('should default to blank location', () => {
        expect(component.find('dl').at(4).find('dd').at(2).find('a').length).to.equal(0)
        expect(component.find('dl').at(4).find('dd').at(2).text()).to.equal(' ')
      })

    })



    describe('StatusLinks rendering', () => {
       describe('on Search Results page', () => {
         const component = shallow(
           <ItemsDefinitionLists
             holdings={[]}
             bibId="b12345"
             id="1234"
             searchKeywords={[]}
             page="SearchResults"
             items={fullItems}
           />
         )
         it('should render status links in case page is Search Results', () => {
           const statusLinks = component.find(StatusLinks)
           expect(statusLinks.length).to.equal(5)
           expect(statusLinks.at(0).props()).to.deep.equal({
             item: fullItems[4],
             bibId: "b12345",
             searchKeywords: [],
             page: "SearchResults",
             appConfig: appConfig
           })
         })
       })

       describe('Not on Search Results page', () => {
         const component = shallow(
           <ItemsDefinitionLists
             holdings={[]}
             bibId="b12345"
             id="1234"
             searchKeywords={[]}
             page="BibPage"
             items={fullItems}
           />
         )
         it('should not render status links', () => {
           const statusLinks = component.find(StatusLinks)
           expect(statusLinks.length).to.equal(0)
         })
       })
    })

  })
});
