/* eslint-env mocha */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Link } from 'react-router';
import { expect } from 'chai';
import { spy } from 'sinon';
import { shallow, mount } from 'enzyme';
import { mockRouterContext } from '../helpers/routing';
import item from '../fixtures/libraryItems';
import appConfig from '../../src/app/data/appConfig';

// Import the component that is going to be tested
import ItemTableRow from './../../src/app/components/Item/ItemTableRow';

const context = mockRouterContext();

describe('ItemTableRow', () => {
  describe('No rendered row', () => {
    it('should return null with no props passed', () => {
      const component = shallow(<ItemTableRow />);
      expect(component.type()).to.equal(null);
    });

    it('should return null with no items passed', () => {
      const component = shallow(<ItemTableRow item={{}} />);
      expect(component.type()).to.equal(null);
    });

    it('should return null if the item is an electronic resource', () => {
      const component = shallow(<ItemTableRow item={{ isElectronicResource: true }} />);

      expect(component.type()).to.equal(null);
    });
  });

  describe('Rendered row', () => {
    describe('Missing data item', () => {
      const data = item.missingData;
      let component;

      before(() => {
        component = shallow(<ItemTableRow item={data} />);
      });

      it('should return a <tr>', () => {
        expect(component.type()).to.equal('tr');
        expect(component.prop('className')).to.equal('available');
      });

      it('should return five <td>', () => {
        expect(component.find('td').length).to.equal(5);
      });

      it('should not have a format as the first <td> column data', () => {
        expect(component.find('td').at(0).text()).to.equal(' ');
      });

      it('should not have an access message as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal(' ');
      });

      it('should not have a status as the third <td> column data', () => {
        expect(component.find('td').at(2).text()).to.equal(' ');
      });

      it('should not have a call number as the fourth <td> column data', () => {
        expect(component.find('td').at(3).text()).to.equal(' ');
      });

      it('should not have a location as the fifth <td> column data', () => {
        expect(component.find('td').at(4).text()).to.equal(' ');
      });
    });

    describe('Full item', () => {
      const data = item.full;
      let component;

      before(() => {
        component = shallow(<ItemTableRow item={data} />);
      });

      it('should return a <tr>', () => {
        expect(component.type()).to.equal('tr');
        expect(component.prop('className')).to.equal('available');
      });

      it('should return five <td>', () => {
        expect(component.find('td').length).to.equal(5);
      });

      it('should have a format as the first <td> column data', () => {
        expect(component.find('td').at(0).text()).to.equal('Text');
      });

      it('should have an access message as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal('USE IN LIBRARY');
      });

      it('should have a status as the third <td> column data', () => {
        expect(component.find('td').at(2).text()).to.equal('Available');
      });

      it('should have a call number as the fourth <td> column data', () => {
        expect(component.find('td').at(3).text()).to.equal('JFE 07-5007 ---');
      });

      it('should have a location as the fifth <td> column data', () => {
        expect(component.find('td').at(4).text()).to.equal('SASB M1 - General Research - Room 315');
      });
    });

    describe('Requestable non-ReCAP NYPL item', () => {
      const data = item.requestable_nonReCAP_NYPL;
      let component;

      before(() => {
        component = shallow(<ItemTableRow item={data} />);
      });

      it('should have an access message as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal('USE IN LIBRARY');
      });

      it('should have a status as the third <td> column data and not a button', () => {
        expect(component.find('td').at(2).render().text()).to.equal('Request');
        expect(component.find('td').find('Link').length).to.equal(1);
      });

      it('should have a call number as the fourth <td> column data', () => {
        expect(component.find('td').at(3).text()).to.equal('JFE 07-5007 ---');
      });

      it('should have a location as the fifth <td> column data', () => {
        expect(component.find('td').at(4).text()).to.equal('SASB M1 - General Research - Room 315');
      });
    });

    describe('Non-Requestable non-ReCAP NYPL item', () => {
      const data = item.nonrequestable_nonReCAP_NYPL;
      let component;

      before(() => {
        component = shallow(<ItemTableRow item={data} />);
      });

      it('should have an access message as the second <td> column data', () => {
        expect(component.find('td').at(1).text()).to.equal('USE IN LIBRARY');
      });

      it('should have a call number as the fourth <td> column data', () => {
        expect(component.find('td').at(3).text()).to.equal('JFE 07-5007 ---');
      });

      it('should have a status as the third <td> column data and not a button', () => {
        expect(component.find('td').at(2).text()).to.equal('Available');
        expect(component.find('td').at(2).render().find('Link').length).to.equal(0);
      });

      it('should have a location as the fifth <td> column data', () => {
        expect(component.find('td').at(4).text()).to.equal('SASB M1 - General Research - Room 315');
      });
    });

    describe('Requestable ReCAP available item', () => {
      const data = item.requestable_ReCAP_available;
      let component;
      let getItemRecord;

      before(() => {
        getItemRecord = spy(ItemTableRow.prototype, 'getItemRecord');
        component =
          mount(<ItemTableRow item={data} bibId="b12345" />, { context });
      });

      it('should render the Request button in the third <td> column', () => {
        expect(component.find('td').at(2).render().text()).to.equal('Request');
        expect(component.find('td').find('Link').length).to.equal(1);
      });

      it('should call the getItemRecord function when the Request button is clicked', () => {
        const link = component.find('td').find('Link');
        link.simulate('click', { preventDefault: () => {} });
        expect(getItemRecord.calledOnce).to.equal(true);
      });
    });

    describe('Requestable ReCAP unavailable item', () => {
      const data = item.requestable_ReCAP_not_available;
      let component;

      before(() => {
        component = shallow(<ItemTableRow item={data} bibId="b12345" />);
      });

      it('should not render the Request button the third <td> column data', () => {
        expect(component.find('td').find('Link').length).to.equal(0);
      });

      it('should render "In Use" as the request label', () => {
        expect(component.find('td').at(2).text()).to.equal('In Use');
      });
    });

    describe('Aeon-requestable item without params', () => {
      const data = item.aeonRequestableWithoutParams;
      let component;
      const expectedUrl = `https://specialcollections.nypl.org/aeon/Aeon.dll?Action=10&Form=30&Title=%5BSongs+and+piano+solos+%2F&Site=SCHMA&Author=Bechet%2C+Sidney%2C&Date=1941-1960.&ItemInfo3=https%3A%2F%2Fnypl-sierra-test.nypl.org%2Frecord%3Db11545018x&ReferenceNumber=b11545018x&ItemInfo1=USE+IN+LIBRARY&Genre=Score&Location=Schomburg+Center&shelfmark=Sc+Scores+Bechet&itemid=33299542&ItemISxN=i33299542&itemNumber=45678&CallNumber=Sc+Scores+Bechet`;

      before(() => {
        component = shallow(<ItemTableRow item={data} bibId="b12345" />);
      });

      it('should have a link to aeon', () => {
        const link = component.find('.aeonRequestButton');
        expect(link.length).to.equal(1);
        const linkElement = link.at(0);
        expect(linkElement.text()).to.equal('Request');
        expect(linkElement.prop('href')).to.equal(expectedUrl);
      });

      it('should have a span with text appointment required', () => {
        const span = component.find('.aeonRequestText');
        expect(span.length).to.equal(1);
        expect(span.at(0).text()).to.equal('Appointment Required');
      });
    });

    describe('Aeon-requestable item with params', () => {
      const data = item.aeonRequestableWithParams;
      let component;
      const expectedUrl = `https://specialcollections.nypl.org/aeon/Aeon.dll?Action=10&Form=30&Title=%5BSongs+and+piano+solos+%2F&Site=SCHMA&CallNumber=Sc+Scores+Bechet&Author=Bechet%2C+Sidney%2C&Date=1941-1960.&ItemInfo3=https%3A%2F%2Fnypl-sierra-test.nypl.org%2Frecord%3Db11545018x&ReferenceNumber=b11545018x&ItemInfo1=USE+IN+LIBRARY&ItemISxN=i33299542&Genre=Score&Location=Schomburg+Center&shelfmark=Sc+Scores+Bechet&itemid=33299542&itemNumber=45678`;

      before(() => {
        component = shallow(<ItemTableRow item={data} bibId="b12345" />);
      });

      it('should have a link to aeon', () => {
        const link = component.find('.aeonRequestButton');
        expect(link.length).to.equal(1);
        const linkElement = link.at(0);
        expect(linkElement.text()).to.equal('Request');
        expect(linkElement.prop('href')).to.equal(expectedUrl);
      });

      it('should have a span with text appointment required', () => {
        const span = component.find('.aeonRequestText');
        expect(span.length).to.equal(1);
        expect(span.at(0).text()).to.equal('Appointment Required');
      });
    });

    describe('with "on-site-edd" feature flag', () => {
      let component;

      describe('unrequestable NYPL item', () => {
        before(() => {
          const data = item.full;
          data.holdingLocationCode = 'loc:mal82';
          component = shallow(<ItemTableRow item={data} bibId="b12345" />);
        });
      });

      describe('requestable NYPL item', () => {
        before(() => {
          const data = item.requestable_nonReCAP_NYPL;
          data.holdingLocationCode = 'loc:mal82';
          component = shallow(<ItemTableRow item={data} bibId="b12345" />);
        });
        it('should render `Email for access options` and mailto link in the fourth <td> column data', () => {
          expect(component.find('td').find('div').length).to.equal(0);
          expect(component.find('td').find('a').length).to.equal(0);
        });
      });
    });

    describe('closure scenarios', () => {
      it('should not show request button for recap if recap is closed', () => {
        const data = item.requestable_ReCAP_available;
        let component;
        appConfig.recapClosedLocations = [''];

        after(() => appConfig.recapClosedLocations = []);

        before(() => {
          component =
            mount(<ItemTableRow item={data} bibId="b12345" />, { context });
        });

        it('should render the Request button in the third <td> column', () => {
          expect(component.find('td').at(2).render().text()).to.equal('Request');
          expect(component.find('td').find('Link').length).to.equal(1);
        });
      });

      it('should show request button for recap if non-recap is closed', () => {
        const data = item.requestable_ReCAP_available;
        let component;
        appConfig.recapClosedLocations = [];

        before(() => {
          component =
            mount(<ItemTableRow item={data} bibId="b12345" />, { context });
        });

        it('should render the Request button in the third <td> column', () => {
          expect(component.find('td').at(2).render().text()).to.equal('Request');
          expect(component.find('td').find('Link').length).to.equal(1);
        });
      });

      it('should not show request button for recap if everything is closed', () => {
        const data = item.requestable_ReCAP_available;
        let component;
        appConfig.closedLocations = [];

        before(() => {
          component =
            mount(<ItemTableRow item={data} bibId="b12345" />, { context });
        });


        after(() => appConfig.closedLocations = []);

        it('should render the Request button in the third <td> column', () => {
          expect(component.find('td').at(2).render().text()).to.equal('Request');
          expect(component.find('td').find('Link').length).to.equal(1);
        });
      });
    });

    describe('Request Buttons', () => {
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
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
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
              expect(link.prop('to')).to.include('/hold/request/b12345-i17326129')
            })

            it('should say Request for Onsite Use', () => {
              const link = component.find(Link).at(0)
              expect(link.text()).to.equal('Request for Onsite Use')
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
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
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

            it('should say Request for Onsite Use', () => {
              const link = component.find(Link).at(0)
              expect(link.text()).to.equal('Request for Onsite Use')
            })
          })

        })

        describe('should not be present when item not eligible for physical request', () => {
          describe('should not be present in case it is an Aeon item', () => {
            const savedConfig = Object.assign({}, appConfig)
            let component;

            before(() => {
              appConfig.features = ['aeon-links']
              const data = Object.assign(
                {},
                item.full,
                { physRequestable: true, aeonUrl: 'http://www.aeon.com' }
              );

              component = mount(
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
              );
            })

            after(() => {
              appConfig.features = savedConfig.features
            })

            it('should not have a link', () => {
              expect(component.find(Link).length).to.equal(0)
            })
          })

          describe('should not be present in case of closure', () => {
            const savedConfig = Object.assign({}, appConfig)
            let component;

            before(() => {
              appConfig.closedLocations = ['']
              const data = Object.assign(
                {},
                item.full,
                { physRequestable: true }
              );

              component = mount(
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
              );
            })

            after(() => {
              appConfig.features = savedConfig.features
              appConfig.closedLocations = savedConfig.closedLocations
            })

            it('should not have a link', () => {
              expect(component.find(Link).length).to.equal(0)
            })
          })

          describe('should not be present if not physRequestable', () => {
            const savedConfig = Object.assign({}, appConfig)
            let component;

            before(() => {
              const data = Object.assign(
                {},
                item.full,
                { physRequestable: false }
              );

              component = mount(
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
              );
            })

            after(() => {
              appConfig.features = savedConfig.features
              appConfig.closedLocations = savedConfig.closedLocations
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
            before(() => {
              const data = Object.assign(
                {},
                item.full,
                { eddRequestable: true }
              );

              component = mount(
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
              );
            })

            it('should have a link with avail-request-button class', () => {
              console.log('edd request appConfig: ', appConfig.closedLocations)
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
              expect(link.prop('to')).to.include('/hold/request/b12345-i17326129/edd')
            })

            it('should say Request Scan', () => {
              const link = component.find(Link).at(0)
              expect(link.text()).to.equal('Request Scan')
            })
          })

          describe('should be disabled when item not available', () => {
            let component;
            before(() => {
              const data = Object.assign(
                {},
                item.full,
                { eddRequestable: true, available: false }
              );

              component = mount(
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
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
            const savedConfig = Object.assign({}, appConfig)
            let component;

            before(() => {
              appConfig.features = ['aeon-links']
              const data = Object.assign(
                {},
                item.full,
                { eddRequestable: true, aeonUrl: 'http://www.aeon.com' }
              );

              component = mount(
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
              );
            })

            after(() => {
              appConfig.features = savedConfig.features
            })

            it('should not have a link', () => {
              expect(component.find(Link).length).to.equal(0)
            })
          })

          describe('should not be present in case of closure', () => {
            const savedConfig = Object.assign({}, appConfig)
            let component;

            before(() => {
              appConfig.closedLocations = ['']
              const data = Object.assign(
                {},
                item.full,
                { eddRequestable: true }
              );

              component = mount(
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
              );
            })

            after(() => {
              appConfig.features = savedConfig.features
              appConfig.closedLocations = savedConfig.closedLocations
            })

            it('should not have a link', () => {
              expect(component.find(Link).length).to.equal(0)
            })
          })

          describe('should not be present if not eddRequestable', () => {
            const savedConfig = Object.assign({}, appConfig)
            let component;

            before(() => {
              const data = Object.assign(
                {},
                item.full,
                { eddRequestable: false }
              );

              component = mount(
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
              );
            })

            after(() => {
              appConfig.features = savedConfig.features
              appConfig.closedLocations = savedConfig.closedLocations
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
            before(() => {
              const data = Object.assign(
                {},
                item.full,
                { aeonUrl: 'http://www.aeon.com' }
              );

              component = mount(
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
              );
            })

            // it('should have a link with avail-request-button class', () => {
            //   console.log('edd request appConfig: ', appConfig.closedLocations)
            //   const links = component.find('a')
            //   expect(links.length).to.equal(1);
            //   const link = links.at(0);
            //   expect(link.prop('className')).to.equal('aeonRequestButton avail-request-button')
            // })

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
            before(() => {
              const data = Object.assign(
                {},
                item.full,
                { aeonUrl: 'http://www.aeon.com', available: false }
              );

              component = mount(
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
              );
            })

            // it('should have a link with unavail-request-button class', () => {
            //   const links = component.find('a')
            //   expect(links.length).to.equal(1);
            //   const link = links.at(0);
            //   expect(link.prop('className')).to.equal('aeonRequestButton unavail-request-button')
            // })

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
            const savedConfig = Object.assign({}, appConfig)
            let component;

            before(() => {
              appConfig.features = ['aeon-links']
              const data = Object.assign(
                {},
                item.full,
                { eddRequestable: true }
              );

              component = mount(
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
              );
            })

            after(() => {
              appConfig.features = savedConfig.features
            })

            // it('should not have an aeon link', () => {
            //   expect(component.find('a').length).to.equal(1)
            //   expect(component.find('a').at(0).text()).to.not.equal('Request Appointment')
            // })
          })

          describe('should not be present in case Aeon is not being displayed', () => {
            const savedConfig = Object.assign({}, appConfig)
            let component;

            before(() => {
              appConfig.features = []
              const data = Object.assign(
                {},
                item.full,
                { aeonUrl: 'http://www.aeon.com', eddRequestable: true }
              );

              component = mount(
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
              );
            })

            after(() => {
              appConfig.features = savedConfig.features
            })

            // it('should not have an aeon link', () => {
            //   expect(component.find('a').length).to.equal(1)
            //   console.log('aeon test: ', component.find('a').at(0).text())
            //   console.log('test features: ', appConfig.features)
            //   expect(component.find('a').at(0).text()).to.not.equal('Request Appointment')
            // })
          })

          describe('should not be present in case of closure', () => {
            const savedConfig = Object.assign({}, appConfig)
            let component;

            before(() => {
              appConfig.closedLocations = ['']
              const data = Object.assign(
                {},
                item.full,
                { aeonUrl: 'http://www.aeon.com', available: false }
              );

              component = mount(
                <ItemTableRow item={data} bibId="b12345"/>,
                { context }
              );
            })

            after(() => {
              appConfig.features = savedConfig.features
              appConfig.closedLocations = savedConfig.closedLocations
            })

            // it('should not have a link', () => {
            //   expect(component.find('a').length).to.equal(0)
            // })
          })
        })
      });
    });
  });
});
