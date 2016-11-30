/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import SearchResultsPage from '../src/app/components/SearchResultsPage/SearchResultsPage.jsx';

describe('SearchResultsPage', () => {
  let component;

  before(() => {
    // Added this prop so that the `componentWillMount` method will be skipped.
    // Will need to iterate later for the axios endpoint call.
    component = shallow(<SearchResultsPage searchResults={{}} />);
  });

  it('should be wrapped in a .mainContent', () => {
    expect(component.find('#mainContent')).to.have.length(1);
  });

  it('should render a <Search /> components', () => {
    expect(component.find('Search')).to.have.length(1);
  });

  it('should render a <Breadcrumbs /> components', () => {
    expect(component.find('Breadcrumbs')).to.have.length(1);
  });

  it('should render a <FacetSidebar /> components', () => {
    expect(component.find('FacetSidebar')).to.have.length(1);
  });

  it('should render a <Hits /> components', () => {
    expect(component.find('Hits')).to.have.length(1);
  });

  it('should render a <Results /> components', () => {
    expect(component.find('Results')).to.have.length(1);
  });
});
