export default [
  {
    '@id': 'res:i10000003',
    uri: 'i10000003',
    status: [
      {
        '@id': 'status:a',
        prefLabel: 'Available',
      },
    ],
    owner: [
      {
        '@id': 'orgs:1000',
        prefLabel: 'Stephen A. Schwarzman Building',
      },
    ],
    catalogItemType: [
      {
        '@id': 'catalogItemType:55',
        prefLabel: 'book, limited circ, MaRLI',
      },
      {
        '@id': 'catalogItemType:55',
        prefLabel: 'book, limited circ, MaRLI',
      },
    ],
    identifier: [
      'urn:barcode:33433014514719',
      'urn:SierraNypl:10000003',
    ],
    holdingLocation: [
      {
        '@id': 'loc:rcma2',
        prefLabel: 'Offsite',
      },
    ],
    requestable: [
      true,
    ],
    accessMessage: [
      {
        '@id': 'accessMessage:2',
        prefLabel: 'Request in advance',
      },
    ],
    shelfMark: [
      '*OFS 84-1997',
    ],
    idBarcode: [
      '33433014514719',
    ],
    idNyplSourceId: {
      '@type': 'SierraNypl',
      '@value': '10000003',
    },
  },
];
