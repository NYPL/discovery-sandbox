/* eslint-env mocha */
import React from 'react';
import sinon from 'sinon';
import axios from 'axios';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import DataLoader from './../../src/app/components/DataLoader/DataLoader';
import Actions from './../../src/app/actions/Actions';
import appConfig from '@appConfig';

Enzyme.configure({ adapter: new Adapter() });

describe.only('DataLoader', () => {
  describe('Non-matching path', () => {
    let component;
    let loadingAction;
    let bibAction;
    let axiosStub;
    const axiosCalls = [];
    const location = {
      pathname: '/research/collections/shared-collection-catalog/nonMatchingPath',
    };

    before(() => {
      loadingAction = sinon.spy(Actions, 'updateLoadingStatus');
      bibAction = sinon.spy(Actions, 'updateBib');

      axiosStub = sinon.stub(axios, 'get').callsFake(args =>
        new Promise((resolve) => {
          axiosCalls.push(args);
          resolve({ data: 'bib' });
        }),
      );
    });


    after(() => {
      loadingAction.restore();
      bibAction.restore();
      axiosStub.restore();
    });

    it('should not call axios', () => {
      expect(axiosCalls.length).to.equal(0);
    });

    it('should make no Action calls', () => {
      expect(loadingAction.called).to.equal(false);
      expect(bibAction.called).to.equal(false);
    });
  });

  describe('Matching path', () => {
    const location = {
      pathname: '/research/collections/shared-collection-catalog/bib/b1234',
    };

    describe('OK Bib response', () => {
      let component;
      let loadingAction;
      let bibAction;
      let axiosStub;
      const axiosCalls = [];

      before(() => {
        loadingAction = sinon.spy(Actions, 'updateLoadingStatus');
        bibAction = sinon.spy(Actions, 'updateBib');

        axiosStub = sinon.stub(axios, 'get').callsFake(args =>
          new Promise((resolve) => {
            axiosCalls.push(args);
            resolve({ data: 'bib' });
          }),
        );

        component = shallow(<DataLoader location={location} children={[]} />);
      });

      after(() => {
        loadingAction.restore();
        bibAction.restore();
        axiosStub.restore();
      });

      it('should update Loading status to true', () => {
        expect(loadingAction.firstCall.args).to.eql([true]);
      });

      it('should make an axios call', () => {
        expect(axiosCalls).to.include(`${appConfig.baseUrl}/api/bib?bibId=b1234`);
      });

      it('should update loading status to false', () => {
        expect(loadingAction.secondCall.args).to.eql([false]);
      });

      it('should make no further Action calls', () => {
        expect(loadingAction.calledTwice);
      });

      it('should make no further axios calls', () => {
        expect(axiosCalls.length).to.equal(1);
      });
    });

    describe('Error response', () => {
      let component;
      let loadingAction;
      let bibAction;
      let axiosStub;
      let consoleError;
      const axiosCalls = [];

      before(() => {
        loadingAction = sinon.spy(Actions, 'updateLoadingStatus');
        bibAction = sinon.spy(Actions, 'updateBib');
        consoleError = sinon.spy(console, 'error');

        axiosStub = sinon.stub(axios, 'get').callsFake(args =>
          new Promise((reject) => {
            axiosCalls.push(args);
            reject();
          }),
        );

        component = shallow(<DataLoader location={location} children={[]} />);
      });

      after(() => {
        loadingAction.restore();
        bibAction.restore();
        consoleError.restore();
        axiosStub.restore();
      });

      it('should update Loading status to true', () => {
        expect(loadingAction.firstCall.args).to.eql([true]);
      });

      it('should make an axios call', () => {
        expect(axiosCalls).to.include(`${appConfig.baseUrl}/api/bib?bibId=b1234`);
      });

      it('should update loading status to false', () => {
        expect(loadingAction.secondCall.args).to.eql([false]);
      });

      it('should make no further Action calls', () => {
        expect(loadingAction.calledTwice);
      });

      it('should make no further axios calls', () => {
        expect(axiosCalls.length).to.equal(1);
      });

      it('should log an error', () => {
        expect(consoleError.firstCall.args).to.include(
          'Error attempting to make an ajax request to fetch a bib record from ResultsList',
        );
      });
    });
  });
});
