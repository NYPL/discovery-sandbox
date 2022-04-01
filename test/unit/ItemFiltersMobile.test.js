/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import ItemFiltersMobile from './../../src/app/components/Item/ItemFiltersMobile';

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

describe('ItemFiltersMobile', () => {
  describe('default rendering', () => {
    it('should not render without props', () => {
      const component = shallow(<ItemFiltersMobile />, { context });
      expect(component.type()).to.equal(null);
    });
  });
  describe('with props', () => {
    let component;
    before(() => {
      const initialFilters = {
        format: [],
        status: [],
        location: [],
      };
      component = mount(
        <ItemFiltersMobile
          options={formatOptions}
          setSelectedFilters={() => undefined}
          submitFilterSelections={() => undefined}
          initialFilters={initialFilters}
          selectedFilters={initialFilters}
        />,
      );
    });

    describe('closed state', () => {
      it('should render "Filters" button for closed state', () => {
        const closedStateButton = component.find('button');
        expect(closedStateButton.length).to.equal(1);
        expect(closedStateButton.find('button').text()).to.equal('Filters');
      });
      it('should open on click of closed state button', () => {
        const closedStateButton = component.find('button');
        closedStateButton.simulate('click');
      });
    });

    describe('open state', () => {
      let goBackButton;
      let closedStateButton;
      let showResultsButton;
      it('should render a `Modal` from Design System', () => {
        expect(component.find('Modal').length).to.equal(1);
      });

      it('should render `ItemFilter` for option types passed', () => {
        expect(component.find('.item-filter').hostNodes().length).to.equal(1);
      });

      describe('"Go Back" button', () => {
        it('should render a "Go Back" button', () => {
          goBackButton = component.find('button').at(0);
          expect(goBackButton.text()).to.equal('Go Back');
        });
        it('should close when "Go Back" is clicked', () => {
          goBackButton.simulate('click');
          closedStateButton = component.find('button');
          expect(component.find('Modal').length).to.equal(0);
          expect(closedStateButton.length).to.equal(1);
          expect(closedStateButton.find('button').text()).to.equal('Filters');
        });
      });

      describe('"Show Results" button', () => {
        it('should render a "Show Results" button', () => {
          // re-open modal
          closedStateButton = component.find('button');
          closedStateButton.simulate('click');
          showResultsButton = component.find('button').at(1);
          expect(showResultsButton.text()).to.equal('Show Results');
        });
        it('should close when "Show Results" is clicked', () => {
          showResultsButton.simulate('click');
          expect(closedStateButton.length).to.equal(1);
          expect(component.find('Modal').length).to.equal(0);
          expect(closedStateButton.find('button').text()).to.equal('Filters');
        });
      });
    });
  });
});
