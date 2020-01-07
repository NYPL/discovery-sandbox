const defaultState = {
  searchResults: {},
  searchKeywords: '',
  bib: {},
  filters: {},
  selectedFilters: {},
  patronData: [],
  page: '1',
  sortBy: '',
  loading: false,
  field: '',
  form: {},
  deliveryLocations: [],
  isEddRequestable: false,
  updateSubjectHeading: {},
}

function reducer(state = defaultState, action) {
  switch (action.type) {
    case "UPDATE_SUBJECT_HEADING":
      return Object.assign({}, state, action.subjectHeading)
    default:
      return state
  }
}

export default reducer
