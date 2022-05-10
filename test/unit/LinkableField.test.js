import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import LinkableField from '../../src/app/components/BibPage/components/LinkableField'

describe('Linkable Field ', () => {
  it('should url encode & and + symbols in linkable field bibValues', () => {
    const component = shallow(<LinkableField bibValue = "&& ++"/>)
    const link = component.find('Link')
    const {to} = link.props()
    expect(to).to.not.include('&')
    expect(to).to.not.include('+')
    expect(to).to.include('%26%26 %2B%2B')
  })
}) 
