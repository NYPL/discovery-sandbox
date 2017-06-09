/* eslint-env mocha */
import React from 'react';
import axios from 'axios';
import sinon from 'sinon';
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import { mount } from 'enzyme';
// Import the component that is going to be tested
import HoldRequest from './../../src/app/components/HoldRequest/HoldRequest.jsx';

import PatronStore from './../../src/app/stores/PatronStore.js';
import Actions from './../../src/app/actions/Actions.js';

describe('HoldRequest', () => {
  describe('After being rendered, <HoldRequest>', () => {
    let component;
    let requireUser;

    before(() => {
      requireUser = sinon.spy(HoldRequest.prototype, 'requireUser');

      component = mount(<HoldRequest />);
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should check if the patron is logged in.', () => {
      expect(requireUser.calledOnce).to.equal(true);
    });
  });

  describe('If the patron is not logged in, <HoldRequest>', () => {
    let component;
    let requireUser;

    before(() => {
      requireUser = sinon.spy(HoldRequest.prototype, 'requireUser');

      component = mount(<HoldRequest />);
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should redirect the patron to OAuth log in page.', () => {
      expect(requireUser.returnValues[0]).to.equal(false);
    });
  });

  describe('If the patron is logged in but the App doesn\'t get valid data, <HoldRequest>', () => {
    let component;
    let requireUser;

    before(() => {
      Actions.updatePatronData({ id: '6677200', names: ['Leonard, Mike'], barcodes: ['162402680435300'] });
      requireUser = sinon.spy(HoldRequest.prototype, 'requireUser');

      component = mount(<HoldRequest />);
    });

    after(() => {
      requireUser.restore();
      component.unmount();
    });

    it('should pass the patron data check in requireUser().', () => {
      expect(requireUser.returnValues[0]).to.equal(true);
    });

    it('should display the layout of error page.', () => {

    });

    it('should deliver the patron\'s name on the page', () => {

    });

    it('should not deliver request button with the respective URL on the page', () => {

    });
  });

  describe('If the patron is logged in and the App receives valid data, <HoldRequest>', () => {
    it('should display the layout of hold request.', () => {

    });

    it('should deliver the patron\'s name on the page', () => {

    });

    it('should deliver request button with the respective URL on the page', () => {

    });
  });



    // it('should have <Header>, <Footer>, and <section>.', () => {
    //   expect(component.find('.nypl-library-card-app').find('Header')).to.have.length(1);
    //   expect(component.find('.nypl-library-card-app').find('Footer')).to.have.length(1);
    //   expect(component.find('.nypl-library-card-app').find('section')).to.have.length(1);
    // });

    // it('should have a <section> with the ID, "main-content".', () => {
    //   expect(component.find('.nypl-library-card-app').find('section').prop('id'))
    //     .to.equal('main-content');
    // });

    // it('should have a <section> that contains a <div> with class "barcode-container"', () => {
    //   expect(component.find('section').find('.barcode-container')).to.have.length(1);
    //   expect(component.find('.barcode-container').type()).to.equal('div');
    // });

    // it('should have a <section> that contains a <div> with class "get-card-message"', () => {
    //   expect(component.find('.barcode-container').find('.get-card-message')).to.have.length(1);
    //   expect(component.find('.get-card-message').type()).to.equal('div');
    // });

    // it('should have the state of "accessToken" with the value of ""', () => {
    //   expect(component.state().accessToken).to.deep.equal('');
    // });

    // it('should have the state of "patronName" with the value of ""', () => {
    //   expect(component.state().patronName).to.deep.equal('');
    // });

    // it('should have the state of "barcodeSrc" with a value of ""', () => {
    //   expect(component.state().barcodeSrc).to.deep.equal('');
    // });

    // it('should have the state of "barcodeNumber" with a value of ""', () => {
    //   expect(component.state().barcodeNumber).to.deep.equal('');
    // });

    // it('should try to get the "access_token" from the "nyplIdentityPatron" cookie', () => {
    //   expect(getOAuthAccessToken.calledOnce).to.equal(true);
    //   getOAuthAccessToken.alwaysCalledWithExactly('nyplIdentityPatron');
    // });
  // });

  // describe('If "nyplIdentityPatron" cookie and its "access_token" does not exist, <BarcodeContainer>', () => {
  //   let component;
  //   let hasCookie;
  //   let goToOAuthLogIn;

  //   before(() => {
  //     hasCookie = sinon.stub(CookieUtils, 'hasCookie')
  //       .withArgs('nyplIdentityPatron')
  //       .returns(false);

  //     goToOAuthLogIn = sinon.spy(BarcodeContainer.prototype, 'goToOAuthLogIn');

  //     component = mount(<BarcodeContainer />);
  //   });

  //   after(() => {
  //     CookieUtils.hasCookie.restore();
  //     goToOAuthLogIn.restore();
  //   });

  //   it('should lead the user to OAuth log in page.', () => {
  //     expect(goToOAuthLogIn.calledOnce).to.equal(true);
  //   });
  // });

  // describe('If "access_token" exists and valid, <BarcodeContainer>', () => {
  //   let component;
  //   let hasCookie;
  //   let getCookie;
  //   let setState;
  //   let fetchBarcode;
  //   let getBarcodeData;

  //   before(() => {
  //     // We need stubs here for hasCookie() and getCookie() to control the value of
  //     // "nyplIdentityPatron". While we need a spy for setState() to test the real function.
  //     hasCookie = sinon.stub(CookieUtils, 'hasCookie')
  //       .withArgs('nyplIdentityPatron')
  //       .returns(true);

  //     getCookie = sinon.stub(CookieUtils, 'getCookie')
  //       .withArgs('nyplIdentityPatron')
  //       .returns(mockBarcodeContainerTestData.nyplIdentityPatronCookie);

  //     setState = sinon.spy(BarcodeContainer.prototype, 'setState');

  //     fetchBarcode = sinon.spy(BarcodeContainer.prototype, 'fetchBarcode');

  //     getBarcodeData = sinon.spy(CallAPIUtils, 'getBarcodeData');

  //     component = mount(<BarcodeContainer />);
  //   });

  //   after(() => {
  //     // stubs don't have restore(), the way to restore them is go back to the original functions.
  //     // However, if the sutbs only use the methods that belong to spies, restore() will work.
  //     CookieUtils.hasCookie.restore();
  //     CookieUtils.getCookie.restore();
  //     setState.restore();
  //     fetchBarcode.restore();
  //     getBarcodeData.restore();
  //   });

  //   it('should update its state of "accessToken" and "patronID".', () => {
  //     expect(setState.calledTwice).to.equal(true);
  //     expect(component.state().accessToken).to.deep.equal(mockBarcodeContainerTestData.accessToken);
  //     expect(component.state().patronID).to.deep.equal(mockBarcodeContainerTestData.patronID);
  //   });

  //   it('should call the barcode API endpoint based on its state of "accessToken".', () => {
  //     expect(fetchBarcode.calledOnce).to.equal(true);
  //     fetchBarcode.alwaysCalledWithExactly(
  //       mockBarcodeContainerTestData.accessToken,
  //       mockBarcodeContainerTestData.patronID
  //     );
  //     expect(getBarcodeData.calledOnce).to.equal(true);
  //     getBarcodeData.alwaysCalledWithExactly(
  //       mockBarcodeContainerTestData.accessToken,
  //       mockBarcodeContainerTestData.patronID
  //     );
  //   });
  // });

  // describe('If the API call to the barcode endpoint fails, <BarcodeContainer>', () => {
  //   let component;
  //   const mock = new MockAdapter(axios);
  //   const mockAPI = `/library-card/new/get-barcode/${mockBarcodeContainerTestData.patronID}/${mockBarcodeContainerTestData.accessToken}`;
  //   // const callBarcodeAPI = (component = {}) => {
  //   //   axios
  //   //     .get(mockApi)
  //   //     .then(result => {
  //   //       component.setState({
  //   //         patronName: result.data.response.name || '',
  //   //         barcodeSrc,
  //   //         barcodeNumber: result.data.response.barCode || '',
  //   //       });
  //   //     })
  //   //     .catch();
  //   // };

  //   before(() => {
  //     mock
  //       .onGet(mockAPI)
  //       .reply(400, mockBarcodeContainerTestData.apiErrorResponse);

  //     component = mount(<BarcodeContainer />);
  //   });

  //   after(() => {
  //     mock.reset();
  //   });

  //   it('should have a <div> with the class "barcode-container" ' +
  //     'that contains a <div> with class "get-card-message"',
  //     (done) => {
  //       setTimeout(
  //         () => {
  //           expect(component.find('.barcode-container').find('.get-card-message')).to.have.length(1);
  //           expect(component.find('.barcode-container').find('.get-card-message').type()).to.equal('div');
  //           done();
  //         }, 1500
  //       );
  //     }
  //   );

  //   it('should have the state of "patronName" with the value of "", ' +
  //     'the state of "barcodeSrc" with a value of "", ' +
  //     'and the state of "barcodeNumber" with a value of ""',
  //     (done) => {
  //       setTimeout(
  //         () => {
  //           expect(component.state().patronName).to.deep.equal('');
  //           expect(component.state().barcodeSrc).to.deep.equal('');
  //           expect(component.state().barcodeNumber).to.deep.equal('');
  //           done();
  //         }, 1500
  //       );
  //     }
  //   );
  // });
});
