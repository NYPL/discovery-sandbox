const subjectFilterUtil = {
  getSubjectLiteralFilters(apiFilters) {
    const apiSubjectLiteralFilters = apiFilters.filter(
      apiFilter => apiFilter.field === 'subjectLiteral',
    );
    return apiSubjectLiteralFilters.length ? apiSubjectLiteralFilters[0] : null;
  },

  subjectFilterIsSelected(selectedSubjectLiteralFilters) {
    return subjectLiteralFilter =>
      selectedSubjectLiteralFilters.some(
        selectedFilter => subjectLiteralFilter.value === selectedFilter.value,
      );
  },

  explodeSubjectFilter(subjectFilterObject) {
    const explodedValues = subjectFilterObject
      .value
      .replace(/\.$/, '')
      .split(/--/g);
    return explodedValues.map((_, i) => explodedValues.slice(0, i + 1).join('--').trim());
  },

  /**
    params: selectedSubjectLiteralFilters is an object with a 'values' property, which
    points to an array of filters represented by objects of the form:
    {
      value,
      label,
      count
    }
    e.g. the value could be 'Dogs -- Card Games -- Painting.'

    explodedSubjectFilters modifies the array by adding

    {
      value: X,
      label: X,
      count: Y
    }

    whenever

    {
      value: X -- Z,
      label: X -- Z,
      count: Y
    }

    is in the original array.
  */

  explodeSubjectFilters(selectedSubjectLiteralFilters) {
    console.log('triggerring')
    let explodedSubjectFilters = selectedSubjectLiteralFilters
      .values
      .reduce((acc, subjectFilterObject) => {
        this.explodeSubjectFilter(subjectFilterObject)
          .forEach((explodedSubjectFilter) => {
            acc.add(explodedSubjectFilter);
          });
        return acc;
      }, new Set());
    explodedSubjectFilters = Array.from(explodedSubjectFilters)
      .map(explodedSubjectFilter => (
        {
          value: explodedSubjectFilter,
          label: explodedSubjectFilter,
        }
      ),
      );
    selectedSubjectLiteralFilters.values = explodedSubjectFilters;
  },

  /**
    params:
      apiFilters: an object containing all the aggregations received from the api
      selectedFilters: an object containing the currently selected filters (selected in
         the Refine Search accordion)
    narrowSubjectFilters returns a new object, which is a copy of apiFilters but with only
     the selected subjectLiteralFilters
  */

  narrowSubjectFilters(apiFilters, selectedFilters) {
    console.log('apiFilters: ', JSON.stringify(apiFilters, null, 4), '\n selectedFilters: ', JSON.stringify(selectedFilters, null, 4))
    // deep copy the apiFilters object
    const newApiFilters = JSON.parse(JSON.stringify(apiFilters));
    // grab the aggregated subject literal filters
    const subjectLiteralFilters = this.getSubjectLiteralFilters(newApiFilters);
    // add the exploded subject literals if there are any
    if (subjectLiteralFilters) {
      this.explodeSubjectFilters(subjectLiteralFilters);
    }
    // get the selected subject literals
    const selectedSubjectLiteralFilters = selectedFilters.subjectLiteral || [];
    // build a function which filters subject filters down to those in selectedSubjectLiteralFilters
    const checkIsSelected = this.subjectFilterIsSelected(selectedSubjectLiteralFilters);
    // remove all the unselected filters from subject literal filters
    if (subjectLiteralFilters) {
      subjectLiteralFilters.values = subjectLiteralFilters
        .values
        .filter(checkIsSelected);
    }
    return newApiFilters;
  },
};

export default subjectFilterUtil;
