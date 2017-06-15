/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import Home from '../../src/app/components/Home/Home.jsx';
import Search from '../../src/app/components/Search/Search.jsx';

describe('Home', () => {
  let component;

  before(() => {
    component = shallow(<Home />);
  });

  it('should be wrapped in a .home class', () => {
    expect(component.find('.home')).to.exist;
    expect(component.find('div').first().hasClass('home')).to.equal(true);
  });

  it('should render a .page-header div and page title', () => {
    const pageHeader = component.find('.page-header');

    expect(component.find('.page-header')).to.have.length(1);

    expect(pageHeader.find('h2')).to.have.length(1);
    expect(pageHeader.find('h2').text()).to.equal('New York Public Library Research Catalog');

    expect(pageHeader.contains(<h2>New York Public Library Research Catalog</h2>)).to.equal(true);
  });

  it('should contains a Breadcrumbs component', () => {
    const pageHeader = component.find('.page-header');

    expect(pageHeader.find('Breadcrumbs')).to.have.length(1);
  });

  it('should contains a Search component', () => {
    expect(component.find('Search')).to.have.length(1);
    // expect(component.contains(
    //   <Search
    //     spinning={props.spinning}
    //     createAPIQuery={basicQuery(props)}
    //   />)).to.equal(true);
  });
});

describe('Home - mount', () => {
  let component;

  before(() => {
    component = mount(<Home spinning={false} />);
  });

  it('should have a spinning prop set to false', () => {
    expect(component.props().spinning).to.equal(false);
  });
});
