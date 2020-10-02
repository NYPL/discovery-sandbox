const breakpoints = {
  xtrasmall: 483,
  tablet: 870,
};

const itemFilters = {
  location: {
    label: 'Location',
    extractItemValue: item => item.holdingLocationCode,
  },
  format: {
    label: 'Format',
    extractItemValue: item => item.materialType['@id'],
  },
  status: {
    label: 'Status',
    extractItemValue: item => item.status['@id'],
  },
};

export {
  breakpoints,
  itemFilters,
};
