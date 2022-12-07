const request = require('supertest');
const sinon = require('sinon');
import { expect } from 'chai';
import DocumentTitle from 'react-document-title';
import appConfig from '@appConfig';

let app = require('./../../server');

describe('server', () => {
  let sandbox;

  before(() => {
    sandbox = sinon.createSandbox();

    // DocumentTitle.rewind() is used in server.js to build the document title
    // but it can only be used "server-side". It's built on `react-side-effect`,
    // which determines whether or not it is "server-side" through this:
    // https://github.com/gaearon/react-side-effect/blob/19401cd1767fc5593f14fe14912bd66788494986/src/index.js#L3-L7
    // So, because global.window is set when `react-document-title` is included,
    // `DocumentTitle.rewind()` throws an error.
    // The important thing is that our template uses the value that
    // `DocumentTitle.rewind()` returns, so let's stub it:
    sandbox.stub(DocumentTitle, 'rewind').callsFake(() => appConfig.displayTitle);
  });

  after(() => {
    sandbox.restore();
  });

  describe('Base Url Paths', () => {
    it('redirects to baseurl', (done) => {
      request(app)
      .get('/')
      .expect('Content-Type', /text/)
      .expect('Location', `${appConfig.baseUrl}/`)
      .expect(302)
        .then(() => {
        done();
      })
      .catch(err => done(err));
      ;
    });
    
    it('serves meta tags with DISPLAY_TITLE', (done) => {
      request(app)
      .get(`${appConfig.baseUrl}/`)
      .expect(200)
      .then((response) => {
        expect(response.text).to.include(`<title>${appConfig.displayTitle}</title>`)
        expect(response.text).to.include(`<meta property="og:title" content="${appConfig.displayTitle}">`)
        expect(response.text).to.include(`<meta property="og:site_name" content="${appConfig.displayTitle}">`)
        expect(response.text).to.include(`<meta name="twitter:title" content="${appConfig.displayTitle}">`)
        expect(response.text).to.include(`<meta property="og:url" content="https://www.nypl.org${appConfig.baseUrl}">`)
        done();
      })
      .catch(err => done(err));
      ;
    });
  })
});
