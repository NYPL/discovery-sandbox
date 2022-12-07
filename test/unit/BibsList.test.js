/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import nock from 'nock';
import { expect } from 'chai';
import { mount } from 'enzyme';

import BibsList from '../../src/app/components/SubjectHeading/BibsList';
import appConfig from '../../src/app/data/appConfig';

describe('BibsList', () => {
  let component;
  let savedBaseUrl;

  before(() => {
    // set up mock api
    savedBaseUrl = appConfig.baseUrl;
    appConfig.baseUrl = 'http://test-server.com';
  });

  after(() => {
    appConfig.baseUrl = savedBaseUrl;
  });


  it('should have correct heading for one result', () => {
    // set up component
    component = mount(
      <BibsList />,
      {
        context: {
          router: {
            location: {
              query: {},
            },
          },
        },
      },
    );

    return new Promise((resolve) => {
      nock('http://test-server.com')
        .defaultReplyHeaders({
          'access-control-allow-origin': '*',
          'access-control-allow-credentials': 'true',
        })
        .get(/\/api/)
        .reply(200, () => {
          setTimeout(() => {
            component.setProps({});
            setImmediate(() => {
              expect(component.find('h3').at(0).text()).to.equal('Viewing 1 - 1 of 1 item');
            });
            setImmediate(() => resolve());
          }, 100);
          return {
            page: 1,
            totalResults: '1',
            bibsSource: 'discoveryApi',
          };
        });
    });
  });

  it('should have correct heading for multiple results', () => {

    // set up component
    component = mount(
      <BibsList />,
      {
        context: {
          router: {
            location: {
              query: {},
            },
          },
        },
      },
    );

    return new Promise((resolve) => {
      nock('http://test-server.com')
        .defaultReplyHeaders({
          'access-control-allow-origin': '*',
          'access-control-allow-credentials': 'true',
        })
        .get(/\/api/)
        .reply(200, () => {
          setTimeout(() => {
            component.setProps({});
            setImmediate(() => {
              expect(component.find('h3').at(0).text()).to.equal('Viewing 1 - 10 of 10 items');
            });
            setImmediate(() => resolve());
          }, 100);
          return {
            page: 1,
            totalResults: '10',
            bibsSource: 'discoveryApi',
          };
        });
    });
  });

  it('should have heading and sorter in correct order', () => {

    // set up component
    component = mount(
      <BibsList />,
      {
        context: {
          router: {
            location: {
              query: {},
            },
          },
        },
      },
    );

    return new Promise((resolve) => {
      nock('http://test-server.com')
        .defaultReplyHeaders({
          'access-control-allow-origin': '*',
          'access-control-allow-credentials': 'true',
        })
        .get(/\/api/)
        .reply(200, () => {
          setTimeout(() => {
            component.setProps({});
            setImmediate(() => {
              // The h3 text is "Viewing 1 - 10 of 10 items"
              expect(component.childAt(0).childAt(0).text()).to.contain('Viewing');
              expect(component.childAt(0).childAt(1).name()).to.equal('Sorter');
            });
            setImmediate(() => resolve());
          }, 100);
          return {
            page: 1,
            totalResults: '10',
            bibsSource: 'discoveryApi',
          };
        });
    });
  });

  describe('api calls', () => {
    it('should make correct api call when mounted', () => {
      // set up component
      component = mount(
        <BibsList
          label="abcdefg"
        />,
        {
          context: {
            router: {
              location: {
                query: {},
              },
            },
          },
        },
      );

      return new Promise((resolve) => {
        nock('http://test-server.com')
          .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',
          })
          .get(/\/api/)
          .reply(200, (uri) => {
            setTimeout(() => {
              component.setProps({});
              setImmediate(() => {
                expect(uri).to.equal('/api/subjectHeading/abcdefg?&sort=date&sort_direction=desc&per_page=10&shep_bib_count=undefined&shep_uuid=undefined');
              });
              setImmediate(() => resolve());
            }, 100);
            return {
              page: 1,
              totalResults: '10',
              bibsSource: 'discoveryApi',
            };
          });
      });
    });

    it('should use configured shepBibsLimit when mounting, if configured', () => {
      const oldShepBibsLimit = appConfig.shepBibsLimit;
      appConfig.shepBibsLimit = 10;
      // set up component
      component = mount(
        <BibsList
          label="abcdefg"
        />,
        {
          context: {
            router: {
              location: {
                query: {},
              },
            },
          },
        },
      );

      return new Promise((resolve) => {
        nock('http://test-server.com')
          .defaultReplyHeaders({
            'access-control-allow-origin': '*',
            'access-control-allow-credentials': 'true',
          })
          .get(/\/api/)
          .reply(200, (uri) => {
            setTimeout(() => {
              component.setProps({});
              setImmediate(() => {
                expect(uri).to.equal('/api/subjectHeading/abcdefg?&sort=date&sort_direction=desc&per_page=10&shep_bib_count=undefined&shep_uuid=undefined');
              });
              setImmediate(() => {
                appConfig.shepBibsLimit = oldShepBibsLimit;
                resolve();
              });
            }, 100);
            return {
              page: 1,
              totalResults: '10',
              bibsSource: 'discoveryApi',
            };
          });
      });
    });
  });
});
