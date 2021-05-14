/* eslint-env mocha */
import { expect } from 'chai';

import {
  createResearchNowQuery,
  authorQuery,
  generateStreamedReaderUrl,
  formatUrl,
  getResearchNowQueryString,
  getQueryString,
} from '../../src/app/utils/researchNowUtils';

describe('researchNowUtils', () => {
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

  describe('getQueryString', () => {
    it('should create query strings with comma delimited values', () => {
      expect(getQueryString({
        one: 1,
        two: [ 'this', 'that' ],
        three: [ ]
      })).to.equal('?one=1&two=this,that&three=')
    })
  })

  describe('getResearchNowQueryString', () => {
    it('should handle empty query', () => {
      expect(getResearchNowQueryString({})).to.equal('?query=keyword%3A*&page=1')
    })

    it('should handle simple keyword query', () => {
      expect(getResearchNowQueryString({ q: 'toast' })).to.equal('?query=keyword%3Atoast&page=1')
    })

    it('should handle search_scope', () => {
      expect(getResearchNowQueryString({ q: 'toast', search_scope: 'title' })).to.equal('?query=title%3Atoast&page=1')
    })

    it('should handle keyword & subject query', () => {
      expect(getResearchNowQueryString({ q: 'toast', filters: { subjectLiteral: 'Snacks' } })).to.equal('?query=keyword%3Atoast,subject%3ASnacks&page=1')
    })

    it('should handle contributor filter', () => {
      expect(getResearchNowQueryString({ filters: { contributorLiteral: 'Poe' } })).to.equal('?query=keyword%3A*,author%3APoe&page=1')
    })

    it('should handle lang filter', () => {
      expect(getResearchNowQueryString({ filters: { language: 'en' } })).to.equal('?query=keyword%3A*&page=1&filter=language%3Aen')
    })

    it('should handle dateAfter filter', () => {
      expect(getResearchNowQueryString({ filters: { dateAfter: 2000 } })).to.equal('?query=keyword%3A*&page=1&filter=startYear%3A2000')
    })

    it('should handle dateBefore filter', () => {
      expect(getResearchNowQueryString({ filters: { dateBefore: 2020 } })).to.equal('?query=keyword%3A*&page=1&filter=endYear%3A2020')
    })

    it('should handle dateAfter & dateBefore filter', () => {
      expect(getResearchNowQueryString({ filters: { dateAfter: 2000, dateBefore: 2020 } })).to.equal('?query=keyword%3A*&page=1&filter=startYear%3A2000,endYear%3A2020')
    })
  })
})
