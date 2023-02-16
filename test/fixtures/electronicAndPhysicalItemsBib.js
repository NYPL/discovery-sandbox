const sampleBib = {
  '@id': 'res:b15523285',
  numItems: 3,
  numItemsTotal: 1,
  numElectronicResources: 2,
  items: [
    {
      "@id": "res:i11829350",
      "accessMessage": [
        {
          "@id": "accessMessage:1",
          "prefLabel": "Use in library"
        }
      ],
      "catalogItemType": [
        {
          "@id": "catalogItemType:32",
          "prefLabel": "google project, book"
        }
      ],
      "eddRequestable": true,
      "holdingLocation": [
        {
          "@id": "loc:mal82",
          "prefLabel": "Schwarzman Building - Main Reading Room 315"
        }
      ],
      "idBarcode": [
        "33433031805108"
      ],
      "identifier": [
        {
          "@type": "bf:ShelfMark",
          "@value": "JFF 02-5240"
        },
        {
          "@type": "bf:Barcode",
          "@value": "33433031805108"
        }
      ],
      "owner": [
        {
          "@id": "orgs:1101",
          "prefLabel": "General Research Division"
        }
      ],
      "physRequestable": false,
      "physicalLocation": [
        "JFF 02-5240"
      ],
      "requestable": [
        true
      ],
      "shelfMark": [
        "JFF 02-5240"
      ],
      "specRequestable": false,
      "status": [
        {
          "@id": "status:a",
          "prefLabel": "Available"
        }
      ],
      "uri": "i11829350",
      "idNyplSourceId": {
        "@type": "SierraNypl",
        "@value": "11829350"
      }
    },
    {
      "@id": "res:i15523285-e",
      "electronicLocator": [
        {
          "@type": "nypl:ElectronicLocation",
          "label": "Full text available via HathiTrust",
          "url": "http://hdl.handle.net/2027/nyp.33433031805108"
        }
      ],
      "identifier": [
        "urn:SierraNypl:15523285-e"
      ],
      "uri": "i15523285-e",
      "idNyplSourceId": {
        "@type": "SierraNypl",
        "@value": "15523285-e"
      }
    },
    {
      "@id": "res:i987654321-e",
      "electronicLocator": [
        {
          "@type": "nypl:ElectronicLocation",
          "label": "Aeon available via HathiTrust",
          "url": "https://nypl-aeon-test.aeon.atlas-sys.com.33433031805108"
        }
      ],
      aeonUrl: "https://nypl-aeon-test.aeon.atlas-sys.com.33433031805108",
      "identifier": [
        "urn:SierraNypl:987654321-e"
      ],
      "uri": "i987654321-e",
      "idNyplSourceId": {
        "@type": "SierraNypl",
        "@value": "987654321-e"
      }
    }
  ]
}

export default sampleBib;
