/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import FieldsetList from '../../src/app/components/Filters/FieldsetList';

const listItemAt = (component, n) => component.find('li').at(n);

describe('FilterPopup', () => {
  // describe('Default', () => {
  //   let component;
  //
  //   before(() => {
  //     component = mount(<FieldsetList />);
  //   });
  //
  //   // TODO: Enzyme doesn't seem to check when components are null ??
  //   // it('should return null', () => {
  //   //   expect(component.get(0)).to.equal(false);
  //   // });
  // });

  describe('Default', () => {
    const languageFilter = {
      values: [
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
        {
          value: 'lang:sp',
          label: 'Spanish',
          count: 1245,
        },
      ],
    };
    const legend = 'Language';
    let component;

    before(() => {
      component = mount(<FieldsetList filter={languageFilter} legend={legend} />);
    });

    it('should render a fieldset', () => {
      expect(component.find('fieldset').length).to.equal(1);
    });

    it('should render a legend with text Language', () => {
      expect(component.find('legend').length).to.equal(1);
      expect(component.find('legend').text()).to.equal('Language');
    });

    it('should render a ul', () => {
      expect(component.find('ul').length).to.equal(1);
    });

    it('should render three list items', () => {
      expect(component.find('li').length).to.equal(3);
    });

    it('should have an input and label for each list item', () => {
      expect(listItemAt(component, 0).find('input').length).to.equal(1);
      expect(listItemAt(component, 0).find('label').length).to.equal(1);

      expect(listItemAt(component, 1).find('input').length).to.equal(1);
      expect(listItemAt(component, 1).find('label').length).to.equal(1);

      expect(listItemAt(component, 2).find('input').length).to.equal(1);
      expect(listItemAt(component, 2).find('label').length).to.equal(1);
    });

    it('should render the filter information for each list item', () => {
      const firstItem = listItemAt(component, 0);
      const secondItem = listItemAt(component, 1);
      const thirdItem = listItemAt(component, 2);

      expect(firstItem.find('input').length).to.equal(1);
      expect(firstItem.find('input').prop('id')).to.equal('French-label');
      expect(firstItem.find('label').length).to.equal(1);
      expect(firstItem.find('label').text()).to.equal('French (145)');

      expect(secondItem.find('input').length).to.equal(1);
      expect(secondItem.find('input').prop('id')).to.equal('English-label');
      expect(secondItem.find('label').length).to.equal(1);
      expect(secondItem.find('label').text()).to.equal('English (4,267)');

      expect(thirdItem.find('input').length).to.equal(1);
      expect(thirdItem.find('input').prop('id')).to.equal('Spanish-label');
      expect(thirdItem.find('label').length).to.equal(1);
      expect(thirdItem.find('label').text()).to.equal('Spanish (1,245)');
    });
  });
});
