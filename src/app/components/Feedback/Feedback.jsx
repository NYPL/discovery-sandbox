import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';

import { trackDiscovery } from '../../utils/utils';

class Feedback extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showForm: false };

    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.deactivateForm = this.deactivateForm.bind(this);
  }

  onSubmitForm() {
    if (!this.refs.commentText.value) {
      this.refs.commentText.focus();
    } else {
      this.setState({ showForm: false });
      trackDiscovery('Feedback', 'Submit');
      alert('Thank you, your feedback has been submitted.');
    }
  }

  openForm() {
    trackDiscovery('Feedback', 'Open');
    this.setState({ showForm: true });
  }

  closeForm(e) {
    e.preventDefault();
    this.deactivateForm();
  }

  deactivateForm() {
    trackDiscovery('Feedback', 'Close');
    this.setState({ showForm: false });
  }

  render() {
    const showForm = this.state.showForm;
    const currentURL = this.props.location.pathname + this.props.location.search;

    return (
      <div className="feedback">
        <button
          className="feedback-button"
          onClick={() => this.openForm()}
          aria-haspopup="true"
          aria-expanded={showForm}
          aria-controls="feedback-menu"
        >
          Feedback
        </button>
        <FocusTrap
          focusTrapOptions={{
            onDeactivate: this.deactivateForm,
            clickOutsideDeactivates: true,
          }}
          active={showForm}
          id="feedback-menu"
          role="menu"
          className={`feedback-form-container${showForm ? ' active' : ''}`}
        >
          <form
            action={'https://docs.google.com/forms/d/e/1FAIpQLSc7PuMbOB6S0_cqqeZ6sIImw058r' +
              '_ebzhSGy34tnfAtuWKdVA/formResponse'}
            target="hidden_feedback_iframe"
            method="POST"
            onSubmit={() => this.onSubmitForm()}
          >
            <div>
              <label htmlFor="feedback-textarea-comment">
                Please provide your feedback about this page in the field below.
                <span className="nypl-required-field">&nbsp;Required</span>
              </label>
              <textarea
                id="feedback-textarea-comment"
                name="entry.148983317"
                rows="5"
                ref="commentText"
                aria-required="true"
                tabIndex="0"
              />
            </div>
            <div>
              <label htmlFor="feedback-input-email">Email Address</label>
              <input id="feedback-input-email" name="entry.503620384" type="email" />
            </div>
            <input
              id="feedback-input-url"
              name="entry.1973652282"
              value={currentURL}
              type="hidden"
            />
            <input name="fvv" value="1" type="hidden" />

            <button
              className={`cancel-button ${!showForm ? 'hidden' : ''}`}
              onClick={e => this.closeForm(e)}
              aria-expanded={!showForm}
              aria-controls="feedback-menu"
            >
              Cancel
            </button>

            <button type="submit" className="large">Submit</button>
          </form>
          <iframe name="hidden_feedback_iframe" title="NYPL Discovery Feedback Form" />
        </FocusTrap>
      </div>
    );
  }
}

Feedback.propTypes = {
  location: PropTypes.object,
};

export default Feedback;
