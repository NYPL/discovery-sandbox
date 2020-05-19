/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

// Import the component that is going to be tested
import BibDetails from './../../src/app/components/BibPage/BibDetails';
import DefinitionList from './../../src/app/components/BibPage/DefinitionList';

const bibs = [
  {
    '@type': ['nypl:Item', 'nypl:Resource'],
    '@id': 'res:b11417539',
    carrierType: [{ '@id': 'carriertypes:nc', prefLabel: 'volume' }],
    createdString: ['1991'],
    createdYear: 1991,
    creatorLiteral: ['De Grazia, Margreta.'],
    dateStartYear: 1991,
    dateString: ['1991'],
    dimensions: ['23 cm.'],
    extent: ['xi, 244 p., [8] p. of plates : ill. ;'],
    idIsbn: ['0198117787'],
    idLccn: ['90048121'],
    idOclc: ['22452233'],
    identifier: [
      {
        '@type': 'bf:ShelfMark',
        '@value': 'JFD 91-4064',
      },
      {
        '@type': 'nypl:Bnumber',
        '@value': '11417539',
      },
      {
        '@type': 'bf:Isbn',
        '@value': '0198117787',
      },
      {
        '@type': 'bf:Isbn',
        '@value': '012345',
        identifierStatus: 'incorrect',
      },
      {
        '@type': 'bf:Lccn',
        '@value': '90048121',
      },
      {
        '@type': 'nypl:Oclc',
        '@value': '22452233',
      },
    ],
    issuance: [{ '@id': 'urn:biblevel:m', prefLabel: 'monograph/item' }],
    items: [
      {
        '@id': 'res:i13183119',
        accessMessage: [
          {
            '@id': 'accessMessage:1',
            prefLabel: 'USE IN LIBRARY',
          },
        ],
        catalogItemType: [
          {
            '@id': 'catalogItemType:55',
            prefLabel: 'book, limited circ, MaRLI',
          },
        ],
        holdingLocation: [
          {
            '@id': 'loc:mal92',
            prefLabel: 'Schwarzman Building M2 - General Research Room 315',
          },
        ],
        idBarcode: [
          '33433040712188',
        ],
        identifier: [
          {
            '@type': 'bf:ShelfMark',
            '@value': 'JFD 91-4064',
          },
          {
            '@type': 'bf:Barcode',
            '@value': '33433040712188',
          },
        ],
        requestable: [
          false,
        ],
        shelfMark: [
          'JFD 91-4064',
        ],
        status: [
          {
            '@id': 'status:a',
            prefLabel: 'Available ',
          },
        ],
        uri: 'i13183119',
        idNyplSourceId: {
          '@type': 'SierraNypl',
          '@value': '13183119',
        },
      },
    ],
    language: [{ '@id': 'lang:eng', prefLabel: 'English' }],
    lccClassification: ['PR3071 .D4 1991'],
    materialType: [{ '@id': 'resourcetypes:txt', prefLabel: 'Text' }],
    mediaType: [{ '@id': 'mediatypes:n', prefLabel: 'unmediated' }],
    note: [
      {
        noteType: 'Bibliography',
        prefLabel: 'Includes bibliographical references (p. [227]-238) and index.',
        '@type': 'bf:Note',
      },
    ],
    numAvailable: 1,
    numItems: 1,
    placeOfPublication: ['Oxford [England] : New York :'],
    publicationStatement: ['Oxford [England] : Clarendon Press ; New York : Oxford University Press, 1991.'],
    publisherLiteral: ['Clarendon Press ; Oxford University Press,'],
    shelfMark: ['JFD 91-4064'],
    subjectHeadingData:[
      {
        "label": "Shakespeare, William, -- 1564-1616",
        "uuid": "56567c13-9c92-4379-8f8a-7e6168ef47c1",
        "bib_count": 19632,
        "desc_count": 2024,
        "parent": {
          "label": "Shakespeare, William,",
          "uuid": "584104d8-9be1-45ba-bfd7-b59f17d36c88",
          "bib_count": 19642,
          "desc_count": 2042
        }
      },
      {
        "label": "Malone, Edmond, -- 1741-1812",
        "uuid": "1cec52b3-dfe0-44ab-9cfb-4be9d4d0b97e",
        "bib_count": 26,
        "desc_count": 7,
        "parent": {
          "label": "Malone, Edmond,",
          "uuid": "c8c76c90-3d01-49b0-90ca-7204c54faedf",
          "bib_count": 26,
          "desc_count": 8
        }
      },
      {
        "label": "Shakespeare, William, -- 1564-1616 -- Criticism, Textual",
        "uuid": "1913e567-8d33-41d9-9a8b-104008655684",
        "bib_count": 502,
        "desc_count": 4,
        "parent": {
          "label": "Shakespeare, William, -- 1564-1616",
          "uuid": "56567c13-9c92-4379-8f8a-7e6168ef47c1",
          "bib_count": 19632,
          "desc_count": 2024,
          "parent": {
            "label": "Shakespeare, William,",
            "uuid": "584104d8-9be1-45ba-bfd7-b59f17d36c88",
            "bib_count": 19642,
            "desc_count": 2042
          }
        }
      },
      {
        "label": "Editing -- History -- 18th century",
        "uuid": "861d31ed-ec55-44d3-ac7e-9b3b77826304",
        "bib_count": 13,
        "desc_count": 1,
        "parent": {
          "label": "Editing -- History",
          "uuid": "c9619cd0-105a-41db-93ae-70bd2fdea6ea",
          "bib_count": 49,
          "desc_count": 12,
          "parent": {
            "label": "Editing",
            "uuid": "39916e16-51b2-45d2-83b2-d2d9f2b76da3",
            "bib_count": 702,
            "desc_count": 69
          }
        }
      }
    ],
    title: ['Shakespeare verbatim : the reproduction of authenticity and the 1790 apparatus'],
    titleDisplay: ['Shakespeare verbatim : the reproduction of authenticity and the 1790 apparatus / Margreta de Grazia.'],
    type: ['nypl:Item'],
    updatedAt: 1524665261653,
    uri: 'b11417539',
    suppressed: false,
  },
  {
    '@type': ['nypl:Item', 'nypl:Resource'],
    '@id': 'res:b11417539',
    carrierType: [{ '@id': 'carriertypes:nc', prefLabel: 'volume' }],
    createdString: ['1991'],
    createdYear: 1991,
    creatorLiteral: ['De Grazia, Margreta.'],
    dateStartYear: 1991,
    dateString: ['1991'],
    dimensions: ['23 cm.'],
    extent: ['xi, 244 p., [8] p. of plates : ill. ;'],
    idIsbn: ['0198117787'],
    idLccn: ['90048121'],
    idOclc: ['22452233'],
    identifier: [
      'urn:callnumber:JFD 91-4064',
      'urn:bnum:11417539',
      'urn:isbn:0198117787',
      'urn:isbn:012345',
      'urn:lccn:90048121',
      'urn:oclc:22452233',
    ],
    issuance: [{ '@id': 'urn:biblevel:m', prefLabel: 'monograph/item' }],
    items: [
      {
        '@id': 'res:i13183119',
        accessMessage: [
          {
            '@id': 'accessMessage:1',
            prefLabel: 'USE IN LIBRARY',
          },
        ],
        catalogItemType: [
          {
            '@id': 'catalogItemType:55',
            prefLabel: 'book, limited circ, MaRLI',
          },
        ],
        holdingLocation: [
          {
            '@id': 'loc:mal92',
            prefLabel: 'Schwarzman Building M2 - General Research Room 315',
          },
        ],
        idBarcode: [
          '33433040712188',
        ],
        identifier: [
          'urn:callnumber:JFD 91-4064',
          'urn:barcode:33433040712188',
        ],
        requestable: [
          false,
        ],
        shelfMark: [
          'JFD 91-4064',
        ],
        status: [
          {
            '@id': 'status:a',
            prefLabel: 'Available ',
          },
        ],
        uri: 'i13183119',
        idNyplSourceId: {
          '@type': 'SierraNypl',
          '@value': '13183119',
        },
      },
    ],
    language: [{ '@id': 'lang:eng', prefLabel: 'English' }],
    lccClassification: ['PR3071 .D4 1991'],
    materialType: [{ '@id': 'resourcetypes:txt', prefLabel: 'Text' }],
    mediaType: [{ '@id': 'mediatypes:n', prefLabel: 'unmediated' }],
    note: [
      {
        noteType: 'Bibliography',
        prefLabel: 'Includes bibliographical references (p. [227]-238) and index.',
        '@type': 'bf:Note',
      },
    ],
    numAvailable: 1,
    numItems: 1,
    placeOfPublication: ['Oxford [England] : New York :'],
    publicationStatement: ['Oxford [England] : Clarendon Press ; New York : Oxford University Press, 1991.'],
    publisherLiteral: ['Clarendon Press ; Oxford University Press,'],
    shelfMark: ['JFD 91-4064'],
    subjectLiteral:
     ['Editing -- History -- 18th century.',
       'Malone, Edmond, 1741-1812.',
       'Shakespeare, William, 1564-1616 -- Criticism, Textual.',
       'Shakespeare, William, 1564-1616.'],
    title: ['Shakespeare verbatim : the reproduction of authenticity and the 1790 apparatus'],
    titleDisplay: ['Shakespeare verbatim : the reproduction of authenticity and the 1790 apparatus / Margreta de Grazia.'],
    type: ['nypl:Item'],
    updatedAt: 1524665261653,
    uri: 'b11417539',
    suppressed: false,
  },
];

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
});
