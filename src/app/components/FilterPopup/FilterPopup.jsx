import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import {
  findWhere as _findWhere,
  extend as _extend,
} from 'underscore';
import { trackDiscovery } from '../../utils/utils.js';
import FieldsetDate from '../Filters/FieldsetDate';
import FieldsetList from '../Filters/FieldsetList';
import Store from '../../stores/Store.js';

class FilterPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = _extend({
      showForm: false,
      js: false,
    }, { selectedFacets: Store.getState().selectedFacets });

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
          <path d="M17.91272,15.97339l5.65689-5.65689A1.32622,1.32622,0,0,0,21.694,8.44093L16.04938,14.0856l-5.65082-5.725A1.32671,1.32671,0,1,0,8.51,10.22454l5.66329,5.73712L8.43038,21.7046a1.32622,1.32622,0,1,0,1.87557,1.87557l5.73088-5.73088,5.65074,5.72441a1.32626,1.32626,0,1,0,1.88852-1.86261Z" />
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
          <path d="M17.91272,15.97339l5.65689-5.65689A1.32622,1.32622,0,0,0,21.694,8.44093L16.04938,14.0856l-5.65082-5.725A1.32671,1.32671,0,1,0,8.51,10.22454l5.66329,5.73712L8.43038,21.7046a1.32622,1.32622,0,1,0,1.87557,1.87557l5.73088-5.73088,5.65074,5.72441a1.32626,1.32626,0,1,0,1.88852-1.86261Z" />
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
    const filters = this.props.filters;
    const materialTypeFilters = _findWhere(filters, { id: 'materialType' });
    const languageFilters = _findWhere(filters, { id: 'language' });

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
                <legend><h3>Filter Results</h3></legend>

                <FieldsetList legend="Format" filter={materialTypeFilters} />

                <FieldsetDate selectedFacets={this.state.selectedFacets} />

                <FieldsetList legend="Language" filter={languageFilters} />

                <button type="submit" name="apply-filters" >Apply Filters</button>
                <button type="button" name="Clear-Filters">Clear Filters</button>
                {closePopupButton}

              </fieldset>
            </form>
          </FocusTrap>
        </div>
      </div>
    );
  }
}

FilterPopup.propTypes = {
  location: PropTypes.object,
  filters: PropTypes.array,
};

FilterPopup.defaultProps = {
  filters: [],
};

export default FilterPopup;
