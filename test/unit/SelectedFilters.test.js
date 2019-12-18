/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';


import SelectedFilters from '../../src/app/components/Filters/SelectedFilters';

const listItemAt = (component, n) => component.find('li').at(n);

Enzyme.configure({ adapter: new Adapter() });
describe('SelectedFilters', () => {
  describe('Default', () => {
    it('should not render a div', () => {
      const component = mount(<SelectedFilters />);
      expect(component.find('div').length).to.equal(0);
    });
  });

  describe('No JS - clear all link', () => {
    const selectedFilters = {
      language: [
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
      component = shallow(<SelectedFilters selectedFilters={selectedFilters} />);
    });

    it('should render a ul', () => {
      expect(component.find('ul').length).to.equal(1);
    });

    it('should render one list item', () => {
      expect(component.find('li').length).to.equal(1);
    });

    it('should have a clear all filters link', () => {
      expect(component.find('a').length).to.equal(2);
      // The first <a> element is the selected filter link.
      expect(component.find('a').at(1).render().text()).to.equal('Clear FiltersNYPL Filter SVG Icon');
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

      it('should have a clear all filters button', () => {
        expect(component.find('button').length).to.equal(3);
        expect(component.find('button').at(2).text()).to.equal('Clear FiltersNYPL Filter SVG Icon');
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
        expect(listItemAt(component, 3).find('button').text())
          .to.equal('CartographicClose Icon');
      });
    });

    describe('Date filters', () => {
      describe('With dateBefore filters', () => {
        const selectedFilters = {
          language: [],
          materialType: [],
          dateBefore: '2010',
          dateAfter: '',
        };
        let component;

        before(() => {
          component = mount(<SelectedFilters selectedFilters={selectedFilters} />);
        });

        it('should render one list items', () => {
          expect(component.find('li').length).to.equal(1);
        });

        it('should have one button inside each list item with the filter name', () => {
          expect(listItemAt(component, 0).find('button').length).to.equal(1);
          expect(listItemAt(component, 0).find('button').text()).to.equal('Before 2010Close Icon');
        });
      });

      describe('With dateAfter filters', () => {
        const selectedFilters = {
          language: [],
          materialType: [],
          dateBefore: '',
          dateAfter: '1999',
        };
        let component;

        before(() => {
          component = mount(<SelectedFilters selectedFilters={selectedFilters} />);
        });

        it('should render one list items', () => {
          expect(component.find('li').length).to.equal(1);
        });

        it('should have one button inside each list item with the filter name', () => {
          expect(listItemAt(component, 0).find('button').length).to.equal(1);
          expect(listItemAt(component, 0).find('button').text()).to.equal('After 1999Close Icon');
        });
      });

      describe('With dateBefore and dateAfter filters', () => {
        const selectedFilters = {
          language: [],
          materialType: [],
          dateBefore: '2010',
          dateAfter: '1999',
        };
        let component;

        before(() => {
          component = mount(<SelectedFilters selectedFilters={selectedFilters} />);
        });

        it('should render two list items', () => {
          expect(component.find('li').length).to.equal(2);
        });

        it('should have one button inside each list item with the filter name', () => {
          expect(listItemAt(component, 0).find('button').length).to.equal(1);
          expect(listItemAt(component, 0).find('button').text()).to.equal(' 2010Close Icon');

          expect(listItemAt(component, 1).find('button').length).to.equal(1);
          expect(listItemAt(component, 1).find('button').text()).to.equal(' 1999Close Icon');
        });
      });
    });
  });


  describe('Dropdown opening and closing', () => {
    let component;
    const selectedFilters = {
      subjectLiteral: [{ value: 'Counting.', label: 'Counting.' }],
      language: [{ selected: true, value: 'lang:spa', count: 11, label: 'Spanish' }],
    };

    describe('When dropdown is closed', () => {
      before(() => {
        component = mount(
          <SelectedFilters selectedFilters={selectedFilters} dropdownOpen={false} />,
        );
      });

      it('Should display subject filter', () => {
        expect(listItemAt(component, 0).find('button').text()).to.contain('Counting');
      });

      it('Should display non-subject filter', () => {
        expect(listItemAt(component, 1).find('button').text()).to.contain('Spanish');
      });

      it('Should display clear filters button', () => {
        expect(component.find('button').at(2).text()).to.contain('Clear Filters');
      });
    });

    describe('When dropdown is open', () => {
      before(() => {
        component = mount(
          <SelectedFilters selectedFilters={selectedFilters} dropdownOpen />,
        );
      });

      it('Should dislay subject filter', () => {
        expect(listItemAt(component, 0).find('button').text()).to.contain('Counting');
      });

      it('Should not extra clear filter button', () => {
        expect(component.find('li').length).to.equal(2);
      });
    });
  });
});
