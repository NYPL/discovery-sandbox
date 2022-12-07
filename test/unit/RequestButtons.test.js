/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Link } from 'react-router';
import { expect } from 'chai';
import { mount } from 'enzyme';
import RequestButtons from './../../src/app/components/Item/RequestButtons'
import appConfig from '../../src/app/data/appConfig';
import item from '../fixtures/libraryItems';



describe('Request Buttons', () => {
  describe('Search Page', () => {
    let page = 'SearchResults'
    describe('Physical Request', () => {
      describe('should be present when item eligible for physical request', () => {
        describe('should be enabled when item available', () => {
          let component;
          before(() => {
            const data = Object.assign(
              {},
              item.full,
              { physRequestable: true }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={appConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should have a link with avail-request-button class', () => {
            const links = component.find(Link)
            expect(links.length).to.equal(1);
            const link = links.at(0);
            expect(link.prop('className')).to.equal('avail-request-button')
          })

          it('should have link with aria-disabled false', () => {
            const links = component.find(Link)
            const link = links.at(0);
            expect(link.prop('aria-disabled')).to.equal(false)
          })

          it('should have a link with non-disabling handler', () => {
            const link = component.find(Link).at(0)
            const handler = link.prop('onClick')
            const event = { preventDefault: () => {event.called = true } }
            handler(event)
            expect(!!event.called).to.equal(false);
          })

          it('should have a link pointing to hold request page', () => {
            const link = component.find(Link).at(0)
            expect(link.prop('to')).to.include('/hold/request/b12345-i17326129?searchKeywords=fakesearchkeyword')
          })

          it('should say Request for On-site Use', () => {
            const link = component.find(Link).at(0)
            expect(link.text()).to.equal('Request for On-site Use')
          })
        })

        describe('should be disabled when item not available', () => {
          let component;
          before(() => {
            const data = Object.assign(
              {},
              item.full,
              { physRequestable: true, available: false }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={appConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should have a link with unavail-request-button class', () => {
            const links = component.find(Link)
            expect(links.length).to.equal(1);
            const link = links.at(0);
            expect(link.prop('className')).to.equal('unavail-request-button')
          })

          it('should have a link with aria-disabled true', () => {
            const links = component.find(Link)
            const link = links.at(0);
            expect(link.prop('aria-disabled')).to.equal(true)
          })

          it('should have a link with click handler to prevent default', () => {
            const link = component.find(Link).at(0)
            const handler = link.prop('onClick')
            const event = { preventDefault: () => { event.called = true } }
            handler(event)
            expect(!!event.called).to.equal(true);
          })

          it('should say Request for On-site Use', () => {
            const link = component.find(Link).at(0)
            expect(link.text()).to.equal('Request for On-site Use')
          })
        })

      })

      describe('should not be present when item not eligible for physical request', () => {
        describe('should not be present in case it is an Aeon item', () => {
          let component;
          let mockAppConfig;

          before(() => {
            mockAppConfig = Object.assign({}, appConfig, { features : ['aeon-links'] });
            const data = Object.assign(
              {},
              item.full,
              { physRequestable: true, aeonUrl: 'http://www.aeon.com' }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={mockAppConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should not have a link', () => {
            expect(component.find(Link).length).to.equal(0)
          })
        })

        describe('should not be present in case of closure', () => {
          let mockAppConfig = Object.assign({}, appConfig)
          let component;

          before(() => {
            mockAppConfig.closedLocations = ['']
            const data = Object.assign(
              {},
              item.full,
              { physRequestable: true }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={mockAppConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should not have a link', () => {
            expect(component.find(Link).length).to.equal(0)
          })
        })

        describe('should not be present if not physRequestable', () => {
          let mockAppConfig = Object.assign({}, appConfig)
          let component;

          before(() => {
            const data = Object.assign(
              {},
              item.full,
              { physRequestable: false }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={mockAppConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should not have a link', () => {
            expect(component.find(Link).length).to.equal(0)
          })
        })
      })
    });

    describe('EDD Request', () => {
      describe('should be present when item eligible for edd request', () => {
        describe('should be enabled when item available', () => {
          let component;
          let mockAppConfig = Object.assign({}, appConfig)
          before(() => {
            const data = Object.assign(
              {},
              item.full,
              { eddRequestable: true }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={mockAppConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should have a link with avail-request-button class', () => {
            const links = component.find(Link)
            expect(links.length).to.equal(1);
            const link = links.at(0);
            expect(link.prop('className')).to.equal('avail-request-button')
          })

          it('should have link with aria-disabled false', () => {
            const links = component.find(Link)
            const link = links.at(0);
            expect(link.prop('aria-disabled')).to.equal(false)
          })

          it('should have a link with non-disabling handler', () => {
            const link = component.find(Link).at(0)
            const handler = link.prop('onClick')
            const event = { preventDefault: () => {event.called = true } }
            handler(event)
            expect(!!event.called).to.equal(false);
          })

          it('should have a link pointing to hold request page', () => {
            const link = component.find(Link).at(0)
            expect(link.prop('to')).to.include('/hold/request/b12345-i17326129/edd?searchKeywords=fakesearchkeyword')
          })

          it('should say Request Scan', () => {
            const link = component.find(Link).at(0)
            expect(link.text()).to.equal('Request Scan')
          })
        })

        describe('should be disabled when item not available', () => {
          let component;
          let mockAppConfig = Object.assign({}, appConfig)
          before(() => {
            const data = Object.assign(
              {},
              item.full,
              { eddRequestable: true, available: false }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={mockAppConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should have a link with unavail-request-button class', () => {
            const links = component.find(Link)
            expect(links.length).to.equal(1);
            const link = links.at(0);
            expect(link.prop('className')).to.equal('unavail-request-button')
          })

          it('should have a link with aria-disabled true', () => {
            const links = component.find(Link)
            const link = links.at(0);
            expect(link.prop('aria-disabled')).to.equal(true)
          })

          it('should have a link with click handler to prevent default', () => {
            const link = component.find(Link).at(0)
            const handler = link.prop('onClick')
            const event = { preventDefault: () => { event.called = true } }
            handler(event)
            expect(!!event.called).to.equal(true);
          })

          it('should say Request Scan', () => {
            const link = component.find(Link).at(0)
            expect(link.text()).to.equal('Request Scan')
          })
        })

      })

      describe('should not be present when item not eligible for EDD request', () => {
        describe('should not be present in case it is an Aeon item', () => {
          let mockAppConfig = Object.assign({}, appConfig)
          let component;

          before(() => {
            mockAppConfig.features = ['aeon-links']
            const data = Object.assign(
              {},
              item.full,
              { eddRequestable: true, aeonUrl: 'http://www.aeon.com' }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={mockAppConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should not have a link', () => {
            expect(component.find(Link).length).to.equal(0)
          })
        })

        describe('should not be present in case of closure', () => {
          let mockAppConfig = Object.assign({}, appConfig)
          let component;

          before(() => {
            mockAppConfig.closedLocations = ['']
            const data = Object.assign(
              {},
              item.full,
              { eddRequestable: true }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={mockAppConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should not have a link', () => {
            expect(component.find(Link).length).to.equal(0)
          })
        })

        describe('should not be present if not eddRequestable', () => {
          let mockAppConfig = Object.assign({}, appConfig)
          let component;

          before(() => {
            const data = Object.assign(
              {},
              item.full,
              { eddRequestable: false }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={mockAppConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should not have a link', () => {
            expect(component.find(Link).length).to.equal(0)
          })
        })
      })
    });

    describe('Aeon Request', () => {
      describe('should be present when item eligible for aeon request', () => {
        describe('should be enabled when item available', () => {
          let component;
          let mockAppConfig = Object.assign({}, appConfig)
          before(() => {
            const data = Object.assign(
              {},
              item.full,
              { aeonUrl: 'http://www.aeon.com' }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={mockAppConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should have a link with avail-request-button class', () => {
            const links = component.find('a')
            expect(links.length).to.equal(1);
            const link = links.at(0);
            expect(link.prop('className')).to.equal('aeonRequestButton avail-request-button')
          })

          it('should have link with aria-disabled false', () => {
            const links = component.find('a')
            const link = links.at(0);
            expect(link.prop('aria-disabled')).to.equal(false)
          })

          it('should have a link with non-disabling handler', () => {
            const link = component.find('a').at(0)
            const handler = link.prop('onClick')
            const event = { preventDefault: () => {event.called = true } }
            handler(event)
            expect(!!event.called).to.equal(false);
          })

          it('should have a link pointing to hold aeon url', () => {
            const link = component.find('a').at(0)
            expect(link.prop('href')).to.include('http://www.aeon.com')
          })

          it('should say Request Appointment', () => {
            const link = component.find('a').at(0)
            expect(link.text()).to.equal('Request Appointment')
          })
        })

        describe('should be disabled when item not available', () => {
          let component;
          let mockAppConfig = Object.assign({}, appConfig)
          before(() => {
            const data = Object.assign(
              {},
              item.full,
              { aeonUrl: 'http://www.aeon.com', available: false }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={mockAppConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should have a link with unavail-request-button class', () => {
            const links = component.find('a')
            expect(links.length).to.equal(1);
            const link = links.at(0);
            expect(link.prop('className')).to.equal('aeonRequestButton unavail-request-button')
          })

          it('should have a link with aria-disabled true', () => {
            const links = component.find('a')
            const link = links.at(0);
            expect(link.prop('aria-disabled')).to.equal(true)
          })

          it('should have a link with click handler to prevent default', () => {
            const link = component.find('a').at(0)
            const handler = link.prop('onClick')
            const event = { preventDefault: () => { event.called = true } }
            handler(event)
            expect(!!event.called).to.equal(true);
          })

          it('should say Request Appointment', () => {
            const link = component.find('a').at(0)
            expect(link.text()).to.equal('Request Appointment')
          })
        })
      });

      describe('should not be present when item not eligible for Aeon request', () => {
        describe('should not be present in case it is not an Aeon item', () => {
          let mockAppConfig = Object.assign({}, appConfig)
          let component;

          before(() => {
            mockAppConfig.features = ['aeon-links']
            const data = Object.assign(
              {},
              item.full,
              { eddRequestable: true }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={mockAppConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should not have an aeon link', () => {
            expect(component.find('a').length).to.equal(1)
            expect(component.find('a').at(0).text()).to.not.equal('Request Appointment')
          })
        })

        describe('should not be present in case Aeon is not being displayed', () => {
          const mockAppConfig = Object.assign({}, appConfig)
          let component;

          before(() => {
            mockAppConfig.features = []
            const data = Object.assign(
              {},
              item.full,
              { aeonUrl: 'http://www.aeon.com', eddRequestable: true }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={mockAppConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should not have an aeon link', () => {
            expect(component.find('a').length).to.equal(1)
            expect(component.find('a').at(0).text()).to.not.equal('Request Appointment')
          })
        })

        describe('should not be present in case of closure', () => {
          let mockAppConfig = Object.assign({}, appConfig)
          let component;

          before(() => {
            mockAppConfig.closedLocations = ['']
            const data = Object.assign(
              {},
              item.full,
              { aeonUrl: 'http://www.aeon.com', available: false }
            );

            component = mount(
              <RequestButtons
                item={data}
                bibId="b12345"
                page={page}
                appConfig={mockAppConfig}
                searchKeywords={'fakesearchkeyword'}
              />
            );
          })

          it('should not have a link', () => {
            expect(component.find('a').length).to.equal(0)
          })
        })
      })
    });
  })
});
