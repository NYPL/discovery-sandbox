/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import Feedback from './../../src/app/components/Feedback/Feedback';

describe('Feedback', () => {
  let component;
  before(() => {
    component = shallow(<Feedback />);
  });

  it('should render a <div> with class .feedback', () => {
    expect(component.find('.feedback')).to.have.length(1);
  });

  describe('success screen', () => {
    before(() => {
      component.setState({ success: true });
    });

    it('should render a <p>', () => {
      const successP = component.find('p');
      expect(successP).to.have.length(1);
      expect(successP.text()).to.equal('Thank you for submitting your comments, if you requested a response, our service staff will get back to you as soon as possible.');
    });
  });
});
