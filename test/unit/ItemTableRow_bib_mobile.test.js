/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import item from '../fixtures/libraryItems';

// Import the component that is going to be tested
import ItemTableRow from '../../src/app/components/Item/ItemTableRow';
import { MediaContext } from '../../src/app/components/Application/Application';

describe('ItemTableRow - mobile bib page view', () => {

  describe('Rendered row', () => {
    describe('Missing data item', () => {
      const data = item.missingData;
      let component;

      before(() => {
        component = mount(<ItemTableRow isDesktop={false} isBibPage={true} item={data} />);
      });

      it('should return a <tr>', () => {
        const tr = component.find('tr')
        expect(tr.prop('className')).to.equal('available');
      });

      it('should return two <td>', () => {
        expect(component.find('td').length).to.equal(3);
      });

      it('should not have a format as the third <td> column data', () => {
        expect(component.html()).to.not.include('format')
      });

      it('should not have an access message as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal(' ');
      });

      it('should have a status as the first <td> column data', () => {
        expect(component.find('td').at(0).text()).to.include('Available - Can be used on site');
      });
    });

    describe('Full item', () => {
      const data = item.full;
      let component;

      before(() => {
        component = mount(<ItemTableRow isDesktop={false} isBibPage={true} item={data} includeVolColumn={true} />);
      });

      it('should return a <tr>', () => {
        const tr = component.find('tr')
        expect(tr.prop('className')).to.equal('available');
      });

      it('should return three <td>', () => {
        expect(component.find('td').length).to.equal(3);
      });

      it('should have status links as the first <td> column data', () => {
        expect(component.find('td').at(0).text()).to.include('Available - Can be used on site');
      });

      it('should have a Vol/Date as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal('Vol. 1');
      });

      it('should have a format as the third <td> column data', () => {
        expect(component.find('td').at(2).text()).to.equal('Text');
      });
    });
  });
})
