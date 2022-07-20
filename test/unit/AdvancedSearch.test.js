/* eslint-disable react/jsx-filename-extension */
/* eslint-env mocha */
import React from 'react';
import PropTypes from 'prop-types';
import { expect } from 'chai';
// import { mount } from 'enzyme';
import { mountTestRender, makeTestStore } from '../helpers/store';
import { mockRouterContext } from '../helpers/routing';
import AdvancedSearch from '../../src/app/components/AdvancedSearch/AdvancedSearch';


const aggregations = require('../../advancedSearchAggregations.json');

describe('AdvancedSearch', () => {
  const context = mockRouterContext();
  const childContextTypes = {
    router: PropTypes.object,
    media: PropTypes.string,
  };

  describe('Initial render', () => {
    let component;

    before(() => {
      const mockStore = makeTestStore();
      component = mountTestRender(<AdvancedSearch />, {
        context,
        childContextTypes,
        store: mockStore,
      }).find('AdvancedSearch');
    });

    it('should render inside an SCC Container', () => {
      expect(component.find('SccContainer').length).to.eql(1);
    });

    it('should not display the alert message', () => {
      expect(component.find('aside').length).to.eql(0);
    });

    it('should have an h2 announcing advanced search', () => {
      expect(component.find('h2').at(0).text()).to.eql('Advanced Search');
    });

    it('should have an advanced search form', () => {
      expect(component.find('form').length).to.eql(1);
    });

    it('should have labelled inputs for keyword', () => {
      const keywordLabel = component.find('label').at(0);
      const keywordInput = component.find('input').at(0);

      expect(keywordLabel.text()).to.eql('Keyword');
      expect(keywordLabel.prop('htmlFor')).to.eql('searchKeywords');
      expect(keywordLabel.prop('id')).to.eql('searchKeywords-label');
      expect(keywordInput.prop('id')).to.eql('searchKeywords');
    });

    it('should have labelled inputs for title', () => {
      const titleLabel = component.find('label').at(1);
      const titleInput = component.find('input').at(1);

      expect(titleLabel.text()).to.eql('Title');
      expect(titleLabel.prop('htmlFor')).to.eql('title');
      expect(titleLabel.prop('id')).to.eql('title-label');
      expect(titleInput.prop('id')).to.eql('title');
    });

    it('should have labelled inputs for author', () => {
      const authorLabel = component.find('label').at(2);
      const authorInput = component.find('input').at(2);

      expect(authorLabel.text()).to.eql('Author');
      expect(authorLabel.prop('htmlFor')).to.eql('contributor');
      expect(authorLabel.prop('id')).to.eql('contributor-label');
      expect(authorInput.prop('id')).to.eql('contributor');
    });

    it('should have labelled inputs for subject', () => {
      const subjectLabel = component.find('label').at(3);
      const subjectInput = component.find('input').at(3);

      expect(subjectLabel.text()).to.eql('Subject');
      expect(subjectLabel.prop('htmlFor')).to.eql('subject');
      expect(subjectLabel.prop('id')).to.eql('subject-label');
      expect(subjectInput.prop('id')).to.eql('subject');
    });

    it('should have labelled inputs for dateBefore', () => {
      const dateBeforeLabel = component.find('label').at(7);
      const dateBeforeInput = component.find('input').at(5);

      expect(dateBeforeLabel.text()).to.eql('To');
      expect(dateBeforeLabel.prop('htmlFor')).to.eql('dateBefore');
      expect(dateBeforeLabel.prop('id')).to.eql('dateBefore-label');
      expect(dateBeforeInput.prop('id')).to.eql('dateBefore');
    });

    it('should have labelled inputs for dateAfter', () => {
      const dateAfterLabel = component.find('label').at(6);
      const dateAfterInput = component.find('input').at(4);

      expect(dateAfterLabel.text()).to.eql('From');
      expect(dateAfterLabel.prop('htmlFor')).to.eql('dateAfter');
      expect(dateAfterLabel.prop('id')).to.eql('dateAfter-label');
      expect(dateAfterInput.prop('id')).to.eql('dateAfter');
    });

    it('should have checkboxes for materialTypes', () => {
      const materialTypes = [
        { value: 'resourcetypes:aud', label: 'Audio' },
        { value: 'resourcetypes:car', label: 'Cartographic' },
        { value: 'resourcetypes:mix', label: 'Mixed material' },
        { value: 'resourcetypes:mov', label: 'Moving image' },
        { value: 'resourcetypes:mul', label: 'Multimedia' },
        { value: 'resourcetypes:not', label: 'Notated music' },
        { value: 'resourcetypes:img', label: 'Still image' },
        { value: 'resourcetypes:txt', label: 'Text' },
      ];
      expect(component.find('label').at(8).text()).to.eql('Format');
      expect(component.find('label').at(8).prop('htmlFor')).to.eql('formats');
      expect(component.find('input[type="checkbox"]').length).to.eql(8);

      // The structure for the checkboxes is:
      //   <label><input type="checkbox" />{labelText}</label>
      // In order to get the text, we first need to find the label which starts
      // at the 9th index in the array of all `label` elements.
      const firstCheckboxLabel = 9;
      for (let i = 0; i < materialTypes.length; i += 1) {
        const materialType = materialTypes[i];
        expect(component.find('input[type="checkbox"]').at(i).prop("id")).to.equal(materialType.value);
        expect(component.find('label').at(firstCheckboxLabel + i).text()).to.equal(materialType.label);
        expect(component.find('input[type="checkbox"]').at(i).prop("value")).to.equal(materialType.value);
        expect(component.find('input[type="checkbox"]').at(i).prop("name")).to.equal(materialType.value);
      }
    });

    it('should have a select for languages', () => {
      expect(component.find('select').length).to.eql(1);
      expect(component.find('select').prop('id')).to.eql('languageSelect');
      expect(component.find('select').find('option').length).to.eql(aggregations.language.length + 1);
      expect(component.find('label').at(4).text()).to.eql('Language');
      expect(component.find('label').at(4).prop('htmlFor')).to.eql('languageSelect');
      expect(component.find('label').at(4).prop('id')).to.eql('languageSelect-label');
    });
  });

  // describe('Rendering after alert', () => {
  //   let component;
  //
  //   before(() => {
  //     const mockStore = makeTestStore();
  //     component = mountTestRender(<AdvancedSearch />, {
  //       context,
  //       childContextTypes,
  //       store: mockStore,
  //     });
  //
  //     component.find('form').at(0).simulate('submit');
  //     component.update();
  //   });
  //
  //   it('should have an aside', () => {
  //     console.log('state: ', JSON.stringify(component.instance().state, null, 2));
  //     expect(component.find('aside').length).to.eql(1);
  //   });
  // });
  //
  // describe('Submitting form');
  //
  // describe('Clear Button');
});
