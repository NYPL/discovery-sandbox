/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { Link } from 'react-router';

import DrbbResult from './../../src/app/components/Drbb/DrbbResult';
import workData from '../fixtures/work-detail.json';

describe('DrbbResult', () => {
  describe('with work prop', () => {
    describe('work with all data', () => {
      let component;
      const authors = workData.data.agents.filter((agent) =>
        agent.roles.includes('author'),
      );
      before(() => {
        component = shallow(<DrbbResult work={workData.data} />);
      });

      it('should render an `li`', () => {
        expect(component.find('li')).to.have.length(1);
      });

      it('should have a link with .drbb-result-title class', () => {
        expect(component.find('Link').first().render().text()).to.equal(
          workData.data.title,
        );
      });

      it('should have links to authors', () => {
        expect(component.find('.drbb-result-author')).to.have.length(
          authors.length,
        );
        expect(component.find('.drbb-result-author').is('Link')).to.equal(true);
      });
    });

    describe('edition with no items', () => {
      let component;
      before(() => {
        const workWithItemsNull = workData.data;
        let { editions } = workWithItemsNull;
        editions = [editions[0]];
        editions[0].items = null;

        component = shallow(<DrbbResult work={workWithItemsNull} />);
      });
      it('should still render', () => {
        expect(component.find('li')).to.have.length(1);
      });
    });

    describe('edition with empty items', () => {
      let component;
      before(() => {
        const workWithItemsNull = workData.data;
        let { editions } = workWithItemsNull;
        editions = [editions[0]];
        editions[0].items = [];

        component = shallow(<DrbbResult work={workWithItemsNull} />);
      });
      it('should still render', () => {
        expect(component.find('li')).to.have.length(1);
      });
    });

    describe('work with no authors', () => {
      let component;
      before(() => {
        const workWithNoAuthors = JSON.parse(JSON.stringify(workData.data));
        const { agents } = workWithNoAuthors;
        workWithNoAuthors.agents = agents.filter(
          (agent) => !agent.roles.includes('author'),
        );
        component = shallow(<DrbbResult work={workWithNoAuthors} />);
      });

      it('should not have a .drbb-authorship element', () => {
        expect(component.find('.drbb-authorship')).to.have.length(0);
      });
    });
  });

  describe('without work prop', () => {
    let component;
    before(() => {
      component = shallow(<DrbbResult />);
    });

    it('should return `null`', () => {
      expect(component.type()).to.be.null;
    });
  });

  describe('work with long title', () => {
    let component;
    before(() => {
      const longTitleWork = JSON.parse(JSON.stringify(workData.data));
      longTitleWork.title =
        'Life in India; or, Madras, the Neilgherries, and Calcutta. Written for the American Sunday-School Union.';
      component = shallow(<DrbbResult work={longTitleWork} />);
    });

    it('should truncate the title', () => {
      expect(component.find('Link').first().render().text()).to.equal(
        'Life in India; or, Madras, the Neilgherries, and Calcutta. Written for the American...',
      );
    });
  });

  describe('source parameter in links', () => {
    let component;
    before(() => {
      const work = JSON.parse(JSON.stringify(workData.data));
      work.editions = [
        {
          items: [
            {
              links: [
                {
                  mediaType: 'text/html',
                  id: 'fakeId',
                  url: 'http://fakefakefake.nypl.org',
                },
              ],
            },
          ],
        },
      ];
      component = mount(<DrbbResult work={work} />);
    });

    it('should include source=catalog', () => {
      expect(component.find(Link).at(0).prop('to')).to.include(
        'source=catalog',
      );
      expect(component.find(Link).at(0).prop('className')).to.equal(
        'drbb-result-title',
      );
      expect(component.find(Link).at(1).prop('to').query.source).to.equal(
        'catalog',
      );
      expect(component.find(Link).at(1).prop('className')).to.equal(
        'drbb-result-author',
      );
      expect(component.find(Link).at(2).prop('to').pathname).to.include(
        'source=catalog',
      );
      expect(component.find(Link).at(2).prop('className')).to.equal(
        'drbb-read-online',
      );
    });
  });
});
