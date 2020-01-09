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
  subjectHeading: {},
  subjectHeadings: [],
}

function reducer(state = defaultState, action) {
  switch (action.type) {
    case "UPDATE_SUBJECT_HEADINGS":
      return Object.assign({}, state, {subjectHeadings: action.subjectHeadings})
    default:
      return state
  }
}

export default reducer
