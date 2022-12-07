/* eslint-env mocha */
import { expect } from 'chai';
import { jsdom } from 'jsdom';
import fs from 'fs';

import { isClosed, convertEncoreUrl, formatPatronExpirationDate, manipulateAccountPage } from './../../src/app/utils/accountPageUtils';
import appConfig from './../../src/app/data/appConfig';

describe('`isClosed`', () => {
  it('should return true for string with "CLOSED"', () => {
    expect(isClosed('Andrew Heiskell (CLOSED)')).to.equal(true);
  });
  it('should return true for string with "STAFF ONLY"', () => {
    expect(isClosed('STAFF ONLY-SASB Rare Book Rm324')).to.equal(true);
  });
  it('should return true for string with "Performing Arts"', () => {
    expect(isClosed('Performing Arts - Spec Col Desk')).to.equal(true);
  });
  it('should return false for string without above cases', () => {
    expect(isClosed('53rd Street')).to.equal(false);
  });
});

describe('`convertEncoreUrl`', () => {
  it('should convert a conventionally structured Encore item URL to `discovery-front-end` URL', () => {
    expect(convertEncoreUrl('https://browse.nypl.org/iii/encore/record/C__Rb21771946?lang=eng&suite=def')).to.equal(`${appConfig.baseUrl}/bib/b21771946`);
  });

  it('should return passed URL if it does not follow convention of Encore item URL', () => {
    const malformedUrl = 'https://browse.nypl.org/iii/encore/record/somethingisnotright';
    expect(convertEncoreUrl(malformedUrl)).to.equal(malformedUrl);
  });
});

describe('`formatPatronExpirationDate`', () => {
  it('should return invalid values unmodified', () => {
    expect(formatPatronExpirationDate()).to.be.an('undefined')
    expect(formatPatronExpirationDate('')).to.eq('')
    expect(formatPatronExpirationDate(Math.PI)).to.eq(Math.PI)
    expect(formatPatronExpirationDate('2021')).to.eq('2021')
    expect(formatPatronExpirationDate('August 29, 1997')).to.eq('August 29, 1997')
  });

  it('should transform YYYY-MM-DD to MM-DD-YYYY', () => {
    expect(formatPatronExpirationDate('1997-08-29')).to.eq('08-29-1997')
    expect(formatPatronExpirationDate('2021-1-2')).to.eq('1-2-2021')
  });
});

describe('manipulateAccountPage', () => {
  const manipulateAccountDom = (dom) => {
    // Add NodeList.forEach polyfill
    if (window.NodeList && !NodeList.prototype.forEach) {
      NodeList.prototype.forEach = Array.prototype.forEach;
    }
    /*eslint-disable @typescript-eslint/no-unused-vars*/
    manipulateAccountPage(
      dom, // accountPageContent
      () => null, // updateAccountHtml
      { id: 'patronid', patronType: 'patrontype' }, // patron
      'holds', // contentType
      () => null, // setIsLoading
      () => null, // setItemToCancel
    );
  };

  describe('Sierra 5.3', () => {
    it('should remove links to OTF records', () => {
      const dom = jsdom(fs.readFileSync('./test/fixtures/sierra-5.3-patron-5427701-webpac-holds-markup.html', 'utf8'));

      // Establish some expectations on the original markup:
      // Starts off with 13 links for 13 holds (some of which are OTF records)
      expect(dom.querySelectorAll('.patFuncBibTitle a')).to.have.lengthOf(13);

      // Apply manipulations:
      manipulateAccountDom(dom);

      // 10 links have been removed from 10 OTF records
      expect(dom.querySelectorAll('.patFuncBibTitle a')).to.have.lengthOf(3);
      // Check that the linked bibs that remain are not OTF records:
      const linkedBibTitles = Array.from(dom.querySelectorAll('.patFuncBibTitle a')).map(a => a.textContent);
      expect(linkedBibTitles).to.have.members([
        'Toast / by Raquel Pelzel ; photographs by Evan Sung.',
        '-2 +3 Stefano Arienti, Massimo Bartolini : la Collezione di Museion = die Sammlung Museion = the Museion collection. Minus 2 plus 3 Minus two plus three Stefano Arienti, Massimo Bartolini',
        'Addresses, historical - political - sociological, by Frederic R. Coudert.'
      ]);
    });
  });

  describe('Sierra 5.1', () => {
    it('should remove links to OTF records', () => {
      const dom = jsdom(fs.readFileSync('./test/fixtures/sierra-5.1-patron-5035845-webpac-holds-markup.html', 'utf8'));

      // Establish some expectations on the original markup:
      // Starts off with 4 links for 4 holds (some of which are OTF records)
      expect(dom.querySelectorAll('.patFuncTitle a')).to.have.lengthOf(4);

      // Apply manipulations:
      manipulateAccountDom(dom);

      // 3 links have been removed from 3 OTF records
      const links = dom.querySelectorAll('.patFuncTitle a')
      expect(links).to.have.lengthOf(1);
      // Check that the linked bibs that remain are not OTF records:
      const linkedBibTitles = Array.from(links).map(a => a.textContent)
      expect(linkedBibTitles).to.have.members([
        'A table / Jean Follain.'
      ]);
    });

    it('should remove all .patFuncMark TDs whether or not they have an INPUT', () => {
      const dom = jsdom(fs.readFileSync('./test/fixtures/sierra-5.1-patron-sb-webpac-holds-markup.html', 'utf8'));

      // Establish some expectations on the original markup:
      // 13 holds with 13 TDs (some of which have checkbox inputs):
      expect(dom.querySelectorAll('td.patFuncMark')).to.have.lengthOf(5);

      // Apply manipulations:
      manipulateAccountDom(dom);

      // All of the left-side TDs (some of which had checkboxs) have been removed:
      expect(dom.querySelectorAll('td.patFuncMark')).to.have.lengthOf(0);
    });
  });
});
