/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import nock from 'nock';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

import BibsList from '../../src/app/components/SubjectHeading/BibsList';
import Sorter from '@Sorter';
import appConfig from '../../src/app/data/appConfig';

describe.only('BibsList', () => {
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
            totalResults: 1,
            bibsSource: 'discoveryApi',
          };
        });

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
    });
  });

  it('should have correct heading for multiple results', () => {

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
              expect(component.find('h3').at(0).text()).to.equal('Viewing 1 - 6 of 10 items');
            });
            setImmediate(() => resolve());
          }, 100);
          return {
            page: 1,
            totalResults: 10,
            bibsSource: 'discoveryApi',
          };
        });

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
    });
  });

  it('should have heading and sorter in correct order', () => {

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
              expect(component.childAt(0).childAt(0).type()).to.equal('h3');
              expect(component.childAt(0).childAt(1).name()).to.equal('Sorter');
            });
            setImmediate(() => resolve());
          }, 100);
          return {
            page: 1,
            totalResults: 10,
            bibsSource: 'discoveryApi',
          };
        });

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
    });
  });
});
