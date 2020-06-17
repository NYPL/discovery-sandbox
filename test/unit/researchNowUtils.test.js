/* eslint-env mocha */
import { expect } from 'chai';

import {
  createResearchNowQuery,
  authorQuery,
  generateStreamedReaderUrl,
  formatUrl,
  getResearchNowQueryString,
} from '../../src/app/utils/researchNowUtils';

describe('generateStreamedReaderUrl', () => {
  const eReaderUrl = 'eReaderUrl';
  const referrer = 'referrer';
  it('should return appropriately formatted webpub-viewer link', () => {
    const links = [
      {
        url: 'https://read-online-url-1',
        media_type: 'application/pdf',
        content: null,
        thumbnail: null,
        local: true,
        download: true,
        images: true,
        ebook: true,
      }];
    const url = generateStreamedReaderUrl(links[0].url, eReaderUrl, referrer);
    expect(url).to.equal('eReaderUrl/readerNYPL/?url=eReaderUrl'
    + '/pub/aHR0cHM6Ly9yZWFkLW9ubGluZS11cmwtMQ%253D%253D/manifest.json');
  });
});
