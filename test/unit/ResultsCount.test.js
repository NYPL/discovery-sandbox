/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import ResultsCount from '../../src/app/components/ResultsCount/ResultsCount.jsx';

const facets = {
  subjectLiteral: {
    owner: [{}],
    subjectLiteral: [{ id: 'Children\'s art El Salvador', value: 'Children\'s art El Salvador' }],
    materialType: [],
  },
  creatorLiteral: {
    owner: [{}],
    creatorLiteral: [{ id: 'Shakespeare', value: 'Shakespeare' }],
    materialType: [],
    issuance: [],
  },
};

describe('ResultsCount', () => {
  describe('No results found', () => {
    describe('Default rendering', () => {
      let component;

      before(() => {
        component = shallow(<ResultsCount />);
      });

      it('should be wrapped in an .nypl-results-summary class', () => {
        expect(component.find('div').first().hasClass('nypl-results-summary')).to.equal(true);
      });

      it('should output that no results were found', () => {
        expect(component.find('h2').length).to.equal(1);
        expect(component.find('h2').text())
          .to.equal('No results found. Please try another search.');
      });
    });

    describe('No result count with search keyword', () => {
      let component;

      before(() => {
        component = shallow(<ResultsCount searchKeywords="locofocos" count={0} />);
      });

      it('should output that no results were found', () => {
        expect(component.find('h2').length).to.equal(1);
        expect(component.find('h2').text())
          .to.equal('No results found. Please try another search.');
      });
    });
  });

  describe('Loading display', () => {
    const isLoading = true;
    let component;

    before(() => {
      component = shallow(<ResultsCount searchKeywords="locofocos" isLoading={isLoading} />);
    });

    it('should output that no results were found', () => {
      expect(component.find('h2').length).to.equal(0);
      expect(component.find('p').length).to.equal(1);
      expect(component.find('p').text()).to.equal('Loading...');
    });
  });

  describe('Results display', () => {
    describe('From the field dropdown', () => {
      describe('Keyword field search - default', () => {
        let component;

        before(() => {
          component = shallow(
            <ResultsCount
              searchKeywords="hamlet"
              count={2345}
            />
          );
        });

        it('should output that no results were found', () => {
          expect(component.find('h2').length).to.equal(1);
          expect(component.find('h2').text())
            .to.equal('Displaying 1-50 of 2,345 results for keyword "hamlet"');
        });
      });

      describe('Title field search', () => {
        let component;

        before(() => {
          component = shallow(
            <ResultsCount
              searchKeywords="hamlet"
              field="title"
              count={678}
            />
          );
        });

        it('should output that no results were found', () => {
          expect(component.find('h2').length).to.equal(1);
          expect(component.find('h2').text())
            .to.equal('Displaying 1-50 of 678 results for title "hamlet"');
        });
      });

      describe('Author/contributor field search', () => {
        let component;

        before(() => {
          component = shallow(
            <ResultsCount
              searchKeywords="shakespeare"
              field="contributor"
              count={135}
            />
          );
        });

        it('should output that no results were found', () => {
          expect(component.find('h2').length).to.equal(1);
          expect(component.find('h2').text())
            .to.equal('Displaying 1-50 of 135 results for author/contributor "shakespeare"');
        });
      });
    });

    // Currently, the use case is only ONE facet being displayed at a time.
    // Why? We have no actionable selection for facets/filters, and the only way to select
    // a facet is from the bib page using a link.
    describe('Selected Facets', () => {
      describe('creatorLiteral selected facet', () => {
        let component;

        before(() => {
          component = mount(
            <ResultsCount
              selectedFacets={facets.creatorLiteral}
              count={2345}
            />
          );
        });

        it('should output that no results were found', () => {
          expect(component.find('h2').length).to.equal(1);
          expect(component.find('h2').text())
            .to.equal('Displaying 1-50 of 2,345 results for author "Shakespeare"');
        });
      });

      describe('subjectLiteral selected facet', () => {
        let component;

        before(() => {
          component = mount(
            <ResultsCount
              selectedFacets={facets.subjectLiteral}
              count={6789}
            />
          );
        });

        it('should output that no results were found', () => {
          expect(component.find('h2').length).to.equal(1);
          expect(component.find('h2').text())
            .to.equal(
              'Displaying 1-50 of 6,789 results for subject "Children\'s art El Salvador"'
            );
        });
      });
    });
  });

  describe('Locale count', () => {
    let component;

    it('should output that 40 results were found', () => {
      component = shallow(<ResultsCount count={40} />);
      expect(component.find('h2').text())
        .to.equal('Displaying 1-40 of 40 results ');
    });

    it('should output that 4,000 results were found from input 4000', () => {
      component = shallow(<ResultsCount count={4000} />);
      expect(component.find('h2').text())
        .to.equal('Displaying 1-50 of 4,000 results ');
    });

    it('should output that 4,000,000 results were found from input 4000000', () => {
      component = shallow(<ResultsCount count={4000000} />);
      expect(component.find('h2').text())
        .to.equal('Displaying 1-50 of 4,000,000 results ');
    });
  });

  describe('Different pages', () => {
    let component;

    it('should output the first 50 results', () => {
      component = shallow(<ResultsCount count={500} />);
      expect(component.find('h2').text())
        .to.equal('Displaying 1-50 of 500 results ');
    });

    it('should output 101-150 on the third page', () => {
      component = shallow(<ResultsCount count={500} page={3} />);
      expect(component.find('h2').text())
        .to.equal('Displaying 101-150 of 500 results ');
    });

    it('should output 451-489 on the last page', () => {
      component = shallow(<ResultsCount count={489} page={10} />);
      expect(component.find('h2').text())
        .to.equal('Displaying 451-489 of 489 results ');
    });
  });
});
