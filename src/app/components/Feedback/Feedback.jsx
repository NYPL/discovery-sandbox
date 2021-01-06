import React from 'react';
import PropTypes from 'prop-types';
import FocusTrap from 'focus-trap-react';
import axios from 'axios';
import { Button, ButtonTypes } from '@nypl/design-system-react-components';

import { trackDiscovery } from '../../utils/utils';
import appConfig from '../../data/appConfig';

const initialFields = () => ({
  email: '',
  feedback: '',
});

class Feedback extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showForm: false,
      fields: initialFields(),
      success: false,
    };

    this.commentText = React.createRef();
    this.emailInput = React.createRef();

    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.deactivateForm = this.deactivateForm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  onSubmitForm(url) {
    const { fields } = this.state;
    if (!fields.feedback && !fields.feedback.length) {
      this.commentText.current.focus();
    } else if (!fields.email && !fields.email.length) {
      this.emailInput.current.focus();
    } else {
      this.postForm(url);
      trackDiscovery('Feedback', 'Submit');
    }
  }

  postForm(url) {
    const { fields } = this.state;
    fields.url = url;
    axios({
      method: 'POST',
      url: `${appConfig.baseUrl}/api/feedback`,
      data: {
        fields,
      },
    }).then(() => {
      this.setState({
        fields: initialFields(),
        success: true,
      });
    }).catch(console.error);
  }

  toggleForm() {
    trackDiscovery('Feedback', 'Open');
    this.setState(prevState => ({ showForm: !prevState.showForm }));
  }

  deactivateForm() {
    trackDiscovery('Feedback', 'Close');
    this.setState({ showForm: false, success: false });
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
      success,
    } = this.state;
    const { submit } = this.props;

    return (
      <div className="feedback nypl-ds">
        <Button
          className="feedback-button"
          onClick={() => this.toggleForm()}
          attributes={{
            'aria-haspopup': 'true',
            'aria-expanded': showForm,
            'aria-controls': 'feedback-menu',
          }}
          buttonType={ButtonTypes.Secondary}
        >
          Help & Feedback
        </Button>
        <FocusTrap
          focusTrapOptions={{
            onDeactivate: this.deactivateForm,
            clickOutsideDeactivates: true,
          }}
          active={showForm}
        >
          <div
            role="menu"
            className={showForm ? 'active' : ''}
            id="feedback-menu"
          >
            <h1>We are here to help!</h1>
            {!success && (
              <form
                target="hidden_feedback_iframe"
                onSubmit={e => submit(this.onSubmitForm, e)}
              >
                <div>
                  <label htmlFor="feedback-textarea-comment">
                    Comments
                    <span className="nypl-required-field">&nbsp;Required</span>
                  </label>
                  <textarea
                    id="feedback-textarea-comment"
                    name="feedback"
                    value={fields.feedback}
                    ref={this.commentText}
                    rows="5"
                    aria-required="true"
                    tabIndex="0"
                    onChange={this.handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor="feedback-input-email">
                    Email Address
                    <span className="nypl-required-field">&nbsp;Required</span>
                  </label>
                  <input
                    name="email"
                    id="feedback-input-email"
                    type="email"
                    value={fields.email}
                    onChange={this.handleInputChange}
                    ref={this.emailInput}
                  />
                </div>
                <input name="fvv" value="1" type="hidden" />
                <a
                  href="https://www.nypl.org/help/about-nypl/legal-notices/privacy-policy"
                  className="privacy-policy"
                  target="_blank"
                >Privacy Policy
                </a>
                <Button
                  className={`cancel-button ${!showForm ? 'hidden' : ''}`}
                  onClick={e => this.deactivateForm(e)}
                  attributes={{
                    'aria-expanded': !showForm,
                    'aria-controls': 'feedback-menu',
                  }}
                  buttonType={ButtonTypes.Secondary}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  buttonType={ButtonTypes.Primary}
                  className="submit-button"
                >Submit
                </Button>
              </form>
            )}
            {success && (
              <p>
                Thank you for submitting your comments,
                if you requested a response, our service staff
                will get back to you as soon as possible.
              </p>
            )}
          </div>
        </FocusTrap>
      </div>
    );
  }
}

Feedback.propTypes = {
  submit: PropTypes.func,
};

export default Feedback;
