/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

// Import the component that is going to be tested
import BibDetails from './../../src/app/components/BibPage/BibDetails';
import { getGroupedNotes } from '../../src/app/utils/bibDetailsUtils';
import { RouterProvider } from './../../src/app/context/RouterContext';
import { Provider } from 'react-redux';
import bibs from '../fixtures/bibs';

describe('BibDetails', () => {
  describe('Invalid props', () => {
    it('should return null with no props passed', () => {
      const component = mount(
          <RouterProvider value={{ push: () => {} }}>
              <BibDetails />
          </RouterProvider>,
      );
      expect(component.children().html()).to.equal(null);
    });

    it('should return null with no bib passed', () => {
      const component = mount(
        <RouterProvider value={{ push: () => {} }}>
          <BibDetails bib={null} />
        </RouterProvider>,
      );
      expect(component.children().html()).to.equal(null);
    });

    it('should return null if bib is not an object', () => {
      const stringItem = mount(
        <RouterProvider value={{ push: () => {} }}>
          {React.createElement(BibDetails, {
            bib: 'not an object',
            fields: [],
          })}
        </RouterProvider>,
      );
      const objectItem = mount(
        <RouterProvider value={{ push: () => {} }}>
          {React.createElement(BibDetails, {
            bib: ['not an object'],
            fields: [],
          })}
        </RouterProvider>,
      );

      expect(stringItem.children().html()).to.equal(null);
      expect(objectItem.children().html()).to.equal(null);
    });
  });

  describe('Top fields', () => {
    const fields = [
      { label: 'Title', value: 'titleDisplay' },
      { label: 'Found In', value: 'partOf' },
      { label: 'Author', value: 'creatorLiteral', linkable: true },
      {
        label: 'Additional Authors',
        value: 'contributorLiteral',
        linkable: true,
      },
    ];
    let component;

    before(() => {
      component = mount(
        <RouterProvider value={{ push: () => {} }}>
          {React.createElement(BibDetails, { bib: bibs[0], fields })}
        </RouterProvider>,
      );
    });

    it('should display titles, authors', () => {
      const bibDetailsComponent = component.children();
      expect(bibDetailsComponent.type()).to.equal(BibDetails);

      expect(bibDetailsComponent.find('dd')).to.have.lengthOf(2);
      expect(bibDetailsComponent.find('dt')).to.have.lengthOf(2);
      // Expect first DT to contain titleDisplay:
      expect(bibDetailsComponent.find('dd').at(0).text()).to.equal(
        bibs[0].titleDisplay[0],
      );
      // Expect second DT to contain creatorLiteral:
      expect(bibDetailsComponent.find('dd').at(1).text()).to.equal(
        bibs[0].creatorLiteral[0],
      );
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
      {
        label: 'Additional Resources',
        value: 'supplementaryContent',
        selfLinkable: true,
      },
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
        component = mount(
          <RouterProvider value={{ push: () => {} }}>
            {React.createElement(BibDetails, { bib: spec.bib, fields })}
          </RouterProvider>,
        );
        const bibDetailsComponent = component.children();

        expect(bibDetailsComponent.type()).to.equal(BibDetails);

        expect(bibDetailsComponent.find('dd')).to.have.lengthOf(8);
        console.log(
          'logging dds length',
          bibDetailsComponent.find('dd').length,
        );
        expect(bibDetailsComponent.find('dt')).to.have.lengthOf(8);
        expect(bibDetailsComponent.find('dd').at(0).text()).to.equal(
          bibs[0].publicationStatement[0],
        );
        expect(bibDetailsComponent.find('dd').at(1).text()).to.equal(
          bibs[0].extent[0],
        );
        // Note with noteType=Bibliography:
        expect(bibDetailsComponent.find('dd').at(3).text()).to.equal(
          bibs[0].note[0].prefLabel,
        );
        expect(bibDetailsComponent.find('dd').at(4).text()).to.equal(
          bibs[0].shelfMark[0],
        );
        // Isbn:
        const [isbn, incorrectIsbn] = bibs[0].identifier.filter(
          (ident) => ident['@type'] === 'bf:Isbn',
        );
        expect(
          bibDetailsComponent.find('dd').at(5).find('li').at(0).text(),
        ).to.equal(isbn['@value']);
        // Only check for identityStatus message if serialization supports it (urn: style does not):
        if (typeof bibs[0].identifier[0] === 'string') {
          expect(
            bibDetailsComponent.find('dd').at(5).find('li').at(1).text(),
          ).to.equal(
            `${incorrectIsbn['@value']} (${incorrectIsbn.identifierStatus})`,
          );
        }
        // Lccn:
        const lccn = bibs[0].identifier
          .filter((ident) => ident['@type'] === 'bf:Lccn')
          .pop();
        expect(bibDetailsComponent.find('dd').at(6).text()).to.equal(
          lccn['@value'],
        );
      });
    });
  });

  describe('Description field', () => {
    const fields = [
      { label: 'Summary', value: 'description' }
    ];
    let component;

    it('should display "description" field as Summary', () => {
      component = mount(
        <RouterProvider value={{ push: () => {} }}>
          {React.createElement(BibDetails, { bib: bibs[4], fields })}
        </RouterProvider>,
      );
      const bibDetailsComponent = component.children();
      console.log(bibDetailsComponent.find('dd').length);
      const description = bibs[4].description[0];
      expect(bibDetailsComponent.find('dt').at(0).text()).to.equal(
        "Summary",
      );
      expect(bibDetailsComponent.find('dd').at(0).text()).to.equal(
        description,
      );
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
      {
        label: 'Additional Resources',
        value: 'supplementaryContent',
        selfLinkable: true,
      },
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
      {
        text: 'Editing > History > 18th century',
        linksAffixes: [
          '39916e16-51b2-45d2-83b2-d2d9f2b76da3',
          'c9619cd0-105a-41db-93ae-70bd2fdea6ea',
          '861d31ed-ec55-44d3-ac7e-9b3b77826304',
        ],
      },
      {
        text: 'Malone, Edmond, > 1741-1812',
        linksAffixes: [
          'c8c76c90-3d01-49b0-90ca-7204c54faedf',
          '1cec52b3-dfe0-44ab-9cfb-4be9d4d0b97e',
        ],
      },
      {
        text: 'Shakespeare, William, > 1564-1616 > Criticism, Textual',
        linksAffixes: [
          '584104d8-9be1-45ba-bfd7-b59f17d36c88',
          '56567c13-9c92-4379-8f8a-7e6168ef47c1',
          '1913e567-8d33-41d9-9a8b-104008655684',
        ],
      },
      {
        text: 'Shakespeare, William, > 1564-1616',
        linksAffixes: [
          '584104d8-9be1-45ba-bfd7-b59f17d36c88',
          '56567c13-9c92-4379-8f8a-7e6168ef47c1',
        ],
      },
    ];

    xit('should render proper texts and link(s) for each subject heading', () => {
      component = mount(
        <RouterProvider value={{ push: () => {} }}>
          {React.createElement(BibDetails, { bib: bibs[0], fields })}
        </RouterProvider>,
      );
      const bibDetailsComponent = component.children();

      // Expect 4 specific subjectLiterals:
      expect(bibDetailsComponent.find('dd').at(2).find('li')).to.have.lengthOf(
        4,
      );
      expectSubjectLiterals.forEach((subjectLiteral, ind) => {
        expect(
          bibDetailsComponent.find('dd').at(2).find('li').at(ind).text(),
        ).to.equal(subjectLiteral.text);
        subjectLiteral.linksAffixes.forEach((affix, index) => {
          expect(
            bibDetailsComponent
              .find('dd')
              .at(2)
              .find('li')
              .at(ind)
              .find('Link')
              .at(index)
              .prop('to'),
          ).to.equal(
            `/research/collections/shared-collection-catalog/subject_headings/${affix}`,
          );
        });
      });
    });
  });

  describe('getDisplayFields', () => {
    it('modifies note fields appropriately', () => {
      const bib = {
        note: [
          { noteType: 'Language', prefLabel: 'In Urdu' },
          {
            noteType: 'Explanatory Note',
            prefLabel: 'https://www.youtube.com/watch?v=Eikb2lX5xYE',
          },
        ],
      };
      bib['notesGroupedByNoteType'] = getGroupedNotes(bib);

      const component = mount(
        <RouterProvider value={{ push: () => {} }}>
          {React.createElement(BibDetails, {
            bib,
            fields: [{ label: 'Notes', value: 'React Component' }],
            electronicResources: [],
            additionalData: [],
          })}
        </RouterProvider>,
      );
      const bibDetailsComponent = component.children();

      expect(bibDetailsComponent.find('dt').length).to.equal(2);
      expect(bibDetailsComponent.find('dt').at(0).text()).to.equal(
        'Language (note)',
      );
      expect(bibDetailsComponent.find('dt').at(1).text()).to.equal(
        'Explanatory Note',
      );
    });
  });

  describe('Bib with rtl fields', () => {
    const mockFields = [
      { label: 'Field1', value: 'field1' },
      { label: 'Field2', value: 'field2', linkable: true },
      { label: 'Field3', value: 'field3', selfLinkable: true },
      { label: 'Notes'}
    ];

    it('should handle rtl text in a single self-linkable object value', () => {
      const mockBibRtl = { field3: [{ '@id': 'id', prefLabel: '\u200F\u00E9', url: 'thebomb.com' }] }
      const mockBibLtr = { field3: [{ '@id': 'id', prefLabel: '\u00E9', url: 'thebomb.com' }] }
      const rtlComponent = mount(
        <RouterProvider value={{ push: () => {} }}>
          {
            React.createElement(BibDetails, { bib: mockBibRtl, fields: mockFields, features: ['parallels'] })
          }
        </RouterProvider>,
      );
      const ltrComponent = mount(
        <RouterProvider value={{ push: () => {} }}>
          {
            React.createElement(BibDetails, { bib: mockBibLtr, fields: mockFields, features: ['parallels'] })
          }
        </RouterProvider>,
      )

      expect(rtlComponent.find('a')).to.have.lengthOf(1)
      expect(rtlComponent.find('a').at(0).prop('dir')).to.eql('rtl')

      expect(ltrComponent.find('a')).to.have.lengthOf(1)
      expect(ltrComponent.find('a').at(0).prop('dir')).to.eql(null)
    })

    it('should handle rtl text in a list of self-linkable object values', () => {
      const mockBibRtl = { field3: [{ url: 'thebomb.com', '@id': 'id', prefLabel: '\u200F\u00E9' }, { url: 'thebomb.com', '@id': 'id', prefLabel: '\u200F\u00E9' }] }
      const mockBibLtr = { field3: [{ url: 'thebomb.com', '@id': 'id', prefLabel: '\u00E9\u00E9' }, { url: 'thebomb.com', '@id': 'id', prefLabel: '\u00E9\u00E9' }] }
      const rtlComponent = mount(
        <RouterProvider value={{ push: () => {} }}>
          {
            React.createElement(BibDetails, { bib: mockBibRtl, fields: mockFields, features: ['parallels'] })
          }
        </RouterProvider>,
      );
      const ltrComponent = mount(
        <RouterProvider value={{ push: () => {} }}>
          {
            React.createElement(BibDetails, { bib: mockBibLtr, fields: mockFields, features: ['parallels'] })
          }
        </RouterProvider>,
      )


      expect(rtlComponent.find('li')).to.have.lengthOf(2)
      expect(rtlComponent.find('li').at(0).prop('dir')).to.eql('rtl')
      expect(rtlComponent.find('li').at(1).prop('dir')).to.eql('rtl')

      expect(ltrComponent.find('li')).to.have.lengthOf(2)
      expect(ltrComponent.find('li').at(0).prop('dir')).to.eql(null)
      expect(ltrComponent.find('li').at(1).prop('dir')).to.eql(null)
    })

    it('should handle rtl text in a string value', () => {
      const mockBibRtl = { field1: ['\u200F\u00E9'] }
      const mockBibLtr = { field1: ['\u00E9'] }
      const rtlComponent = mount(
        <RouterProvider value={{ push: () => {} }}>
          {
            React.createElement(BibDetails, { bib: mockBibRtl, fields: mockFields, features: ['parallels'] })
          }
        </RouterProvider>,
      );
      const ltrComponent = mount(
        <RouterProvider value={{ push: () => {} }}>
          {
            React.createElement(BibDetails, { bib: mockBibLtr, fields: mockFields, features: ['parallels'] })
          }
        </RouterProvider>,
      )

      expect(rtlComponent.find('dd')).to.have.lengthOf(1)
      expect(rtlComponent.find('dd').at(0).find('span')).to.have.lengthOf(1)
      expect(rtlComponent.find('dd').at(0).find('span').prop('dir')).to.eql('rtl')

      expect(ltrComponent.find('dd')).to.have.lengthOf(1)
      expect(ltrComponent.find('dd').at(0).find('span')).to.have.lengthOf(1)
      expect(ltrComponent.find('dd').at(0).find('span').prop('dir')).to.not.eql('rtl')
    })

    it('should include rtl class on li elements in list of string values', () => {
      const mockBibRtl = { field1: ['\u200F\u00E9', '\u200F\u00E9', '\u200F\u00E9'] }
      const mockBibLtr = { field1: ['\u00E9', '\u00E9', '\u00E9'] }

      const rtlComponent = mount(
        <RouterProvider value={{ push: () => {} }}>
          {
            React.createElement(BibDetails, { bib: mockBibRtl, fields: mockFields, features: ['parallels'] })
          }
        </RouterProvider>,
      );
      const ltrComponent = mount(
        <RouterProvider value={{ push: () => {} }}>
          {
            React.createElement(BibDetails, { bib: mockBibLtr, fields: mockFields, features: ['parallels'] })
          }
        </RouterProvider>,
      )
      expect(rtlComponent.find('li').at(0).prop('className')).to.eql('rtl')
      expect(ltrComponent.find('li').at(0).prop('className')).to.not.eql('rtl')
    })

    it('should handle rtl text in a linkable string value', () => {
      const mockBibRtl = { field2: ['\u200F\u00E9'] }
      const mockBibLtr = { field2: ['\u00E9'] }
      const rtlComponent = mount(
        <RouterProvider value={{ push: () => {} }}>
          {
            React.createElement(BibDetails, { bib: mockBibRtl, fields: mockFields, features: ['parallels'] })
          }
        </RouterProvider>,
      );
      const ltrComponent = mount(
        <RouterProvider value={{ push: () => {} }}>
          {
            React.createElement(BibDetails, { bib: mockBibLtr, fields: mockFields, features: ['parallels'] })
          }
        </RouterProvider>,
      )

      expect(rtlComponent.find('dd')).to.have.lengthOf(1)
      expect(rtlComponent.find('dd').at(0).find('a')).to.have.lengthOf(1)
      expect(rtlComponent.find('dd').at(0).find('a').prop('dir')).to.eql('rtl')

      expect(ltrComponent.find('dd')).to.have.lengthOf(1)
      expect(ltrComponent.find('dd').at(0).find('a')).to.have.lengthOf(1)
      expect(ltrComponent.find('dd').at(0).find('a').prop('dir')).to.eql(null)
    })

    it('should handle rtl text in parallel notes', () => {
      const mockBibRtl = { notesGroupedByNoteType: { fakeNote: [{ prefLabel: '\u200F\u00E9' }] } }
      const mockBibLtr = { notesGroupedByNoteType: { fakeNote: [{ prefLabel: '\u00E9' }] } }
      const rtlComponent = mount(
        <RouterProvider value={{ push: () => {} }}>
          {
            React.createElement(BibDetails, { bib: mockBibRtl, fields: mockFields, features: ['parallels'] })
          }
        </RouterProvider>,
      );
      const ltrComponent = mount(
        <RouterProvider value={{ push: () => {} }}>
          {
            React.createElement(BibDetails, { bib: mockBibLtr, fields: mockFields, features: ['parallels'] })
          }
        </RouterProvider>,
      )

      expect(rtlComponent.find('li').at(0).prop('className')).to.eql('rtl')
      expect(ltrComponent.find('li').at(0).prop('className')).to.not.eql('rtl')
      expect(rtlComponent.find('li').at(0).prop('dir')).to.eql('rtl')
      expect(ltrComponent.find('li').at(0).prop('dir')).to.not.eql('rtl')
    })
  })
});
