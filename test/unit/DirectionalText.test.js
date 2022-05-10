import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import DirectionalText from '../../src/app/components/BibPage/components/DirectionalText';

describe('Diretional Text', () => {
  it('should display the text', () => {
    const component = shallow(<DirectionalText text='display me' />);

    expect(component.exists()).to.be.true;
    expect(component.find('span').length).to.equal(1);
    expect(component.text()).to.equal('display me');
  });

  it('should be null with no content', () => {
    const component = shallow(<DirectionalText />);
    expect(component.type()).to.be.null;
  });

  it('should display "\\u200F" content direction in RTL', () => {
    const component = shallow(
      <DirectionalText text='‏הרבי, שלושים שנות נשיאות /' />,
    );

    expect(component.exists()).to.be.true;
    expect(component.find('span').length).to.equal(1);
    expect(component.find('span').prop('dir')).to.equal('rtl');
  });

  it('should display non "\\u200F" content direction in LTR', () => {
    const component = shallow(<DirectionalText text='display me' />);

    expect(component.exists()).to.be.true;
    expect(component.find('span').length).to.equal(1);
    expect(component.find('span').prop('dir')).to.equal('ltr');
  });
});
