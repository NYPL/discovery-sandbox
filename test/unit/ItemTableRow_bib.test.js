/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import item from '../fixtures/libraryItems';

// Import the component that is going to be tested
import ItemTableRow from '../../src/app/components/Item/ItemTableRow';

describe.only('ItemTableRow - bib page view', () => {
  describe('No rendered row', () => {
    it('should return null with no props passed', () => {
      const component = shallow(<ItemTableRow />);
      expect(component.type()).to.equal(null);
    });

    it('should return null with no items passed', () => {
      const component = shallow(<ItemTableRow item={{}} />);
      expect(component.type()).to.equal(null);
    });

    it('should return null if the item is an electronic resource', () => {
      const component = shallow(<ItemTableRow item={{ isElectronicResource: true }} />);

      expect(component.type()).to.equal(null);
    });
  });

  describe('Rendered row', () => {
    describe('Missing data item', () => {
      const data = item.missingData;
      let component;

      before(() => {
        component = shallow(<ItemTableRow isBibPage={true} item={data} />);
      });

      it('should return a <tr>', () => {
        expect(component.type()).to.equal('tr');
        expect(component.prop('className')).to.equal('available');
      });

      it('should return six <td>', () => {
        expect(component.find('td').length).to.equal(6);
      });

      it('should not have a format as the third <td> column data', () => {
        expect(component.find('td').at(2).text()).to.equal(' ');
      });

      it('should not have an access message as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal('');
      });

      it('should not have a status as the third <td> column data', () => {
        expect(component.find('td').at(2).text()).to.equal(' ');
      });
    });

    describe('Full item', () => {
      const data = item.full;
      let component;

      before(() => {
        component = shallow(<ItemTableRow isBibPage={true} item={data} />);
      });

      it('should return a <tr>', () => {
        expect(component.type()).to.equal('tr');
        expect(component.prop('className')).to.equal('available');
      });

      it('should return six <td>', () => {
        expect(component.find('td').length).to.equal(6);
      });

      it('should have status links as the first <td> column data', () => {
        expect(component.find('td').at(0).text()).to.equal('<StatusLinks />');
      });

      it('should have a Vol/Date as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal('');
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
