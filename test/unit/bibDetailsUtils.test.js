/* eslint-env mocha */

import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import {
  definitionItem,
  annotatedMarcDetails,
  combineBibDetailsData,
} from '../../src/app/utils/bibDetailsUtils';

describe('bibDetailsUtils', () => {
  describe('definitionItem', () => {
    const value = {
      label: 'ItemLabel',
      content: 'ItemContent',
      source: { itemSource: 'nypl' },
    };

    const item = definitionItem(value);

    it('should be a div', () => {
      expect(item.type).to.equal('div');
    });

    it('should default to index 0', () => {
      expect(item.key).to.equal('0');
    });

    it('should have a link with correct information', () => {
      const link = item.props.children[0];
      expect(link.type).to.equal('a');
      expect(link.props.href).to.equal('ItemContent');
      expect(link.props.title).to.equal(JSON.stringify(value.source, null, 2));
      expect(link.props.children).to.equal('ItemLabel');
    });

    it('should accept index param', () => {
      expect(definitionItem(value, 1).key).to.equal('1');
    });

    it('should default to content if label is not present', () => {
      const valueMissingLabel = {
        content: 'ItemContent',
        source: { itemSource: 'nypl' },
      };

      const itemMissingLabel = definitionItem(valueMissingLabel);

      expect(itemMissingLabel.props.children[0]).to.equal('ItemContent');
    });

    it('should display parallels if available', () => {
      const valueWithParallels = {
        label: 'ItemLabel',
        content: 'ItemContent',
        source: { itemSource: 'nypl' },
        parallels: 'Parallel',
      };

      const itemWithParallels = definitionItem(valueWithParallels);

      expect(itemWithParallels.props.children[1]).to.equal('Parallel');
    });
  });

  describe('annotatedMarcDetails', () => {
    it('should map fields in annotated marc to term,definition pairs, where term points to field label and definition points to list of definition items populated from field values', () => {
      const mockBib = {
        annotatedMarc: {
          bib: {
            fields: [
              {
                label: 'Field1',
                values: [
                  {
                    label: 'ItemLabel1',
                    content: 'ItemContent1',
                    source: { itemSource: 'nypl' },
                  },
                  {
                    label: 'ItemLabel2',
                    content: 'ItemContent2',
                    source: { itemSource: 'nypl' },
                  },
                ],
              },
              {
                label: 'Field2',
                values: [
                  {
                    label: 'ItemLabel3',
                    content: 'ItemContent3',
                    source: { itemSource: 'nypl' },
                  },
                  {
                    label: 'ItemLabel4',
                    content: 'ItemContent4',
                    source: { itemSource: 'nypl' },
                  },
                ],
              },
            ],
          },
        },
      };

      const mockOutput = annotatedMarcDetails(mockBib);
      expect(mockOutput.length).to.equal(2);
      expect(mockOutput[0].term).to.equal('Field1');
      expect(
        mockOutput[0].definition[0].props.children[0].props.children,
      ).to.equal('ItemLabel1');
      expect(
        mockOutput[0].definition[1].props.children[0].props.children,
      ).to.equal('ItemLabel2');
      expect(mockOutput[1].term).to.equal('Field2');
      expect(
        mockOutput[1].definition[0].props.children[0].props.children,
      ).to.equal('ItemLabel3');
      expect(
        mockOutput[1].definition[1].props.children[0].props.children,
      ).to.equal('ItemLabel4');
    });
  });

  describe('combineBibDetailsData', () => {
    it('should combine two lists, dropping items from second list whose term property already exists in first list', () => {
      const list1 = [
        { term: 'a', value: '1' },
        { term: 'c', value: '4' },
        { term: 'a', value: '2' },
        { term: 'b', value: '3' },
      ];

      const list2 = [
        { term: 'b', value: '7' },
        { term: 'a', value: '5' },
        { term: 'd', value: '9' },
        { term: 'a', value: '6' },
        { term: 'e', value: '10' },
        { term: 'd', value: '8' },
      ];

      expect(JSON.stringify(combineBibDetailsData(list1, list2))).to.equal(
        JSON.stringify([
          { term: 'a', value: '1' },
          { term: 'c', value: '4' },
          { term: 'a', value: '2' },
          { term: 'b', value: '3' },
          { term: 'd', value: '9' },
          { term: 'e', value: '10' },
          { term: 'd', value: '8' },
        ]),
      );
    });
  });
});
