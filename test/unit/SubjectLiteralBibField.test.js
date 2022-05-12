import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import SubjectLiteralBibField from '../../src/app/components/BibPage/components/SubjectLiteralBibField';
import LinkableBibField from '../../src/app/components/BibPage/components/LinkableField';
import { isEmpty } from '../../src/app/utils/utils';

describe('SubjectLiteralBibField', () => {
  const value = 'Serbia > Civilization > Periodicals';
  const field = {
    value: 'subjectLiteral',
    label: 'Subject Heading',
    selfLinkable: true,
  };

  describe('Nullable', () => {
    it('should return NULL if invalid props', () => {
      const component = mount(<SubjectLiteralBibField />);

      expect(component.isEmptyRender()).to.equal(true);
      expect(isEmpty(component.props())).to.equal(true);

      component.setProps({ field });

      expect(component.isEmptyRender()).to.equal(true);
      expect(!isEmpty(component.props())).to.equal(true);
      expect(component.props()).to.include({ field });

      component.setProps({ field: undefined, value });

      expect(component.isEmptyRender()).to.equal(true);
      expect(!isEmpty(component.props())).to.equal(true);
      expect(component.props()).to.include({ value });
    });
  });

  describe('List', () => {
    it('should return a li el w/ two gt(>) signs && three LinkableBibField', () => {
      const component = shallow(
        <SubjectLiteralBibField value={value} field={field} />,
      );

      expect(component.type()).to.equal('li');
      expect(component.children().length).to.equal(5);
      expect(component.find('span').length).to.equal(2);
      expect(component.find('span').at(0).text()).to.equal(' > ');
      expect(component.find('span').at(1).text()).to.equal(' > ');
      expect(component.find(LinkableBibField).length).to.equal(3);
    });

    it('should display one link if value does not contain any gt(>) signs', () => {
      const component = shallow(
        <SubjectLiteralBibField
          value={'Serbia -- Civilization -- Periodicals'}
          field={field}
        />,
      );

      expect(component.type()).to.equal('li');
      expect(component.children().length).to.equal(1);
      expect(component.find(LinkableBibField).length).to.equal(1);
    });
  });

  describe('LinkableBibField', () => {
    it('should pass the appropriate props to LinkableBibField w/ single value', () => {
      const component = shallow(
        <SubjectLiteralBibField
          value={'Serbia -- Civilization -- Periodicals'}
          field={field}
        />,
      );

      expect(component.type()).to.equal('li');
      expect(component.children().length).to.equal(1);
      expect(component.find(LinkableBibField).length).to.equal(1);

      expect(component.find(LinkableBibField).props()).to.include({
        value: 'Serbia -- Civilization -- Periodicals',
        filterQuery: 'Serbia -- Civilization -- Periodicals',
        field: field.value,
        label: field.label,
        outbound: true,
      });
    });

    it('should pass the appropriate props to all three LinkableBibField', () => {
      const component = shallow(
        <SubjectLiteralBibField value={value} field={field} />,
      );

      expect(component.find(LinkableBibField).length).to.equal(3);

      expect(component.find(LinkableBibField).at(0).props()).to.include({
        value: 'Serbia',
        filterQuery: 'Serbia',
        field: field.value,
        label: field.label,
        outbound: true,
      });

      expect(component.find(LinkableBibField).at(1).props()).to.include({
        value: 'Civilization',
        filterQuery: 'Serbia -- Civilization',
        field: field.value,
        label: field.label,
        outbound: true,
      });

      expect(component.find(LinkableBibField).at(2).props()).to.include({
        value: 'Periodicals',
        filterQuery: 'Serbia -- Civilization -- Periodicals',
        field: field.value,
        label: field.label,
        outbound: true,
      });
    });
  });
});
