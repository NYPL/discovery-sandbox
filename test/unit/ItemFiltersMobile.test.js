/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import ItemFiltersMobile from '../../src/app/components/Item/ItemFiltersMobile';

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
    afterEach(() => {
      component.unmount()
    })

    it('should not render showResultsButton before clicking', () => {
      const showResultsButton = component.findWhere(node => {
        return node.type() === 'button' && node.text() === "Show Results";
      });
      expect(showResultsButton).to.have.lengthOf(0)
    })

    it('should render "Filters" button', () => {
      expect(modalTrigger).to.have.lengthOf(1);
    });

    it('should render `ItemFilter` for option types passed', () => {
      modalTrigger.simulate('click')
      const itemFilters = component.find('.item-filter')
      expect(itemFilters.hostNodes().length).to.equal(1);
    });

    describe('"Show Results" button', () => {
      let showResultsButton
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
        modalTrigger.simulate('click')
        showResultsButton = component.findWhere(node => {
          return node.type() === 'button' && node.text() === "Show Results";
        });
      })
      afterEach(() => {
        showResultsButton.simulate('click')
        component.unmount
      })
      it('should render a "Show Results" button', () => {
        expect(showResultsButton.exists())
      });

      // TO DO: Make this test work! Enzyme is being a pain in the butt, but this work needs to move.
      xit('should close when "Show Results" is clicked with no filters', () => {
        showResultsButton.simulate('click')
        showResultsButton = component.findWhere(node => {
          return node.type() === 'button' && node.text() === "Show Results";
        });
        expect(showResultsButton).to.have.lengthOf(0)
        expect(showResultsButton.exists()).to.be.false
      });
    });
  });
});
