import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import IdentifierField from '../../src/app/components/BibPage/components/IdentifierField';

describe('IdentifierField', () => {
  describe('No Status', () => {
    const entity = {
      '@type': 'bf:ShelfMark',
      '@value': 'JLD 88-1518',
    };
    const component = shallow(<IdentifierField entity={entity} />);

    it('should render a list item element', () => {
      expect(component.type()).to.equal('li');
    });

    it('should render render entity value', () => {
      expect(component.text()).to.equal(entity['@value']);
    });
  });

  describe('With Status', () => {
    const entity = {
      '@type': 'bf:ShelfMark',
      '@value': 'JLD 88-1518',
      'identifierStatus': 'availalbe',
    };
    const component = shallow(<IdentifierField entity={entity} />);

    it('should render render entity value with status', () => {
      expect(component.text()).to.include(entity['@value']);
      expect(component.text()).to.include(entity.identifierStatus);
      expect(component.text()).to.equal(
        `${entity['@value']} ${entity.identifierStatus}`,
      );
    });
  });
});
