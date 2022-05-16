import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import DefinitionNoteField from '../../src/app/components/BibPage/components/DefinitionNoteField';
import DirectionalText from '../../src/app/components/BibPage/components/DirectionalText';

describe('DefinitionNoteField', () => {
  describe('With No Parallel', () => {
    const values = [
      {
        'noteType': 'Supplement',
        '@type': 'bf:Note',
        'prefLabel': 'Has supplement, <2012-2016>: Pojedinačno.',
        'parallel': [
          null,
          {
            'noteType': 'Supplement',
            '@type': 'bf:Note',
            'prefLabel': 'Has supplement, <2012-2016>: Pojedinačno.',
          },
        ],
      },
    ];

    const component = shallow(<DefinitionNoteField values={values} />);

    it('should render an unordered list element w/ one list item element', () => {
      expect(component.type()).to.equal('ul');
      expect(component.children()).to.have.lengthOf(
        values[0].parallel.filter(Boolean).length,
      );
      expect(component.children().type()).to.equal('li');
    });

    it('should pass prefLabel to DirectionalText', () => {
      const directWrapper = component.children().children();
      expect(directWrapper.type()).to.equal(DirectionalText);
      expect(directWrapper.prop('text')).to.equal(values[0].prefLabel);
    });
  });

  describe('With Parallel', () => {
    const values = [
      {
        'noteType': 'Issued By',
        '@type': 'bf:Note',
        'prefLabel': 'Issued by: Narodna biblioteka Kraljevo.',
        'parallel': [
          'Issued by: Народна библиотека Краљево.',
          {
            'noteType': 'Issued By',
            '@type': 'bf:Note',
            'prefLabel': 'Issued by: Narodna biblioteka Kraljevo.',
          },
        ],
      },
    ];

    const component = shallow(<DefinitionNoteField values={values} />);

    it('should render an unordered list element w/ two list item elements', () => {
      expect(component.type()).to.equal('ul');
      expect(component.children()).to.have.lengthOf(
        values[0].parallel.filter(Boolean).length,
      );
      expect(
        component.children().everyWhere((value) => {
          return value.type() === 'li';
        }),
      ).to.equal(true);
    });

    it('should render parallel first', () => {
      expect(component.childAt(0).children().type()).to.equal(DirectionalText);
      expect(component.childAt(0).children().prop('text')).to.equal(
        values[0].parallel[0],
      );
    });

    it('should render prefLabel second', () => {
      expect(component.childAt(1).children().type()).to.equal(DirectionalText);
      expect(component.childAt(1).children().prop('text')).to.equal(
        values[0].prefLabel,
      );
    });
  });
});
