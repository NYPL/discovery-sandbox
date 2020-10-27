// breakpoints ordered by `maxValue` ascending 
const breakpoints = [
  {
    maxValue: 490,
    media: 'mobile',
  },
  {
    maxValue: 750,
    media: 'tabletPortrait',
  },
  {
    maxValue: 870,
    media: 'tablet',
  }
];

const itemFilters = [
  {
    type: 'location',
    retrieveOption: item => ({
      label: item.location,
      id: item.holdingLocationCode.startsWith('loc:rc') ? 'offsite' : item.holdingLocationCode,
    }),
  },
  {
    type: 'format',
    retrieveOption: item => ({
      label: item.format || '',
      id: item.format || '',
    }),
  },
  {
    type: 'status',
    retrieveOption: item => ({
      label: item.requestable ? 'Requestable' : item.status.prefLabel,
      id: item.requestable ? 'requestable' : item.status['@id'],
    }),
  },
];

export {
  breakpoints,
  itemFilters,
};
