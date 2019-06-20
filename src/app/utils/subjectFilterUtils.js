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

  explodeSubjectFilters(selectedSubjectLiteralFilters) {
    selectedSubjectLiteralFilters
      .values
      .forEach((valueObject) => {
        let explodedValues = valueObject
          .value
          .replace(/\.$/, '')
          .split(/--/g);
        explodedValues = explodedValues.map((_, i) => explodedValues.slice(0, i + 1).join('--').trim());
        explodedValues.forEach((explodedValue) => {
          selectedSubjectLiteralFilters.values.push({
            value: explodedValue,
            label: explodedValue,
            count: valueObject.count, // this seems like it could cause problems when there is more than one subject
          });
        });
      });
  },

  narrowSubjectFilters(apiFilters, selectedFilters) {
    const newApiFilters = JSON.parse(JSON.stringify(apiFilters));
    const subjectLiteralFilters = this.getSubjectLiteralFilters(newApiFilters);
    if (subjectLiteralFilters) {
      this.explodeSubjectFilters(subjectLiteralFilters);
    }
    const selectedSubjectLiteralFilters = selectedFilters.subjectLiteral || [];
    const checkIsSelected = this.subjectFilterIsSelected(selectedSubjectLiteralFilters);
    if (subjectLiteralFilters) {
      subjectLiteralFilters.values = subjectLiteralFilters
        .values
        .filter(checkIsSelected);
    }
    return newApiFilters;
  },
};

export default subjectFilterUtil;
