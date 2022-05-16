import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';
import DirectionalText from '../../src/app/components/BibPage/components/DirectionalText';
import DefinitionField from '../../src/app/components/BibPage/components/DefinitionField';
import { isEmpty, normalizeLiteral } from '../../src/app/utils/utils';
import LinkableBibField from '../../src/app/components/BibPage/components/LinkableField';
import IdentifierField from '../../src/app/components/BibPage/components/IdentifierField';
import SubjectLiteralBibField from '../../src/app/components/BibPage/components/SubjectLiteralBibField';

describe('Linkable Field ', () => {
  const field_Link = {
    label: 'Author',
    value: 'creatorLiteral',
    linkable: true,
  };
  const field_NoLink = { label: 'Title', value: 'titleDisplay' };
  const field_SelfLink = {
    label: 'Supplementary Content',
    value: 'supplementaryContent',
    linkable: true,
    selfLinkable: true,
  };
  const field_Ident = {
    label: 'ISBN',
    value: 'identifier',
    identifier: 'bf:Isbn',
  };
  const field_SubLit = {
    label: 'Subject',
    value: 'subjectLiteral',
    linkable: true,
  };

  describe('Nullable', () => {
    describe('Values', () => {
      const component = mount(<DefinitionField />);

      it('should return NULL if NO props', () => {
        expect(component.isEmptyRender()).to.equal(true);
        expect(isEmpty(component.props())).to.equal(true);
      });

      it('should return NULL if NO values', () => {
        component.setProps({ field: field_Link });

        expect(component.props()).to.include({ field: field_Link });
        expect(component.isEmptyRender()).to.equal(true);
        expect(!isEmpty(component.props())).to.equal(true);
      });

      it('should return NULL if values is a string', () => {
        const values = 'should not work';
        component.setProps({ values });

        expect(component.props()).to.include({ values });
        expect(component.isEmptyRender()).to.equal(true);
        expect(!isEmpty(component.props())).to.equal(true);
      });

      it('should return NULL if values is a non array object', () => {
        const values = {};
        component.setProps({ values });

        expect(component.props()).to.include({ values });
        expect(component.isEmptyRender()).to.equal(true);
        expect(!isEmpty(component.props())).to.equal(true);
      });

      it('should return NULL if values is an empty array', () => {
        const values = [];
        component.setProps({ values });

        expect(component.props()).to.include({ values });
        expect(component.isEmptyRender()).to.equal(true);
        expect(!isEmpty(component.props())).to.equal(true);
      });
    });

    describe('Field', () => {
      const component = mount(<DefinitionField />);

      it('should return NULL if NO field', () => {
        const values = [];
        component.setProps({ values });

        expect(component.props()).to.include({ values });
        expect(component.isEmptyRender()).to.equal(true);
        expect(!isEmpty(component.props())).to.equal(true);
      });

      it('should return NULL if field is an array', () => {
        const field = [];
        component.setProps({ field });

        expect(component.props()).to.include({ field });
        expect(component.isEmptyRender()).to.equal(true);
        expect(!isEmpty(component.props())).to.equal(true);
      });

      it('should return NULL if field is an empty non array object', () => {
        const field = {};
        component.setProps({ field });

        expect(component.props()).to.include({ field });
        expect(component.isEmptyRender()).to.equal(true);
        expect(!isEmpty(component.props())).to.equal(true);
      });
    });
  });

  describe('Renderable', () => {
    describe('Base', () => {
      const values = ['display me'];
      const component = shallow(
        <DefinitionField values={values} field={field_NoLink} />,
      );

      it('should return an unordered list element', () => {
        expect(component.isEmptyRender()).to.equal(false);
        expect(component.type()).to.equal('ul');
      });

      it('should return an unordered list element with one list item', () => {
        values.push(null);
        component.setProps({ values });

        expect(component.children()).to.have.lengthOf(values.length - 1);
        expect(component.childAt(0).type()).to.equal('li');
      });

      it('should return a DrectionalText component', () => {
        const liEl = component.childAt(0);
        expect(liEl.children()).to.have.lengthOf(values.length - 1);
        expect(liEl.children().type()).to.equal(DirectionalText);
        expect(liEl.childAt(0).props()).to.include({ text: values[0] });
      });
    });

    describe('Linkable', () => {
      const values = ['display me'];
      const component = shallow(
        <DefinitionField values={values} field={field_Link} />,
      );

      it('should return an unordered list element', () => {
        expect(component.isEmptyRender()).to.equal(false);
        expect(component.type()).to.equal('ul');
      });

      it('should return an unordered list element with one list item', () => {
        values.push(null);
        component.setProps({ values });

        expect(component.children()).to.have.lengthOf(values.length - 1);
        expect(component.childAt(0).type()).to.equal('li');
      });

      it('should return a LinkableBibField component', () => {
        const liEl = component.childAt(0);
        expect(liEl.children()).to.have.lengthOf(values.length - 1);
        expect(liEl.children().type()).to.equal(LinkableBibField);
        expect(liEl.childAt(0).props()).to.include({
          displayText: values[0],
          field: field_Link.value,
          label: field_Link.label,
          searchQuery: values[0],
          url: undefined,
        });
      });
    });

    describe('Self Linkable', () => {
      const values = ['display me'];
      const component = shallow(
        <DefinitionField values={values} field={field_SelfLink} />,
      );

      it('should return an unordered list element', () => {
        expect(component.isEmptyRender()).to.equal(false);
        expect(component.type()).to.equal('ul');
      });

      it('should return an unordered list element with one list item', () => {
        values.push(null);
        component.setProps({ values });

        expect(component.children()).to.have.lengthOf(values.length - 1);
        expect(component.childAt(0).type()).to.equal('li');
      });

      it('should return a LinkableBibField component', () => {
        const liEl = component.childAt(0);
        expect(liEl.children()).to.have.lengthOf(values.length - 1);
        expect(liEl.children().type()).to.equal(LinkableBibField);
        expect(liEl.childAt(0).props()).to.include({
          displayText: values[0],
          field: field_SelfLink.value,
          label: field_SelfLink.label,
          searchQuery: values[0],
          url: undefined,
        });
      });
    });

    describe('Identifier', () => {
      const values = [
        {
          '@type': 'bf:ShelfMark',
          '@value': '*QKKA 08-490',
        },
      ];

      const component = shallow(
        <DefinitionField values={values} field={field_Ident} />,
      );

      it('should return an unordered list element', () => {
        expect(component.isEmptyRender()).to.equal(false);
        expect(component.type()).to.equal('ul');
      });

      it('should return a IdentifierField', () => {
        const identComp = component.childAt(0);
        expect(component.children()).to.have.lengthOf(values.length);
        expect(identComp.type()).to.equal(IdentifierField);
        expect(identComp.props()).to.include({
          entity: values[0],
        });
      });
    });

    describe('Subject Literal', () => {
      const values = [
        'Civilization.',
        'Serbia -- Civilization -- Periodicals.',
        'Serbia.',
      ];

      const component = shallow(
        <DefinitionField values={values} field={field_SubLit} />,
      );

      it('should return an unordered list element', () => {
        expect(component.isEmptyRender()).to.equal(false);
        expect(component.type()).to.equal('ul');
      });

      it('should return a SubjectLiteralBibField', () => {
        expect(component.children()).to.have.lengthOf(values.length);

        const SubjectComp = component.childAt(1);
        expect(SubjectComp.type()).to.equal(SubjectLiteralBibField);
        expect(SubjectComp.props()).to.include({
          value: normalizeLiteral(values[1]),
          field: field_SubLit,
        });
      });
    });
  });
});
