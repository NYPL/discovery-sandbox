import { expect } from 'chai';
import sinon from 'sinon';
import request from 'supertest';
import LibraryItem from '../../src/app/utils/item';
import Bib from '../../src/server/ApiRoutes/Bib';
import bibs from '../fixtures/bibs';
import app from '../../server';

describe('Hold Request', () => {
  const sandbox = sinon.createSandbox();
  const [bib, setBib] = useBib(bibs[3]);

  describe('New Hold Request', () => {
    before(function () {
      sandbox.stub(Bib, 'fetchBib').callsFake((__, cb) => {
        return new Promise(() => {
          cb(bib);
        });
      });

      sandbox.stub(LibraryItem, 'getItem').callsFake(() => {
        return { barcode: 'abc123' };
      });
    });

    after(function () {
      sandbox.restore();
    });

    it('Redirects to Aeon if request for special collections', (done) => {
      const bibId = 'b21147020';
      const itemId = 'i34755671';

      request(app)
        .get(`${process.env.BASE_URL}/hold/request/${bibId}-${itemId}`)
        .expect(302)
        .then((res) => {
          expect(res.redirect, 'Not a redirect').to.be.true;
          expect(res.serverError, 'Server Errored').to.be.false;
          expect(res.text, 'Not redirecting').to.include('Redirecting');
          expect(res.text, 'None aeon url').to.include('aeon');
          expect(res.text, 'Unmatched record').to.include(`record=${bibId}`);

          done();
        })
        .catch((error) => done(error));
    });

    it('Redirects to Login if request is unauthorized', (done) => {
      setBib(bibs[0]);
      const bibId = 'b11417539';
      const itemId = 'i13183119';

      request(app)
        .get(`${process.env.BASE_URL}/hold/request/${bibId}-${itemId}`)
        .expect(302)
        .then((res) => {
          expect(res.redirect, 'Not a redirect').to.be.true;
          expect(res.serverError, 'Server Errored').to.be.false;
          expect(res.text, 'Not redirecting').to.include('Redirecting');
          expect(res.text, 'Not Login Redirect').to.include(`login.nypl.org`);

          done();
        })
        .catch((error) => done(error));
    });
  });
});

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
