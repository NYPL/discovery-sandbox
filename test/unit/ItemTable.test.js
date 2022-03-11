import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import ItemTable from './../../src/app/components/Item/ItemTable';

describe('ItemTable', () => {
  describe('No rendered table', () => {
    it('should return null with no props passed', () => {
      const component = shallow(<ItemTable />);
      expect(component.type()).to.equal(null);
    });

    it('should return null with no items passed', () => {
      const component = shallow(<ItemTable items={[]} />);
      expect(component.type()).to.equal(null);
    });

    it('should return null if items is not an array', () => {
      const stringItem = shallow(<ItemTable items='not an array' />);
      const objectItem = shallow(
        <ItemTable items={{ object: 'not an array' }} />,
      );

      expect(stringItem.type()).to.equal(null);
      expect(objectItem.type()).to.equal(null);
    });
  });

  describe('Basic <table> structure', () => {
    const data = [
      {
        status: { prefLabel: 'available' },
        accessMessage: { prefLabel: 'available' },
      },
      {
        status: { prefLabel: 'available' },
        accessMessage: { prefLabel: 'available' },
      },
      {
        status: { prefLabel: 'available' },
        accessMessage: { prefLabel: 'available' },
      },
    ];
    let component;

    before(() => {
      component = shallow(<ItemTable items={data} />);
    });

    it('should be wrapped in a table element', () => {
      expect(component.type()).to.equal('table');
      expect(component.find('table').length).to.equal(1);
      expect(component.find('table').prop('className')).to.equal(
        'nypl-basic-table',
      );
    });

    it('should have a <caption> element set to "Item details".', () => {
      expect(component.find('caption').length).to.equal(1);
      expect(component.find('caption').text()).to.equal('Item details');
    });

    it('should have a <thead> and a <tbody>', () => {
      expect(component.find('thead').length).to.equal(1);
      expect(component.find('tbody').length).to.equal(1);
    });

    describe('bib page', () => {
      before(() => {
        component = shallow(<ItemTable items={data} page='BibPage' />);
      });

      it('should have four headings <th> in the <thead>', () => {
        const header = component.find('thead');

        expect(header.find('th').length).to.equal(4);
        expect(header.find('th').at(0).text()).to.equal('Format');
        expect(header.find('th').at(1).text()).to.equal('Call Number');
        expect(header.find('th').at(2).text()).to.equal('Location');
        expect(header.find('th').at(3).text()).to.equal(
          'Availability & Access',
        );
      });

      it('should have the same number of <tr> elements as the item length.', () => {
        const tr = component.find('tbody').render().find('tr');
        expect(tr.length).to.equal(data.length);
      });
    });

    describe('Search Results page', () => {
      before(() => {
        component = shallow(<ItemTable items={data} page='SearchResults' />);
      });

      it('should have a <tr> with three headings <th> in the <thead>', () => {
        const header = component.find('thead');

        expect(header.find('tr').length).to.equal(1);
        expect(header.find('th').length).to.equal(3);
        expect(header.find('th').at(0).text()).to.equal('Format');
        expect(header.find('th').at(1).text()).to.equal('Call Number');
        expect(header.find('th').at(2).text()).to.equal('Item Location');
      });
    });

    describe('Subject Heading Explorer', () => {
      before(() => {
        component = shallow(<ItemTable items={data} page='SubjectHeading' />);
      });

      it('should have a <tr> with three <th> in the <thead>', () => {
        const header = component.find('thead');

        expect(header.find('tr').length).to.equal(1);
        expect(header.find('th').length).to.equal(3);
        expect(header.find('th').at(0).text()).to.equal('Format');
        expect(header.find('th').at(1).text()).to.equal('Call Number');
        expect(header.find('th').at(2).text()).to.equal('Item Location');
      });
    });
  });
});
