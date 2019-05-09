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

  narrowSubjectFilters(apiFilters, selectedFilters) {
    const subjectLiteralFilters = this.getSubjectLiteralFilters(apiFilters);
    const selectedSubjectLiteralFilters = selectedFilters.subjectLiteral || [];
    const checkIsSelected = this.subjectFilterIsSelected(selectedSubjectLiteralFilters);
    if (subjectLiteralFilters) {
      subjectLiteralFilters.values = subjectLiteralFilters
        .values
        .filter(checkIsSelected);
    }
  },
};

export default subjectFilterUtil;
