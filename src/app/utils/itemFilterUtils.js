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
