const breakpoints = {
  xtrasmall: 483,
  tablet: 870,
};

const itemFilters = [
  {
    type: 'location',
    options: item => ({
      label: item.location,
      id: item.holdingLocationCode.startsWith('loc:rc') ? 'offsite' : item.holdingLocationCode,
    }),
    extractItemProperty: item => item.holdingLocationCode,
  },
  {
    type: 'format',
    options: item => ({
      label: item.format || '',
      id: item.format || '',
    }),
    extractItemProperty: item => item.format,
  },
  {
    type: 'status',
    options: item => ({
      label: item.requestable ? 'Requestable' : item.status.prefLabel,
      id: item.requestable ? 'requestable' : item.status['@id'],
    }),
    extractItemProperty: item => item.status.prefLabel,
  },
];

export {
  breakpoints,
  itemFilters,
};
