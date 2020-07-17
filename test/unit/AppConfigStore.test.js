/* eslint-env mocha */
import { expect } from 'chai';
import { mock } from 'sinon';

import AppConfigStore from '../../src/app/stores/AppConfigStore';
import appConfig from '../../src/app/data/appConfig';

describe('AppConfigStore', () => {
  let appConfigMock;
  const getFeatures = () => AppConfigStore.getState().features;
  before(() => {
    appConfigMock = mock(appConfig);
  });
  before(() => {
    appConfigMock.restore();
  });

  describe('features', () => {
    beforeEach(() => {
      appConfig.features = null;
    });

    it('handles empty features array', () => {
      appConfig.features = [];
      expect(getFeatures()).to.deep.equal([]);
    });

    it('returns same value in appConfig', () => {
      appConfig.features = ['several', 'other', 'features'];
      expect(getFeatures()).to.deep.equal(['several', 'other', 'features']);
    });
  });
});
