/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

// Import the component that is going to be tested
import BibDetails from './../../src/app/components/BibPage/BibDetails';
import bibs from '../fixtures/bibs';

describe('BibDetails', () => {
  describe('Invalid props', () => {
    it('should return null with no props passed', () => {
      const component = shallow(React.createElement(BibDetails));
      expect(component.type()).to.equal(null);
    });

    it('should return null with no bib passed', () => {
      const component = shallow(React.createElement(BibDetails, { bib: null }));
      expect(component.type()).to.equal(null);
    });

    it('should return null if bib is not an object', () => {
      const stringItem = shallow(React.createElement(BibDetails, { bib: 'not an object', fields: [] }));
      const objectItem = shallow(React.createElement(BibDetails, { bib: ['not an object'], fields: [] }));

      expect(stringItem.type()).to.equal(null);
      expect(objectItem.type()).to.equal(null);
    });
  });

  describe('Top fields', () => {
    const fields = [
      { label: 'Title', value: 'titleDisplay' },
      { label: 'Found In', value: 'partOf' },
      { label: 'Author', value: 'creatorLiteral', linkable: true },
      { label: 'Additional Authors', value: 'contributorLiteral', linkable: true },
    ];
    let component;

    before(() => {
      component = mount(React.createElement(BibDetails, { bib: bibs[0], fields }));
    });

    it('should display titles, authors', () => {
      expect(component.type()).to.equal(BibDetails);

      expect(component.find('dd')).to.have.lengthOf(2);
      expect(component.find('dt')).to.have.lengthOf(2);
      // Expect first DT to contain titleDisplay:
      expect(component.find('dd').at(0).text()).to.equal(bibs[0].titleDisplay[0]);
      // Expect second DT to contain creatorLiteral:
      expect(component.find('dd').at(1).text()).to.equal(bibs[0].creatorLiteral[0]);
    });
  });

  describe('Bottom fields', () => {
    const fields = [
      { label: 'Publication', value: 'publicationStatement' },
      { label: 'Publication Date', value: 'serialPublicationDates' },
      { label: 'Electronic Resource', value: 'React Component' },
      { label: 'Description', value: 'extent' },
      { label: 'Series Statement', value: 'seriesStatement' },
      { label: 'Uniform Title', value: 'uniformTitle' },
      { label: 'Alternative Title', value: 'titleAlt' },
      { label: 'Former Title', value: 'formerTitle' },
      { label: 'Subject', value: 'subjectHeadingData' },
      { label: 'Genre/Form', value: 'genreForm' },
      { label: 'Notes', value: 'React Component' },
      { label: 'Additional Resources', value: 'supplementaryContent', selfLinkable: true },
      { label: 'Contents', value: 'tableOfContents' },
      { label: 'Bibliography', value: '' },
      { label: 'Call Number', value: 'identifier', identifier: 'bf:ShelfMark' },
      { label: 'ISBN', value: 'identifier', identifier: 'bf:Isbn' },
      { label: 'ISSN', value: 'identifier', identifier: 'bf:Issn' },
      { label: 'LCCN', value: 'identifier', identifier: 'bf:Lccn' },
      { label: 'OCLC', value: 'identifier', identifier: 'nypl:Oclc' },
      { label: 'GPO', value: '' },
      { label: 'Other Titles', value: '' },
      { label: 'Owning Institutions', value: '' },
    ];
    let component;

    // Test the same bib 1) with entity identifiers, and 2) with urn: identifiers:
    [
      { bib: bibs[0], description: 'with entity identifiers' },
      { bib: bibs[1], description: 'with urn: identifiers' },
    ].forEach((spec) => {
      xit(`should display publication, extent, subjects, shelfMark, and other identifiers [${spec.description}]`, () => {
        component = mount(React.createElement(BibDetails, { bib: spec.bib, fields }));
        expect(component.type()).to.equal(BibDetails);

        expect(component.find('dd')).to.have.lengthOf(8);
        console.log("logging dds length", component.find('dd').length);
        expect(component.find('dt')).to.have.lengthOf(8);
        expect(component.find('dd').at(0).text()).to.equal(bibs[0].publicationStatement[0]);
        expect(component.find('dd').at(1).text()).to.equal(bibs[0].extent[0]);
        // Note with noteType=Bibliography:
        expect(component.find('dd').at(3).text()).to.equal(bibs[0].note[0].prefLabel);
        expect(component.find('dd').at(4).text()).to.equal(bibs[0].shelfMark[0]);
        // Isbn:
        const [isbn, incorrectIsbn] = bibs[0].identifier.filter(ident => ident['@type'] === 'bf:Isbn');
        expect(component.find('dd').at(5).find('li').at(0).text()).to.equal(isbn['@value']);
        // Only check for identityStatus message if serialization supports it (urn: style does not):
        if (typeof bibs[0].identifier[0] === 'string') {
          expect(component.find('dd').at(5).find('li').at(1).text()).to.equal(`${incorrectIsbn['@value']} (${incorrectIsbn.identifierStatus})`);
        }
        // Lccn:
        const lccn = bibs[0].identifier.filter(ident => ident['@type'] === 'bf:Lccn').pop();
        expect(component.find('dd').at(6).text()).to.equal(lccn['@value']);
      });
    });
  });

  describe('Subject headings', () => {
    const fields = [
      { label: 'Publication', value: 'publicationStatement' },
      { label: 'Publication Date', value: 'serialPublicationDates' },
      { label: 'Electronic Resource', value: 'React Component' },
      { label: 'Description', value: 'extent' },
      { label: 'Series Statement', value: 'seriesStatement' },
      { label: 'Uniform Title', value: 'uniformTitle' },
      { label: 'Alternative Title', value: 'titleAlt' },
      { label: 'Former Title', value: 'formerTitle' },
      { label: 'Subject', value: 'subjectHeadingData' },
      { label: 'Genre/Form', value: 'genreForm' },
      { label: 'Notes', value: 'React Component' },
      { label: 'Additional Resources', value: 'supplementaryContent', selfLinkable: true },
      { label: 'Contents', value: 'tableOfContents' },
      { label: 'Bibliography', value: '' },
      { label: 'Call Number', value: 'identifier', identifier: 'bf:ShelfMark' },
      { label: 'ISBN', value: 'identifier', identifier: 'bf:Isbn' },
      { label: 'ISSN', value: 'identifier', identifier: 'bf:Issn' },
      { label: 'LCCN', value: 'identifier', identifier: 'bf:Lccn' },
      { label: 'OCLC', value: 'identifier', identifier: 'nypl:Oclc' },
      { label: 'GPO', value: '' },
      { label: 'Other Titles', value: '' },
      { label: 'Owning Institutions', value: '' },
    ];
    let component;
    const expectSubjectLiterals = [
      { text: 'Editing > History > 18th century',
        linksAffixes: [
          '39916e16-51b2-45d2-83b2-d2d9f2b76da3',
          'c9619cd0-105a-41db-93ae-70bd2fdea6ea',
          '861d31ed-ec55-44d3-ac7e-9b3b77826304',
        ],
      },
      { text: 'Malone, Edmond, > 1741-1812',
        linksAffixes: [
          'c8c76c90-3d01-49b0-90ca-7204c54faedf',
          '1cec52b3-dfe0-44ab-9cfb-4be9d4d0b97e',
        ],
      },
      { text: 'Shakespeare, William, > 1564-1616 > Criticism, Textual',
        linksAffixes: [
          '584104d8-9be1-45ba-bfd7-b59f17d36c88',
          '56567c13-9c92-4379-8f8a-7e6168ef47c1',
          '1913e567-8d33-41d9-9a8b-104008655684',
        ],
      },
      { text: 'Shakespeare, William, > 1564-1616',
        linksAffixes: [
          '584104d8-9be1-45ba-bfd7-b59f17d36c88',
          '56567c13-9c92-4379-8f8a-7e6168ef47c1',
        ],
      },
    ];

    xit('should render proper texts and link(s) for each subject heading', () => {
      component = mount(
        React.createElement(
          BibDetails, { bib: bibs[0], fields }
        )
      );

      // Expect 4 specific subjectLiterals:
      expect(component.find('dd').at(2).find('li')).to.have.lengthOf(4);
      expectSubjectLiterals.forEach((subjectLiteral, ind) => {
        expect(
          component.find('dd').at(2).find('li').at(ind).text(),
        ).to.equal(subjectLiteral.text);
        subjectLiteral.linksAffixes.forEach((affix, index) => {
          expect(
            component.find('dd').at(2).find('li').at(ind).find('Link').at(index).prop('to')
          ).to.equal(
            `/research/collections/shared-collection-catalog/subject_headings/${affix}`
          );
        });
      });
    });
  });

  describe('getDisplayFields', () => {
    it('modifies note fields appropriately', () => {
      const component = mount(
        React.createElement(BibDetails,
          {
            bib: {
              note: [
                { noteType: 'Language', prefLabel: 'In Urdu' },
                { noteType: 'Explanatory Note', prefLabel: 'https://www.youtube.com/watch?v=Eikb2lX5xYE' },
              ],
            },
            fields: [{ label: 'Notes', value: 'React Component' }],
            electronicResources: [],
            additionalData: [],
          },
        ),
      );

      expect(component.find('dt').length).to.equal(2);
      expect(component.find('dt').at(0).text()).to.equal('Language (note)');
      expect(component.find('dt').at(1).text()).to.equal('Explanatory Note');
    });
  });
});
