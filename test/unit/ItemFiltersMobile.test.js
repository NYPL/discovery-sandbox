/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import ItemFiltersMobile from '../../src/app/components/Item/ItemFiltersMobile';
import ItemFilter from '../../src/app/components/Item/ItemFilter';

const context = {
  router: {
    location: {
      query: {},
    },
  },
};

const formatOptions = {
  format: [
    {
      id: 'PRINT',
      label: 'PRINT',
    },
    {
      id: 'Text',
      label: 'Text',
    },
  ],
};

describe.only('ItemFiltersMobile', () => {

  describe('without props', () => {
    it('should not render without props', () => {
      const component = shallow(<ItemFiltersMobile />, { context });
      expect(component.type()).to.equal(null);
    });
  });

  describe('with props', () => {
    let initialFilters;
    let component;
    let modalTrigger;

    beforeEach(() => {
      initialFilters = {
        format: [],
        status: [],
        location: [],
      };
      component = mount(
        <ItemFiltersMobile
          options={formatOptions}
          setSelectedFilters={() => { }}
          submitFilterSelections={() => { }}
          initialFilters={initialFilters}
          selectedFilters={initialFilters}
        />,
      );
      modalTrigger = component.findWhere(node => {
        return node.type() === 'button' && node.text() === "Filters";
      });
    })

    it('should render "Filters" button', () => {
      expect(modalTrigger).to.have.lengthOf(1);
    });

    it('should render `ItemFilter` for option types passed', () => {
      //failing because the itemfiltermobile does not render modal we ened ot simulate click
      modalTrigger.simulate('click')
      const itemFilters = component.find('.item-filter')
      expect(itemFilters.hostNodes().length).to.equal(1);
    });

    describe('"Show Results" button', () => {
      let showResultsButton
      beforeEach(() => {
        modalTrigger.simulate('click')
        showResultsButton = component.findWhere(node => {
          return node.type() === 'button' && node.text() === "Show Results";
        });
      }) 
      it('should render a "Show Results" button', () => {
        console.log(showResultsButton.debug())
        expect(showResultsButton.text()).to.equal('Show Results');
      });
      xit('should close when "Show Results" is clicked with no filters', () => {
        showResultsButton.simulate('click');
        expect(modalTrigger.length).to.equal(1);
        expect(component.find('Modal').length).to.equal(0);
        expect(modalTrigger.find('button').text()).to.equal('Filters');
      });
      it('should close when "Show Results" is clicked with filters', () => {
        const filter = component.find('.item-filter')
        filter.simulate('click')
        const textFormat = component.findWhere(node => {
          return node.text() === 'PRINT'
        })
        textFormat.simulate('click')
        show
      })
    });
  });
});

