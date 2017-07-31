import React from 'react';
import PropTypes from 'prop-types';

class Feedback extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showForm: false,
    };
  }

  onSubmitForm() {
    this.setState({ showForm: false });
    alert('Thank you, your feedback has been submitted.');
  }

  toggleForm() {
    this.setState({
      showForm: !this.state.showForm,
    });
    this.refs.commentText.value = '';
  }

  render() {
    const showForm = this.state.showForm;
    const currentURL = this.props.location.pathname + this.props.location.search;

    return (
      <div className="feedback">
        <button className="feedback-button" onClick={() => this.toggleForm()}>
          Feedback
        </button>
        <div className={`feedback-form-container${showForm ? ' active' : ''}`}>
          <form
            action="https://docs.google.com/a/nypl.org/forms/d/e/1FAIpQLScnoQV5OjAP-Y9BOJ1PO9YpMdLjMyWn7VOTFSrDhCAP5ZN5Dw/formResponse"
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
                required
              />
            </div>
            <div>
              <label htmlFor="feedback-input-email">
                Email Address
                <span className="nypl-required-field">&nbsp;Required</span>
              </label>
              <input id="feedback-input-email" name="entry.503620384" type="email" required />
            </div>
            <input id="feedback-input-url" name="entry.1973652282" value={currentURL} type="hidden" />
            <input name="fvv" value="1" type="hidden" />

            <button type="submit" className="large">Submit</button>
          </form>
          <iframe name="hidden_feedback_iframe" title="NYPL Discovery Feedback Form" />
        </div>
      </div>
    );
  }
}

Feedback.propTypes = {
  location: PropTypes.object,
};

export default Feedback;
