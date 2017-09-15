/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import SelectedFilters from '../../src/app/components/Filters/SelectedFilters';

const listItemAt = (component, n) => component.find('li').at(n);

describe('SelectedFilters', () => {
  describe('Default', () => {
    it('should not render a ul', () => {
      const component = mount(<SelectedFilters />);
      expect(component.find('ul').length).to.equal(0);
    });
  });

  describe('With Data', () => {
    describe('With two language filters', () => {
      const selectedFilters = {
        language: [
          {
            value: 'lang:fr',
            label: 'French',
            count: 145,
          },
          {
            value: 'lang:en',
            label: 'English',
            count: 4267,
          },
        ],
        materialType: [],
        dateBefore: '',
        dateAfter: '',
      };
      let component;

      before(() => {
        component = mount(<SelectedFilters selectedFilters={selectedFilters} />);
      });

      it('should render a ul', () => {
        expect(component.find('ul').length).to.equal(1);
      });

      it('should render two list items', () => {
        expect(component.find('li').length).to.equal(2);
      });

      it('should have one button inside each list item with the filter name', () => {
        expect(listItemAt(component, 0).find('button').length).to.equal(1);
        expect(listItemAt(component, 0).find('button').text()).to.equal('FrenchClose Icon');

        expect(listItemAt(component, 1).find('button').length).to.equal(1);
        expect(listItemAt(component, 1).find('button').text()).to.equal('EnglishClose Icon');
      });
    });

    describe('With two language filters and two materialType filters', () => {
      const selectedFilters = {
        language: [
          {
            value: 'lang:fr',
            label: 'French',
            count: 145,
            selected: true,
          },
          {
            value: 'lang:en',
            label: 'English',
            count: 4267,
            selected: true,
          },
        ],
        materialType: [
          {
            value: 'resourcetypes:img',
            label: 'Still Image',
            count: 145,
            selected: true,
          },
          {
            value: 'resourcetypes:car',
            label: 'Cartographic',
            count: 4267,
            selected: true,
          },
        ],
        dateBefore: '',
        dateAfter: '',
      };
      let component;

      before(() => {
        component = mount(<SelectedFilters selectedFilters={selectedFilters} />);
      });

      it('should render four list items', () => {
        expect(component.find('li').length).to.equal(4);
      });

      it('should have one button inside each list item with the filter name', () => {
        expect(listItemAt(component, 0).find('button').length).to.equal(1);
        expect(listItemAt(component, 0).find('button').text()).to.equal('FrenchClose Icon');

        expect(listItemAt(component, 1).find('button').length).to.equal(1);
        expect(listItemAt(component, 1).find('button').text()).to.equal('EnglishClose Icon');

        expect(listItemAt(component, 2).find('button').length).to.equal(1);
        expect(listItemAt(component, 2).find('button').text()).to.equal('Still ImageClose Icon');

        expect(listItemAt(component, 3).find('button').length).to.equal(1);
        expect(listItemAt(component, 3).find('button').text()).to.equal('CartographicClose Icon');
      });
    });
  });
});
