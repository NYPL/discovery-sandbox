const breakpoints = {
  xtrasmall: 483,
  tablet: 870,
};

const itemFilters = {
  location: {
    type: 'location',
    extractItemProperty: item => item.holdingLocationCode,
  },
  format: {
    type: 'format',
    extractItemProperty: item => item.materialType['@id'],
  },
  status: {
    type: 'status',
    extractItemProperty: item => item.status['@id'],
  },
};

export {
  breakpoints,
  itemFilters,
};
