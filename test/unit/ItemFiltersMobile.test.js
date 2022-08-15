/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { Checkbox } from '@nypl/design-system-react-components'

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
        expect(showResultsButton.exists())
      });
      xit('should close when "Show Results" is clicked with no filters', () => {
        showResultsButton.simulate('click');
        expect(modalTrigger.length).to.equal(1);
        expect(component.find('Modal').length).to.equal(0);
        expect(modalTrigger.find('button').text()).to.equal('Filters');
      });
      it.only('should close when "Show Results" is clicked with filters', () => {
        //I don't love this hardcoded value but I can't find any other way to get this dropdown selected :-\
        // const filter = component.find('ItemFilter').at(1)
        // filter.simulate('click')
        // const textFormat = component.find(Checkbox)

        // textFormat.simulate('change')
        const filter = component.find('.item-filter-button').at(0)
        filter.simulate('click')
        showResultsButton.simulate('click')
        expect(modalTrigger.length).to.equal(1);
        expect(component.find('Modal').length).to.equal(0);
        expect(modalTrigger.find('button').text()).to.equal('Filters');
      })
    });
  });
});
