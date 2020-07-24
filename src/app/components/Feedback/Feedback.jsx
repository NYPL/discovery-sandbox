/* global alert */
import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import axios from 'axios';

import { trackDiscovery } from '../../utils/utils';
import appConfig from '../../data/appConfig';

class Feedback extends React.Component {
  constructor(props) {
    super(props);

    this.initialFields = {
      URL: (this.props.location.pathname +
      this.props.location.hash +
      this.props.location.search),
      Feedback: '',
      Email: '',
    };

    this.state = {
      showForm: false,
      fields: this.initialFields,
    };
    this.commentText = React.createRef();

    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.deactivateForm = this.deactivateForm.bind(this);
  }

  onSubmitForm(e) {
    const { fields } = this.state;
    if (!fields.Feedback && !fields.Feedback.length) {
      this.commentText.current.focus();
    } else {
      e.preventDefault();
      axios({
        method: 'POST',
        url: appConfig.feedbackFormUrl,
        data: {
          fields,
        },
        headers: {
          Authorization: `Bearer ${appConfig.airtableApiKey}`,
          'Content-Type': 'application/json',
        },
      })
        .then(
          () => {
            this.setState({
              fields: this.initialFields,
            });
            // eslint-disable-next-line no-alert
            alert('Thank you, your feedback has been submitted.');
          })
        .catch(console.error);
      this.setState({ showForm: false });
      trackDiscovery('Feedback', 'Submit');
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

  handleInputChange(e) {
    const target = e.target;
    const value = target.value;
    const name = target.name;

    this.setState(prevState => ({
      fields: Object.assign(prevState.fields, { [name]: value }),
    }));
  }

  render() {
    const {
      showForm,
      fields,
    } = this.state;
    const currentURL = fields.URL;

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
        >
          <div
            role="menu"
            className={`feedback-form-container${showForm ? ' active' : ''}`}
            id="feedback-menu"
          >
            <form
              target="hidden_feedback_iframe"
              onSubmit={e => this.onSubmitForm(e)}
            >
              <div>
                <label htmlFor="feedback-textarea-comment">
                  Please provide your feedback about this page in the field below.
                  <span className="nypl-required-field">&nbsp;Required</span>
                </label>
                <textarea
                  id="feedback-textarea-comment"
                  name="Feedback"
                  value={fields.feedback}
                  rows="5"
                  ref={this.commentText}
                  aria-required="true"
                  tabIndex="0"
                  onChange={e => this.handleInputChange(e)}
                />
              </div>
              <div>
                <label htmlFor="feedback-input-email">Email Address</label>
                <input
                  id="feedback-input-email"
                  name="Email"
                  type="email"
                  value={fields.email}
                  onChange={e => this.handleInputChange(e)}
                />
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
          </div>
        </FocusTrap>
      </div>
    );
  }
}

Feedback.propTypes = {
  location: PropTypes.object,
};

export default Feedback;
