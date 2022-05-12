import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LinkableField from '../../src/app/components/BibPage/components/LinkableField';

describe('Linkable Field ', () => {
  it('should url encode & and + symbols in linkable field values', () => {
    const component = shallow(<LinkableField value='&&++' />);
    const link = component.find('Link');
    const { to } = link.props();
    expect(to).to.not.include('&');
    expect(to).to.not.include('+');
    expect(to).to.include('%26%26%2B%2B');
  });

  it('should url encode & and + symbols in linkable field values that are objects', () => {
    const fakeBib = { '@id': '&&++' };
    const component = shallow(<LinkableField value={fakeBib} />);
    const link = component.find('Link');
    const { to } = link.props();
    expect(to).to.not.include('&');
    expect(to).to.not.include('+');
    expect(to).to.include('%26%26%2B%2B');
  });
});
