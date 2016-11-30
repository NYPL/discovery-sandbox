import React from 'react';

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
    const currentURL = location.pathname; // window.location.href

    return (
      <div className="feedback">
        <button className="feedback-button" onClick={() => this.toggleForm()}>Contribute feedback</button>
        <div className={`feedback-form-container${showForm ? ' active' : ''}`}>
          <form action="https://docs.google.com/a/nypl.org/forms/d/e/1FAIpQLScBYFs3wFjt4kHvlEFzbmGc_jTSk_-EllRDeDelhi8Vw8MvRg/formResponse" target="hidden_feedback_iframe" method="POST" onSubmit={() => this.onSubmitForm()}>
            <p>Contribute by submitting your feedback below or <a href="https://docs.google.com/document/d/13sdehgz2ujghkEphov252oaOca1rhM5bjPk023rQ3oc/edit?usp=sharing" target="_blank" rel="noopener noreferrer">learn more about this website</a>.</p>
            <label htmlFor="feedback-input-email">Your email address for follow-up questions (optional)</label>
            <input id="feedback-input-email" name="entry.871913172" type="email" />

            <label htmlFor="feedback-select-type">Type of feedback</label>
            <select id="feedback-select-type" name="entry.1122970066">
                <option value="Feature request">Feature request</option>
                <option value="Missing or incorrect information">Missing or incorrect information</option>
                <option value="Language / copy">Language / copy</option>
                <option value="Bug / error">Bug / error</option>
                <option value="Design / user interface">Design / user interface</option>
                <option value="Information architecture / navigation">Information architecture / navigation</option>
                <option value="Accessibility">Accessibility</option>
                <option value="Other">Other</option>
            </select>

            <label htmlFor="feedback-textarea-comment">Your comment</label>
            <textarea id="feedback-textarea-comment" name="entry.2040737274" rows="5" ref="commentText" required />

            <input id="feedback-input-url" name="entry.1861802843" value={currentURL} type="hidden" />
            <input name="fvv" value="1" type="hidden" />

            <button type="submit">Submit</button>
          </form>
          <iframe name="hidden_feedback_iframe" />
        </div>
      </div>
    );
  }
}

export default Feedback;
