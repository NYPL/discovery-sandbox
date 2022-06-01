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

  /**
    params:
      apiFilters: an object containing all the aggregations received from the api
      selectedFilters: an object containing the currently selected filters (selected in
         the Refine Search accordion)
    narrowSubjectFilters returns a new object, which is a copy of apiFilters but with only
     the selected subjectFilters from selectedFilters
  */
  narrowSubjectFilters(apiFilters, selectedFilters) {
    const newApiFilters = JSON.parse(JSON.stringify(apiFilters));
    const subjectLiteralFilters = this.getSubjectLiteralFilters(newApiFilters);
    const selectedSubjectLiteralFilters = selectedFilters.subjectLiteral || [];
    if (subjectLiteralFilters) {
      subjectLiteralFilters.values = selectedSubjectLiteralFilters;
    }
    return newApiFilters;
  },
};

export default subjectFilterUtil;
