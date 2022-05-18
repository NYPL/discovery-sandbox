const noOnsiteEddCheck =  (appConfigFeatures, urlEnabledFeatures) => {
  return appConfigFeatures.includes('no-onsite-edd') ||
  (urlEnabledFeatures || []).includes('no-onsite-edd')
    ? { headers: { 'X-Features': 'no-onsite-edd' } }
    : {}
}

module.exports = { noOnsiteEddCheck }