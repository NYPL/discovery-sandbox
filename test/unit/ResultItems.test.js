/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import ResultItems from './../../src/app/components/Results/ResultItems.jsx';

const items = {
  single: [
    {
      id: 'b19707253-i29470386',
      status: 'Available ',
      availability: 'available',
      available: true,
      location: 'SASB - Rose Main Rdg Rm 315 (requested from offsite storage)',
      callNumber: '|hMAB (Shaw, T. L. War on critics)',
      url: '/hold/request/b19707253-i29470386',
      actionLabel: 'Request for in-library use',
      actionLabelHelper: 'for War on critics. for use in library',
    },
  ],
  six: [
    {
      id: 'b18207658-i24609507',
      status: 'Available ',
      availability: 'available',
      available: true,
      location: 'SASB - Rose Main Rdg Rm 315 (requested from offsite storage)',
      callNumber: '|hVWZW (War Department technical manual)',
      url: '/hold/request/b18207658-i24609507',
      actionLabel: 'Request for in-library use',
      actionLabelHelper: 'for War Department technical manual. for use in library',
    },
    {
      id: 'b18207658-i24609507',
      status: 'Available ',
      availability: 'available',
      available: true,
      location: 'SASB - Rose Main Rdg Rm 315 (requested from offsite storage)',
      callNumber: '|hVWZW (War Department technical manual)',
      url: '/hold/request/b18207658-i24609507',
      actionLabel: 'Request for in-library use',
      actionLabelHelper: 'for War Department technical manual. for use in library',
    },
    {
      id: 'b18207658-i24609507',
      status: 'Available ',
      availability: 'available',
      available: true,
      location: 'SASB - Rose Main Rdg Rm 315 (requested from offsite storage)',
      callNumber: '|hVWZW (War Department technical manual)',
      url: '/hold/request/b18207658-i24609507',
      actionLabel: 'Request for in-library use',
      actionLabelHelper: 'for War Department technical manual. for use in library',
    },
    {
      id: 'b18207658-i24609507',
      status: 'Available ',
      availability: 'available',
      available: true,
      location: 'SASB - Rose Main Rdg Rm 315 (requested from offsite storage)',
      callNumber: '|hVWZW (War Department technical manual)',
      url: '/hold/request/b18207658-i24609507',
      actionLabel: 'Request for in-library use',
      actionLabelHelper: 'for War Department technical manual. for use in library',
    },
    {
      id: 'b18207658-i24609507',
      status: 'Available ',
      availability: 'available',
      available: true,
      location: 'SASB - Rose Main Rdg Rm 315 (requested from offsite storage)',
      callNumber: '|hVWZW (War Department technical manual)',
      url: '/hold/request/b18207658-i24609507',
      actionLabel: 'Request for in-library use',
      actionLabelHelper: 'for War Department technical manual. for use in library',
    },
    {
      id: 'b18207658-i24609507',
      status: 'Available ',
      availability: 'available',
      available: true,
      location: 'SASB - Rose Main Rdg Rm 315 (requested from offsite storage)',
      callNumber: '|hVWZW (War Department technical manual)',
      url: '/hold/request/b18207658-i24609507',
      actionLabel: 'Request for in-library use',
      actionLabelHelper: 'for War Department technical manual. for use in library',
    },
  ],
};

describe('ResultItems', () => {
  describe('Default component', () => {
    let component;

    before(() => {
      component = shallow(<ResultItems />);
    });

    it('should return null', () => {
      expect(component.type()).to.equal(null);
    });
  });

  describe('Default component with empty items', () => {
    let component;

    before(() => {
      component = shallow(<ResultItems items={[]} />);
    });

    it('should return null', () => {
      expect(component.type()).to.equal(null);
    });
  });

  describe('Renders an unordered list', () => {
    let component;

    before(() => {
      component = shallow(<ResultItems items={items.single} itemTitle="War on critics" />);
    });

    it('should render a div with wrapper class "result-item-formats"', () => {
      expect(component.type()).to.equal('div');
      expect(component.hasClass('result-item-formats')).to.be.true;
    });

    it('should have a single list item', () => {
      expect(component.find('.sub-item')).to.have.length(1);
    });
  });

  describe('Renders a single physical item with a "hold" button', () => {
    let component;

    before(() => {
      component = shallow(<ResultItems items={items.single} itemTitle="War on critics" />);
    });

    it('should display that the item is available at SASB and call number', () => {
      expect(component.find('.sub-item').children().first().text()).to.equal(
        'SASB - Rose Main Rdg Rm 315 (requested from offsite storage)'
      );
    });

    it('should have a link with label "Request for in-library use"', () => {
      expect(component.find('.request-hold-link').text())
        .to.equal('Request for in-library use');
    });

    it('should have a descriptive aria label', () => {
      expect(component.find('.sub-items').props()['aria-label']).to.equal('This bibliographical record has 1 item.');
    });
  });

  describe('Renders six physical items and a "more" link but displays only five items', () => {
    let component;
    let moreLink;

    before(() => {
      component =
        shallow(<ResultItems items={items.six} itemTitle="War Department technical manual." />);
      moreLink = component.find('.see-more-link')
    });

    it('should seven list items, six bib items and one "more" list item', () => {
      expect(component.find('.sub-item')).to.have.length(7);
    });

    it('should have a descriptive aria label', () => {
      expect(component.find('.sub-items').props()['aria-label']).to.equal('This bibliographical record has 6 items.');
    });

    it('should have the last bib item with a class of "more"', () => {
      expect(
        // The second to last li element has a div with the "more" class.
        component.find('.sub-items tbody').childAt(5).hasClass('sub-item more')
      ).to.be.true;
    });

    it('should have a "more" list item as the last list item', () => {
      expect(moreLink.type()).to.equal('a');
      expect(moreLink.hasClass('see-more-link')).to.be.true;
    });

    it('should have a descriptive label to see more items', () => {
      expect(moreLink.text()).to.equal('See 1 more item in collapsed menu for War Department' +
      ' technical manual.');
    });
  });

  describe('Click on the "more" link and display all items', () => {
    let component;
    let moreLink;

    before(() => {
      component =
        shallow(<ResultItems items={items.six} itemTitle="War Department technical manual." />);
      moreLink = component.find('.see-more-link')
    });

    // This is the hidden item.
    it('should have the last bib item with a class of "more"', () => {
      // The last bib item li element has a div with the "more" class which hides it
      expect(
        component.find('.sub-items tbody').childAt(5).hasClass('sub-item more')
      ).to.be.true;
    });

    it('should have a "more" list item', () => {
      moreLink.simulate('click', { preventDefault() {} });

      // Clicking on the "more" link unhides elements, in this case only one more bib item
      expect(
        component.find('.sub-items tbody').childAt(5).hasClass('sub-item')
      ).to.be.true;
    });
  });
}); /* End of ResultItems component */
