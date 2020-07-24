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

  /**
   * extractFeatures()
   */
  describe(('extractFeatures'), () => {
    it('handles non-string parameters', () => {
      expect(appConfig.extractFeatures()).to.deep.equal([]);
      expect(appConfig.extractFeatures(undefined)).to.deep.equal([]);
      expect(appConfig.extractFeatures(null)).to.deep.equal([]);
      expect(appConfig.extractFeatures(-1)).to.deep.equal([]);
      expect(appConfig.extractFeatures(Math.PI)).to.deep.equal([]);
    });

    it('handles malformed features String', () => {
      expect(appConfig.extractFeatures(',,dasdfksdjfdsf,,').length).to.deep.equal(1);
    });

    it('returns array of values', () => {
      expect(appConfig.extractFeatures('several,other,features')).to.deep.equal(['several', 'other', 'features']);
    });

    it('strips whitespace', () => {
      expect(appConfig.extractFeatures('several ,other  , foo  , features')).to.deep.equal(['several', 'other', 'foo', 'features']);
    });
  });
});
