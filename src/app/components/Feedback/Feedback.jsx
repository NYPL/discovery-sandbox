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
          <form action="https://docs.google.com/a/nypl.org/forms/d/e/1FAIpQLSdprxjM2cOj2qH1fxizsuHyZuaD1oia_dCu0D6hvJeWiK9eOw/formResponse"
            target="hidden_feedback_iframe"
            method="POST"
            onSubmit={() => this.onSubmitForm()}
          >
            <p>Please provide your feedback about this page in the field below.</p>
            <label htmlFor="feedback-input-email">Email Address</label>
            <input id="feedback-input-email" name="entry.503620384" type="email" />
            <label htmlFor="feedback-textarea-comment">Your comment</label>
            <textarea id="feedback-textarea-comment" name="entry.148983317" rows="5" ref="commentText" required />

            <input id="feedback-input-url" name="entry.1973652282" value={currentURL} type="hidden" />
            <input name="fvv" value="1" type="hidden" />

            <button type="submit">Submit</button>
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
