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
  describe('with options', () => {
    let component;
    before(() => {
      component = mount(
        <ItemFiltersMobile
          options={formatOptions}
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
      
    });
  });
});
