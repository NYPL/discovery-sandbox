import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';

import { trackDiscovery } from '../../utils/utils.js';

class FilterPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showForm: false };

    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.deactivateForm = this.deactivateForm.bind(this);
  }

  openForm() {
    if (!this.state.showForm) {
      trackDiscovery('FilterPopup', 'Open');
      this.setState({ showForm: true });
    }
  }

  closeForm(e) {
    e.preventDefault();
    this.deactivateForm();
  }

  deactivateForm() {
    trackDiscovery('FilterPopup', 'Close');
    this.setState({ showForm: false });
  }

  render() {
    const showForm = this.state.showForm;

    return (
      <div>
        <div className="filter-popup-btn-container">
          <button
            className="filter-popup-btn"
            onClick={() => this.openForm()}
            aria-haspopup="true"
            aria-expanded={showForm}
            aria-controls="filter-popup-menu"
          >
            FILTER RESULTS
          </button>
        </div>
        <div className="filter-popup-container">
          <FocusTrap
            focusTrapOptions={{
              onDeactivate: this.deactivateForm,
              clickOutsideDeactivates: true,
            }}
            active={showForm}
            id="filter-popup-menu"
            role="menu"
            className={`filter-popup-form-container ${showForm ? 'active' : ''}`}
          >
            <form action="" method="POST" onSubmit={() => this.onSubmitForm()}>
              <fieldset>
                <legend>
                  <h3>Filter Results</h3>
                </legend>
                <button type="button" name="Clear-Filters">Clear Filters</button>
                <button
                  className={`cancel-button ${!showForm ? 'hidden' : ''}`}
                  onClick={(e) => this.closeForm(e)}
                  aria-expanded={!showForm}
                  aria-controls="filter-popup-menu"
                  name="Close-Filters"
                >
                  Close[x]
                </button>
              </fieldset>
              <fieldset>
                <legend>Format</legend>
                <div>
                  <label htmlFor="book-check-filter">
                    <input id="book-check-filter" type="checkbox" name="format" value="Book" />Book
                  </label>
                </div>
                <div>
                  <label htmlFor="still-image-check-filter">
                    <input id="still-image-check-filter" type="checkbox" name="format" value="Still Image" />Still Image
                  </label>
                </div>
                <div>
                  <label htmlFor="audio-check-filter">
                    <input id="audio-check-filter" type="checkbox" name="format" value="Audio" />Audio
                  </label>
                </div>
                <div>
                  <label htmlFor="music-check-filter">
                    <input id="music-check-filter" type="checkbox" name="format" value="Notated Music" />Notated Music
                  </label>
                </div>
                <div>
                  <label htmlFor="mixed-check-filter">
                    <input id="mixed-check-filter" type="checkbox" name="format" value="Mixed Material" />Mixed Material
                  </label>
                </div>
              </fieldset>
              <fieldset>
                <legend>Date</legend>
                <div>
                  <label htmlFor="start-date">Start Year
                    <input id="start-date" name="start" type="date" className="form-text" />
                  </label>
                  <label htmlFor="end-date">End Year
                    <input id="end-date" type="date" name="end" className="form-text" />
                  </label>
                  <span>The Start year cannot be later than the end year</span>
                </div>
              </fieldset>
              <fieldset>
                <legend>Language</legend>
                <div className="nypl-terms-checkbox">
                  <input id="english-language-filter" type="checkbox" name="language" value="English" />
                  <label htmlFor="english-language-filter">English</label>
                </div>
                <div className="nypl-terms-checkbox">
                  <input id="spanish-language-filter" type="checkbox" name="language" value="Spanish" />
                  <label htmlFor="spanish-language-filter">Spanish</label>
                </div>
                <div className="nypl-terms-checkbox">
                  <input id="language-filter-0" type="checkbox" name="language" value="Language" />
                  <label htmlFor="language-filter-0">Language</label>
                </div>
                <div className="nypl-terms-checkbox">
                  <input id="language-filter-1" type="checkbox" name="language" value="Language" />
                  <label htmlFor="language-filter-1">Language</label>
                </div>
                <div className="nypl-terms-checkbox">
                  <input id="language-filter-2" type="checkbox" name="language" value="Language" />
                  <label htmlFor="language-filter-2">Language</label>
                </div>
                <div className="nypl-terms-checkbox">
                  <input id="language-filter-3" type="checkbox" name="language" value="Language" />
                  <label htmlFor="language-filter-3">Language</label>
                </div>
                <div className="nypl-terms-checkbox">
                  <input id="language-filter-4" type="checkbox" name="language" value="Language" />
                  <label htmlFor="language-filter-4">Language</label>
                </div>
                <div className="nypl-terms-checkbox">
                  <input id="language-filter-5" type="checkbox" name="language" value="Language" />
                  <label htmlFor="language-filter-5">Language</label>
                </div>

              </fieldset>
              <button type="submit" name="apply-filters" >Apply Filters</button>
            </form>
          </FocusTrap>
        </div>
      </div>
    );
  }
}

FilterPopup.propTypes = {
  location: PropTypes.object,
};

export default FilterPopup;
