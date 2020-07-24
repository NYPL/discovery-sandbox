/* global alert */
import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import axios from 'axios';

import { trackDiscovery } from '../../utils/utils';
import appConfig from '../../data/appConfig';

const initialFields = {
  Email: '',
  Feedback: '',
};

class Feedback extends React.Component {
  constructor(props) {
    super(props);

    this.currentURL = (this.props.location.pathname +
    this.props.location.hash +
    this.props.location.search);

    this.state = {
      showForm: false,
      fields: Object.assign({
        URL: this.currentURL,
      }, initialFields),
    };

    this.commentText = React.createRef();

    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.deactivateForm = this.deactivateForm.bind(this);
  }

  onSubmitForm(e) {
    e.preventDefault();
    const { fields } = this.state;
    if (!fields.Feedback && !fields.Feedback.length) {
      this.commentText.current.focus();
    } else {
      this.postForm();
      this.setState({
        showForm: false,
        fields: Object.assign({ URL: this.currentURL }, initialFields),
      });
      trackDiscovery('Feedback', 'Submit');
    }
  }

  postForm() {
    const { fields } = this.state;
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
      // eslint-disable-next-line no-alert
    }).then(() => alert('Thank you, your feedback has been submitted.')).catch(console.error);
  }

  toggleForm() {
    trackDiscovery('Feedback', 'Open');
    this.setState(prevState => ({ showForm: !prevState.showForm }));
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
          onClick={() => this.toggleForm()}
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
                  value={fields.Feedback}
                  ref={this.commentText}
                  rows="5"
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
                  value={fields.Email}
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
