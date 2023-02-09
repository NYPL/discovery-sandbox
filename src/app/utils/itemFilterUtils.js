// given a map of filter fields and valid options, an array of filter option values (['loc:mal82,loc:rc2ma']), and the field they 
// belongs to, returns an array of the labels they correspond to
export const getLabelsForValues = (values, field, map) => {
  return values.map((val) => getLabelForValue(val, field, map)).filter(l => l)
}
// given one value and the field it belongs to, returns the label it 
// corresponds to
export const getLabelForValue = (value, field, map) => {
  const labels = Object.keys(map[field])
  return labels.find((label) => map[field][label].includes(value))
}

export const buildReducedItemsAggregations = (aggs) => {
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
