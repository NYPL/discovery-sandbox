import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';

import { trackDiscovery } from '../../utils/utils.js';

class FilterPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showForm: false,
      js: false,
    };

    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.deactivateForm = this.deactivateForm.bind(this);
  }

  componentDidMount() {
    this.setState({
      js: true,
    });
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

    this.refs.filterOpen.focus();
  }

  render() {
    const {
      showForm,
      js,
    } = this.state;
    const closePopupButton = js ?
      <button
        onClick={(e) => this.closeForm(e)}
        aria-expanded={!showForm}
        aria-controls="filter-popup-menu"
        className="popup-btn-close"
      >
        Close
        <svg width="48" height="19" viewBox="0 0 32 32" className="svgIcon">
          <title>x.close.icon</title>
          <path d="M17.91272,15.97339l5.65689-5.65689A1.32622,1.32622,0,0,0,21.694,8.44093L16.04938,14.0856l-5.65082-5.725A1.32671,1.32671,0,1,0,8.51,10.22454l5.66329,5.73712L8.43038,21.7046a1.32622,1.32622,0,1,0,1.87557,1.87557l5.73088-5.73088,5.65074,5.72441a1.32626,1.32626,0,1,0,1.88852-1.86261Z"/>
        </svg>
      </button>
      : (<a
        aria-expanded
        href="#"
        aria-controls="filter-popup-menu"
        className="popup-btn-close"
      >Close
        <svg width="48" height="19" viewBox="0 0 32 32" className="svgIcon">
          <title>x.close.icon</title>
          <path d="M17.91272,15.97339l5.65689-5.65689A1.32622,1.32622,0,0,0,21.694,8.44093L16.04938,14.0856l-5.65082-5.725A1.32671,1.32671,0,1,0,8.51,10.22454l5.66329,5.73712L8.43038,21.7046a1.32622,1.32622,0,1,0,1.87557,1.87557l5.73088-5.73088,5.65074,5.72441a1.32626,1.32626,0,1,0,1.88852-1.86261Z"/>
        </svg>
      </a>);
    const openPopupButton = js ?
      (<button
        className="popup-btn-open"
        onClick={() => this.openForm()}
        aria-haspopup="true"
        aria-expanded={showForm}
        aria-controls="filter-popup-menu"
        ref="filterOpen"
      >
        FILTER RESULTS
      </button>)
      : (<a
        className="popup-btn-open"
        href="#popup-no-js"
        aria-haspopup="true"
        aria-expanded={false}
        aria-controls="filter-popup-menu"
        ref="filterOpen"
      >
        FILTER RESULTS
      </a>);

    return (
      <div className="filter-container">
        {openPopupButton}

        <div className={`popup-container ${showForm ? 'active' : ''}`} id={js ? '' : 'popup-no-js'}>
          {!js && (<a className="cancel-no-js" href="#"></a>)}
          <div className="overlay"></div>
          <FocusTrap
            focusTrapOptions={{
              onDeactivate: this.deactivateForm,
              clickOutsideDeactivates: true,
            }}
            active={showForm}
            id="filter-popup-menu"
            role="menu"
            className={`${js ? 'popup' : 'popup-no-js'} ${showForm ? 'active' : ''}`}
          >
            <form action="" method="POST" onSubmit={() => this.onSubmitForm()}>
              <fieldset>
                <legend>
                  <h3>Filter Results</h3>
                </legend>
                <button type="button" name="Clear-Filters">Clear Filters</button>

                {closePopupButton}

                <fieldset>
                  <legend>Format</legend>
                  <div className="new-checkbox">
                    <input id="book-check-filter" className="switch-input" type="checkbox" name="format" value="Book" />
                    <label htmlFor="book-check-filter">Book</label>
                  </div>
                  <div className="new-checkbox">
                    <input id="still-image-check-filter" type="checkbox" name="format" value="Still Image" />
                    <label htmlFor="still-image-check-filter">Still Image</label>
                  </div>
                  <div className="new-checkbox">
                    <input id="audio-check-filter" type="checkbox" name="format" value="Audio" />
                    <label htmlFor="audio-check-filter">
                      Audio
                    </label>
                  </div>
                  <div className="new-checkbox">
                    <input id="music-check-filter" type="checkbox" name="format" value="Notated Music" />
                    <label htmlFor="music-check-filter">Notated Music</label>
                  </div>
                  <div className="new-checkbox">
                    <input id="mixed-check-filter" type="checkbox" name="format" value="Mixed Material" />
                    <label htmlFor="mixed-check-filter">Mixed Material</label>
                  </div>
                </fieldset>
                <fieldset>
                  <legend>Date</legend>
                  <div>
                    <label htmlFor="start-date">Start Year
                      <input id="start-date" name="start" className="form-text" type="number" min="1895" max="9999" step="1" />
                    </label>
                    <label htmlFor="end-date">End Year
                      <input id="end-date" type="date" className="form-text" type="number" min="1895" max="9999" step="1" />
                    </label>
                    <span>The Start year cannot be later than the end year</span>
                  </div>
                </fieldset>
                <fieldset>
                  <legend>Language</legend>
                  <div className="nypl-terms-checkbox new-checkbox">
                    <input id="english-language-filter" type="checkbox" name="language" value="English" />
                    <label htmlFor="english-language-filter">English</label>
                  </div>
                  <div className="nypl-terms-checkbox new-checkbox">
                    <input id="spanish-language-filter" type="checkbox" name="language" value="Spanish" />
                    <label htmlFor="spanish-language-filter">Spanish</label>
                  </div>
                  <div className="nypl-terms-checkbox new-checkbox">
                    <input id="language-filter-0" type="checkbox" name="language" value="Language" />
                    <label htmlFor="language-filter-0">Language</label>
                  </div>
                  <div className="nypl-terms-checkbox new-checkbox">
                    <input id="language-filter-1" type="checkbox" name="language" value="Language" />
                    <label htmlFor="language-filter-1">Language</label>
                  </div>
                  <div className="nypl-terms-checkbox new-checkbox">
                    <input id="language-filter-2" type="checkbox" name="language" value="Language" />
                    <label htmlFor="language-filter-2">Language</label>
                  </div>
                  <div className="nypl-terms-checkbox new-checkbox">
                    <input id="language-filter-3" type="checkbox" name="language" value="Language" />
                    <label htmlFor="language-filter-3">Language</label>
                  </div>
                  <div className="nypl-terms-checkbox new-checkbox">
                    <input id="language-filter-4" type="checkbox" name="language" value="Language" />
                    <label htmlFor="language-filter-4">Language</label>
                  </div>
                  <div className="nypl-terms-checkbox new-checkbox">
                    <input id="language-filter-5" type="checkbox" name="language" value="Language" />
                    <label htmlFor="language-filter-5">Language</label>
                  </div>

                </fieldset>
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
