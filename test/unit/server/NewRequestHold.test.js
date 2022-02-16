import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import LibraryItem from '../../../src/app/utils/item';
import Bib from '../../../src/server/ApiRoutes/Bib';
import bibs from '../../fixtures/bibs';
import app from './../../../server';

function useBib(initialBib) {
  const store = {
    bib: { ...initialBib },
  };

  return [
    store,
    function setBib(newBib) {
      return (store.bib = newBib);
    },
  ];
}

describe('Hold Request', () => {
  const sandbox = sinon.createSandbox();
  const [bib, setBib] = useBib(bibs[3]);

  describe('New Hold Request', () => {
    before(function () {
      sandbox.stub(Bib, 'fetchBib').callsFake((__, cb) => {
        return new Promise(() => {
          cb({ bib: bibs[3] });
        });
      });

      sandbox.stub(LibraryItem, 'getItem').callsFake(() => {
        return { barcode: 'abc123' };
      });
    });

    after(function () {
      sandbox.restore();
    });

    it('Redirects to Aeon if request for special collections', function (done) {
      request(app)
        .get(`${process.env.BASE_URL}/hold/request/${bibId}-${itemId}`)
        .expect(302)
        .then((res) => {
          expect(res.text, 'Not redirecting').to.include('Redirecting');
          expect(res.text, 'None aeon url').to.include('aeon');
          expect(res.text, 'Unmatched record').to.include(`record=${bibId}`);

          done();
        })
        .catch((error) => done(error));
    });
  });
});
