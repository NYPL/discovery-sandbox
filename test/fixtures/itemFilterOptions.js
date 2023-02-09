const locationFilters = [
  { id: 'loc:maj03', label: 'SASB M1 - General Research - Room 315' },
  { id: '', label: '' },
  { id: 'offsite', label: 'Offsite' },
  { id: 'offsite', label: 'Offsite' },
  { id: 'loc:maj03', label: 'SASB M1 - General Research - Room 315' },
];

const formatFilters = [
  { id: 'resourcetypes:txt', label: 'Text' },
  { id: '', label: '' },
];

const statusFilters = [
  { id: 'status:a', label: 'Available' },
  { id: 'status:a', label: '' },
  { id: 'requestable', label: 'Requestable' },
  { id: 'requestable', label: 'Requestable' },
  { id: 'requestable', label: 'Requestable' },
];

const fieldToOptionMap = { location: locationFilters, format: formatFilters, status: statusFilters }

const itemsAggregations = [
  {
    '@id': 'res:location',
    '@type': "nypl:Aggregation",
    field: 'location',
    id:  'location',
    values: [
      {
        count: 4,
        value: 'loc:maj03',
        label: 'SASB M1 - General Research - Room 315'
      },
      {
        count: 12,
        label: 'Offsite',
        value: 'loc:rc2ma'
      },
      {
        count: 2,
        value: 'offsite',
        label: 'Offsite'
      }
    ]
  },
  {
    '@id': 'res:format',
    '@type': "nypl:Aggregation",
    field: 'format',
    id:  'format',
    values: [
      {
        count: 12,
        label: 'Text',
        value: 'Text'
      }
    ]
  },
  {
    '@id': 'res:status',
    '@type': "nypl:Aggregation",
    field: 'status',
    id:  'status',
    values: [
      {
        count: 12,
        label: 'Available',
        value: 'status:a'
      },
      {
        count: 12,
        label: 'Not Available (ReCAP',
        value: 'status:na'
      }
    ]
  },
];

const itemsAggregations2 = [
  {
    '@id': 'res:location',
    '@type': "nypl:Aggregation",
    field: 'location',
    id:  'location',
    values: [
      {
        count: 4,
        value: 'loc:maj03',
        label: 'SASB M1 - General Research - Room 315'
      },
      {
        count: 12,
        label: 'Offsite',
        value: 'loc:rc2ma'
      },
      {
        count: 12,
        label: 'Off site',
        value: 'loc:rc2ma'
      },
      {
        count: 12,
        label: 'Off-site',
        value: 'loc:rc2ma'
      },
      {
        count: 12,
        label: 'off-site',
        value: 'loc:rc2ma'
      },
      {
        count: 12,
        label: 'off site',
        value: 'loc:rc2ma'
      },
      {
        count: 2,
        value: 'offsite',
        label: 'Offsite'
      },
      {
        count: 2,
        value: 'blank',
        label: ''
      },
      {
        count: 2,
        value: 'blaaaank'
      }
    ]
  },
  {
    '@id': 'res:format',
    '@type': "nypl:Aggregation",
    field: 'format',
    id:  'format',
    values: [
      {
        count: 12,
        label: 'Text',
        value: 'Text'
      }
    ]
  },
  {
    '@id': 'res:status',
    '@type': "nypl:Aggregation",
    field: 'status',
    id:  'status',
    values: [
      {
        count: 12,
        label: 'Available',
        value: 'status:a'
      },
      {
        count: 12,
        label: 'Not Available (ReCAP',
        value: 'status:na'
      }
    ]
  },
];

export {
  locationFilters,
  formatFilters,
  statusFilters,
  itemsAggregations,
  itemsAggregations2
};
