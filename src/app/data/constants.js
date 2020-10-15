const breakpoints = {
  xtrasmall: 483,
  tablet: 870,
};

const itemFilters = [
  {
    type: 'location',
    options: items => items.map(item => ({
      label: item.location,
      id: item.holdingLocationCode.startsWith('loc:rc') ? 'offsite' : item.holdingLocationCode,
    })),
    extractItemProperty: item => item.holdingLocationCode,
  },
  {
    type: 'format',
    options: items => items.map(item => ({
      label: item.format || '',
      id: item.materialType ? item.materialType['@id'] : '',
    })),
    extractItemProperty: item => item.materialType['@id'],
  },
  {
    type: 'status',
    options: items => items.map(item => ({
      label: item.requestable ? 'Requestable' : item.status.prefLabel,
      id: item.requestable ? 'requestable' : item.status['@id'],
    })),
    extractItemProperty: item => item.status['@id'],
  },
];

export {
  breakpoints,
  itemFilters,
};
