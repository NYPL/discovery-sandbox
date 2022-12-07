/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import item from '../fixtures/libraryItems';

// Import the component that is going to be tested
import ItemTableRow from '../../src/app/components/Item/ItemTableRow';

describe('ItemTableRow - bib page view', () => {

  describe('Rendered row', () => {
    describe('Missing data item', () => {
      const data = item.missingData;
      let component;

      before(() => {
        component = mount(<ItemTableRow isDesktop={true} isBibPage={true} item={data} />);
      });

      it('should return a <tr>', () => {
        const tr = component.find('tr')
        expect(tr.prop('className')).to.equal('available');
      });

      it('should return five <td>', () => {
        expect(component.find('td').length).to.equal(5);
      });

      it('should not have a format as the third <td> column data', () => {
        expect(component.find('td').at(2).text()).to.equal(' ');
      });

      it('should not have an access message as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal(' ');
      });

      it('should have a status as the first <td> column data', () => {
        expect(component.find('td').at(0).text()).to.include('Available');
      });
    });

    describe('Full item', () => {
      const data = item.full;
      let component;

      before(() => {
        component = mount(<ItemTableRow isDesktop={true} includeVolColumn={true} isBibPage={true} item={data} />);
      });

      it('should return a <tr>', () => {
        expect(component.html().startsWith('<tr')).to.be.true;
      });

      it('should return six <td>', () => {
        expect(component.find('td').length).to.equal(6);
      });

      it('should have status links as the first <td> column data', () => {
        expect(component.find('td').at(0).text()).to.include('Available - Can be used');
      });

      it('should have a Vol/Date as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal('Vol. 1');
      });

      it('should have a format as the third <td> column data', () => {
        expect(component.find('td').at(2).text()).to.equal('Text');
      });

      it('should have an access as the fourth <td> column data', () => {
        expect(component.find('td').at(3).text()).to.equal('USE IN LIBRARY');
      });

      it('should have call number as the fifth <td> column data', () => {
        expect(component.find('td').at(4).text()).to.equal('JFE 07-5007 ---');
      });

      it('should have a location as the sixth <td> column data', () => {
        expect(component.find('td').at(5).text()).to.equal('SASB M1 - General Research - Room 315');
      });
    });
  });
})
