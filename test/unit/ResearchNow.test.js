/* eslint-env mocha */
import sinon from 'sinon';
import { expect } from 'chai';

import NyplApiClient from '@nypl/nypl-data-api-client';

import ResearchNow from './../../src/server/ApiRoutes/ResearchNow';

describe('ResearchNow', () => {
  describe('search', () => {
    const sinonSandbox = sinon.createSandbox();

    beforeEach(() => {
      sinonSandbox.stub(NyplApiClient.prototype, 'get').callsFake(() => {
        return Promise.resolve(
          JSON.parse(
            require('fs').readFileSync(
              './test/fixtures/drb-query-blank.json',
              'utf8',
            ),
          ),
        );
      });
    });

    afterEach(() => {
      sinonSandbox.restore();
    });

    it('should handle empty search', () => {
      return ResearchNow.search({ query: { q: '' } }).then((res) => {
        expect(NyplApiClient.prototype.get.calledOnce).to.be.true;
        expect(NyplApiClient.prototype.get.args[0][0]).to.equal(
          '?query=keyword%3A*&page=1&source=catalog&size=3',
        );
        expect(res.works).to.be.a('array');
      });
    });

    it('should handle keyword search', () => {
      return ResearchNow.search({ query: { q: 'toast' } }).then((res) => {
        expect(NyplApiClient.prototype.get.calledOnce).to.be.true;
        expect(NyplApiClient.prototype.get.args[0][0]).to.equal(
          '?query=keyword%3Atoast&page=1&source=catalog&size=3',
        );
        expect(res.works).to.be.a('array');
      });
    });

    it('should handle keyword search with filter', () => {
      return ResearchNow.search({
        query: { q: 'toast', filters: { contributorLiteral: 'Poe' } },
      }).then((res) => {
        expect(NyplApiClient.prototype.get.calledOnce).to.be.true;
        expect(NyplApiClient.prototype.get.args[0][0]).to.equal(
          '?query=keyword%3Atoast,author%3APoe&page=1&source=catalog&size=3',
        );
        expect(res.works).to.be.a('array');
      });
    });

    describe('DRB V3 legacy support', () => {
      const sinonSandbox = sinon.createSandbox();

      before(() => {
        // Set DRB_API_BASE_URL to something resembling a v3 endpoint:
        process.env.DRB_API_BASE_URL = 'http://example.com/v3/search/';
      });

      after(() => {
        // Set DRB_API_BASE_URL back to test.env val
        process.env.DRB_API_BASE_URL = 'http://example.com/search/';
      });

      beforeEach(() => {
        sinonSandbox.stub(NyplApiClient.prototype, 'post').callsFake(() => {
          return Promise.resolve(
            JSON.parse(
              require('fs').readFileSync(
                './test/fixtures/drb-query-blank.json',
                'utf8',
              ),
            ),
          );
        });
      });

      afterEach(() => {
        sinonSandbox.restore();
      });

      it('should handle empty search', () => {
        return ResearchNow.search({ query: { q: '' } }).then((res) => {
          expect(NyplApiClient.prototype.post.calledOnce).to.be.true;
          expect(NyplApiClient.prototype.post.args[0][0]).to.equal('');
          expect(NyplApiClient.prototype.post.args[0][1]).to.deep.equal({
            page: 0,
            per_page: 3,
            queries: [
              {
                field: 'keyword',
                query: '*',
              },
            ],
            source: 'catalog',
          });
          expect(res.works).to.be.a('array');
        });
      });
    });
  });
});
