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

  stripPeriodsFromSubject(apiFilters) {
    const subjectLiterals = apiFilters.filter(aggregation => aggregation.id === 'subjectLiteral')[0];
    if (subjectLiterals) {
      subjectLiterals.values.forEach((subjectLiteralValue) => {
        let value = subjectLiteralValue.value;
        if (value.slice(-1) === '.') {
          value = value.slice(0, -1);
        }
        subjectLiteralValue.value = value;
      });
    }
  },

  narrowSubjectFilters(apiFilters, selectedFilters) {
    subjectFilterUtil.stripPeriodsFromSubject(apiFilters);
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
