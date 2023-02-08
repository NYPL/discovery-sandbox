const getLabelForValue = (map, value) => {
  const labels = Object.keys(map)
  const [theLabel] = labels.filter((label) => map[label].includes(value))
  return theLabel
}

export default getLabelForValue
