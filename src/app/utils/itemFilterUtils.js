// given a map of filter fields and valid options, an array of filter option values (['loc:mal82,loc:rc2ma']), and the field they 
// belongs to, returns an array of the labels they correspond to
export const getLabelsForValues = (values = [], field = 'default', map = { field }) => {
  return values.map((val) => getLabelForValue(val, field, map)).filter(l => l)
}
// given one value and the field it belongs to, returns the label it 
// corresponds to
export const getLabelForValue = (value, field, map) => {
  const labels = Object.keys(map[field])
  return labels.find((label) => map[field][label].includes(value))
}

export const buildReducedItemsAggregations = (aggs = []) => {
  return JSON.parse(JSON.stringify(aggs)).map((agg) => {
    const fieldAggregation = agg.values
    const reducedValues = {}
    fieldAggregation.filter(aggregation => aggregation.label?.length)
      .forEach((aggregation) => {
        let label = aggregation.label
        if (label.toLowerCase().replace(/[^\w]/g, '') === 'offsite') { label = "Offsite" }
        if (!reducedValues[label]) {
          reducedValues[label] = new Set()
        }
        reducedValues[label].add(aggregation.value)
      })
    agg.options = Object.keys(reducedValues)
      .map(label => ({ value: Array.from(reducedValues[label]).join(","), label: label }))
    return agg
  });
}

// For every item aggregation, go through every filter in its `values` array
// and map all the labels to their ids. This is done because the API expects
// the ids of the filters to be sent over, not the labels.
export const buildFieldToOptionsMap = (reducedItemsAggregations) => reducedItemsAggregations.reduce((accc, aggregation) => {
  const filter = aggregation.field;
  const mappedValues = aggregation.options.reduce((acc, option) => {
    // account for multiple values for offsite label
    let value = option.value
    if (acc[option.label]) value = acc[option.label] + ',' + option.value
    return {
    ...acc,
      [option.label]: value
    }
  }, {})
  return {
    ...accc,
    [filter]: mappedValues,
  };
}, {});

/**
  This is used for the item filter options to make sure an option is checked.
  @param {array | string} filterValue
  @param {string} itemValue
  @return {boolean}
*/
export const isOptionSelected = (filterValue, itemValue) => {
  const itemValues = Array.isArray(itemValue) ? itemValue : [itemValue];
  let filterValues = Array.isArray(filterValue) ? filterValue : [filterValue];
  return filterValues.some((filter) => itemValues.includes(filter));
};

// there are multiple location codes for the single label offsite, 
//   to keep count and maintain state for the Offsite location filter,
//   1. concat those location codes
//   2. remove them from the array
//   3. add the concatenated location codes back
export const initialLocations = (locations) => {
  // all ReCAP/Offsite materials have location codes beginning loc:rc
  const concatenatedRecapLocations = locations.filter((loc) => loc.startsWith('loc:rc')).join(',')
  const removeRecap = locations.filter((loc) => !concatenatedRecapLocations.includes(loc))
  return [...removeRecap, concatenatedRecapLocations.length ? concatenatedRecapLocations : null]
}
